下面给出一套基于 OpenSSL 的自签 CA + 服务端证书 + 客户端证书的生成流程，你可以直接在 Linux／macOS 终端（或装了 OpenSSL 的 Windows）里执行：

---

## 一、生成根 CA（Certificate Authority）

1. **生成 CA 私钥**（4096 位）

   ```bash
   openssl genpkey \
     -algorithm RSA \
     -out ca.key \
     -pkeyopt rsa_keygen_bits:4096
   ```
2. **生成自签的根证书**（有效期 10 年，可按需调整）

   ```bash
   openssl req -x509 -new \
     -key ca.key \
     -sha256 \
     -days 3650 \
     -subj "/C=CN/ST=Guangdong/L=Shenzhen/O=MyOrg CA/CN=MyRootCA" \
     -out ca.pem
   ```

   * `ca.key`：私钥
   * `ca.pem`：自签根证书，用于客户端的 Certificate Authority(.pem)

---

## 二、生成服务端证书（供 MongoDB Server 使用，可省略 Atlas）

1. **生成服务端私钥**

   ```bash
   openssl genpkey \
     -algorithm RSA \
     -out server.key \
     -pkeyopt rsa_keygen_bits:4096
   ```
2. **生成服务端 CSR（证书签名请求）**

   ```bash
   openssl req -new \
     -key server.key \
     -subj "/C=CN/ST=Guangdong/L=Shenzhen/O=MyOrg Server/CN=YOUR IP" \
     -out server.csr
   ```
3. **准备扩展配置文件**（`server.ext`），指定 SAN 和 服务器认证用途：

   ```ini
   subjectAltName = DNS:localhost,IP:127.0.0.1,IP:YOUR IP
   extendedKeyUsage = serverAuth
   keyUsage = digitalSignature, keyEncipherment
   ```
4. **用 CA 签发服务端证书**

   ```bash
   openssl x509 -req \
     -in server.csr \
     -CA ca.pem -CAkey ca.key -CAcreateserial \
     -out server.crt \
     -days 365 \
     -sha256 \
     -extfile server.ext
   ```
5. **合并为一个 .pem**（MongoDB 通常读取一个包含 key+cert 的文件）

   ```bash
   cat server.key server.crt > server.pem
   ```

   * 之后把 `server.pem`（和可选的 `ca.pem`）放到 MongoDB 配置里，或 Atlas 上传时用到。

---

## 三、生成客户端证书 & 私钥（用于双向认证）

1. **生成客户端私钥**

   ```bash
   openssl genpkey \
     -algorithm RSA \
     -out client.key \
     -pkeyopt rsa_keygen_bits:4096
   ```
2. **生成客户端 CSR**

   ```bash
   openssl req -new \
     -key client.key \
     -subj "/C=CN/ST=Guangdong/L=Shenzhen/O=MyOrg Client/CN=mongo-client" \
     -out client.csr
   ```
3. **准备扩展配置文件**（`client.ext`），指定客户端认证用途：

   ```ini
   extendedKeyUsage = clientAuth
   keyUsage = digitalSignature, keyEncipherment
   ```
4. **用 CA 签发客户端证书**

   ```bash
   openssl x509 -req \
     -in client.csr \
     -CA ca.pem -CAkey ca.key -CAcreateserial \
     -out client.crt \
     -days 365 \
     -sha256 \
     -extfile client.ext
   ```
5. **合并为一个 .pem**（供 Compass／驱动上传）

   ```bash
   cat client.key client.crt > client.pem
   ```

   * `client.pem` 即包含私钥+证书，填到 Compass 的 “Client Certificate and Key (.pem)” 一栏。

---

### 用法小贴士

* **CA 证书 `ca.pem`**：上传到 Compass “Certificate Authority(.pem)” 或命令行 `--tlsCAFile`／驱动 `tlsCAFile`。
* **客户端 `client.pem`**：如果你在 Compass 勾选双向认证（X.509 auth），就填在 “Client Certificate and Key(.pem)”；在驱动里也可用 `tlsCertificateKeyFile` 指向它。
* **证书有效期、字段**：可按自己需求调整 `-days`、`-subj`，以及 SAN 里加上你的域名或 IP。

按上面流程，就能完整地自建 CA 并签发服务端／客户端证书，保证 TLS 加密和双向认证均可用。

客户端如何连接 单向 TLS 只需：
1. 客户端持有 **CA 证书** `ca.pem`，用来校验服务端证书合法性。
2. 在连接字符串或驱动／CLI 参数里指定 `tls=true`（或 `--tls`）和 `tlsCAFile=ca.pem`。
```bash
mongo --host YOUR_SERVER_IP --port 20002 \
  --tls \
  --tlsCAFile /path/to/ca.pem \
  -u pubgselfservice -p pubgselfservice --authenticationDatabase admin

```
```ts
import { DataSource, DataSourceOptions } from 'typeorm';
const databaseType: DataSourceOptions['type'] = 'mongodb';
const { MONGODB_CONFIG } = getConfig()
const MONGODB_DATABASE_CONFIG = {
  ...MONGODB_CONFIG,
  type: databaseType,
}
if(environment == 'dev') {
  const SSL_DIR = path.resolve(process.cwd(), 'ssl');
  const CA_PATH     = path.join(SSL_DIR, 'ca.pem');
  MONGODB_DATABASE_CONFIG.ssl = true
  MONGODB_DATABASE_CONFIG.sslValidate = true
  MONGODB_DATABASE_CONFIG.sslCA = [ fs.readFileSync(CA_PATH) ]
}
const MONGODB_DATA_SOURCE = new DataSource(MONGODB_DATABASE_CONFIG)
```
换句话说：

* **单向 TLS（只保证传输加密）**：客户端只要有 `ca.pem`，不需要 `client.pem`。
* **双向 TLS（mTLS，服务器强制校验客户端）**：客户端除了 `ca.pem`，还要用 `client.pem`（包含客户端私钥和证书）去做身份校验。

如果你的需求只是加密通信，而不需要用 X.509 做用户认证，就不必生成或上传 `client.pem`。



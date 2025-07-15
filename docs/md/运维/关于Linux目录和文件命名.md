在大多数类 UNIX 系统中（包括 Linux），关于目录和文件命名有一套业界广泛遵循的“文件系统层次标准”（Filesystem Hierarchy Standard, FHS）以及若干通用约定。下面分几个维度来聊聊这些约定：

---

## 1. 文件系统层次标准（FHS）

* **根目录（/**）：所有文件和目录的最顶层。
* **/bin、/sbin、/lib**

  * `/bin`：系统启动与运行时最基本的可执行程序（如 `ls`, `cp`）。
  * `/sbin`：只有系统管理员使用的系统工具（如 `fdisk`, `ifconfig`）。
  * `/lib`：上述程序所依赖的共享库。
* **/usr**

  * `/usr/bin`：普通用户命令的二进制文件。
  * `/usr/sbin`：仅供管理员使用的二进制。
  * `/usr/lib`：对应的库文件。
* **/etc**：配置文件目录，按服务或软件分子目录管理（如 `/etc/nginx/nginx.conf`）。
* **/var**：可变数据，如日志（`/var/log`）、邮件（`/var/mail`）、运行时文件（`/var/run`）等。
* **/opt**：可选的第三方软件包。
* **/home**：用户主目录。
* **/srv**：提供服务的数据根目录（如 FTP、HTTP 的网站根）。

这些目录名几乎在所有 Linux 发行版间保持一致，用来区分“静态”与“可变”、系统级与用户级、标准包与第三方包。

---

## 2. 全局命名约定

1. **小写字母**

   * 目录名与文件名尽量全用小写（避免大小写敏感带来的混淆）。
2. **单词分隔**

   * 首选连字符 `-`（比如 `my-app`），次选下划线 `_`（比如 `my_app`）。
   * 不要用空格或其他符号（`@`, `#`, `!` 等）。
3. **语义化命名**

   * 用能直接反映内容或功能的英文单词／缩写，如 `config`, `logs`, `cache`，而非拼音或中文。
4. **避免特殊字符**

   * 除了 `-`、`_`、`.`（用于后缀）以外，不要在文件路径里用空格、逗号、星号等易引发转义／解析问题的符号。
5. **英文单数 vs. 复数**

   * 目录一般用复数（`logs`, `modules`），文件名一般用单数（`nginx.conf`, `user.service`）。

---

## 3. 后缀／约定式子目录

* **后缀约定**

  * `.conf`：配置文件。
  * `.service`、`.socket`、`.timer`：systemd 单元文件。
  * `.d`：表示“drop-in”或片段目录（如 `/etc/systemd/system/nginx.service.d/`、`/etc/apt/apt.conf.d/`）。
* **子目录约定**

  * `…/conf.d/`：将主配置拆分成多个小文件，依加载顺序管理。
  * `…/sites-available/` vs. `…/sites-enabled/`：Nginx/Apache 中，available 放所有站点配置，enabled 通过符号链接来启用。
  * `…/logs/`：日志文件夹，通常与可执行或服务同级。

---

## 4. 应用与自定义部署

* **/usr/local**

  * `/usr/local/bin`、`/usr/local/lib`：在系统包之外编译安装的软件。优先级高于 `/usr`，系统升级不会覆盖。
* **/opt/**

  * 适合“一整包”第三方应用，如 `/opt/google/chrome`、`/opt/mycompany/app-v1.2.3`。
* **按项目分层**

  * 例如 Web 项目：

    ```
    /opt/myapp/
      ├─ bin/           # 可执行脚本
      ├─ conf/          # 配置文件
      ├─ logs/          # 日志
      ├─ data/          # 运行时数据/缓存
      └─ www/           # 静态资源或前端代码
    ```

---

## 5. 用户级 vs 系统级

* **系统级路径**

  * 需要 root 权限，存放全局服务／配置，见 FHS 标准目录。
* **用户级路径**

  * 大多数发行版支持 `~/.config/`、`~/.local/share/`、`~/.cache/`，用于用户应用配置、数据与缓存，遵循 [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)。
  * 例如：`~/.config/foobar/config.yaml`，`~/.local/share/foobar/data.db`，`~/.cache/foobar/tmp/`。

---

### 小结

* **FHS** 定义了系统级目录的语义与层级；
* **全局命名约定**（小写、连字符、语义化）保证可维护性与可移植性；
* **后缀与子目录**（`.conf`、`.d`、`sites-available` 等）则是社区／工具演化出的最佳实践；
* **/usr/local** 和 **/opt** 用于隔离第三方或手工编译的软件；
* **XDG 规范** 则为普通用户级应用提供了统一的配置与数据目录。

遵循这些约定，能让系统更清晰、运维更可预测，也方便团队协作与自动化管理。

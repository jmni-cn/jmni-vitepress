
# 拿到一个全新的 Debian 12.10 64位云服务器操作系统后，从0开始部署 nginx、certbot、git、docker、docker compose、python3.10.6

> 适用于：刚拿到云服务器的用户 / 初级运维 / 开发
> 目标：从裸机到可部署 Web 服务的标准环境

---

# 0）系统初始化

## 更新系统

```bash
sudo apt update && sudo apt upgrade -y
```

## 基础工具

```bash
sudo apt install -y curl wget vim unzip lsof net-tools ca-certificates
```

---

# 1）安装 Git（代码管理）

```bash
sudo apt install -y git
git --version
```

---

# 2）安装 Docker + Docker Compose（核心运行环境）

## 2.1 删除旧版本

```bash
sudo apt remove -y docker docker-engine docker.io containerd runc || true
```

## 2.2 安装依赖

```bash
sudo apt install -y ca-certificates curl gnupg lsb-release
```

## 2.3 添加官方源

```bash
sudo install -m 0755 -d /etc/apt/keyrings

curl -fsSL https://download.docker.com/linux/debian/gpg \
| sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/debian \
$(. /etc/os-release && echo $VERSION_CODENAME) stable" \
| sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

## 2.4 安装 Docker

```bash
sudo apt update

sudo apt install -y docker-ce docker-ce-cli containerd.io \
docker-buildx-plugin docker-compose-plugin
```

## 2.5 启动并设置开机自启

```bash
sudo systemctl enable --now docker
```

## 2.6 验证

```bash
docker --version
docker compose version
```

## 2.7（推荐）免 sudo 使用 docker

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

# 3）安装 Nginx（Web 网关）

```bash
sudo apt install -y nginx
sudo systemctl enable --now nginx
nginx -v
```

浏览器访问服务器 IP 应该能看到 Nginx 默认页。

---

# 4）安装 Certbot（HTTPS 证书）

```bash
sudo apt install -y certbot python3-certbot-nginx
```

申请证书（示例）：

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

自动续期（Debian 已自带 timer）：

```bash
sudo systemctl enable --now certbot.timer
```

测试续期：

```bash
sudo certbot renew --dry-run
```

---

# 5）安装 Python 3.10.6（源码编译）

> Debian 12 默认 Python 3.11，这里安装 3.10.6 用于兼容项目

## 5.1 安装依赖

```bash
sudo apt install -y build-essential zlib1g-dev \
libncurses5-dev libgdbm-dev libnss3-dev \
libssl-dev libreadline-dev libffi-dev curl
```

## 5.2 下载源码

```bash
cd /usr/src
sudo wget https://www.python.org/ftp/python/3.10.6/Python-3.10.6.tgz
sudo tar xzf Python-3.10.6.tgz
cd Python-3.10.6
```

## 5.3 编译安装

```bash
sudo ./configure --enable-optimizations
sudo make -j$(nproc)
sudo make altinstall
```

## 5.4 验证

```bash
python3.10 --version
```

---

# 6）验证 Docker 运行

```bash
docker run --rm hello-world
```

---

# 7）推荐目录结构（生产规范）

```bash
/jmni
├── config/        # 配置文件（nginx / compose / env）
├── dockerdata/    # 数据卷（数据库 / redis 等）
├── logs/          # 日志统一目录
│   ├── nginx/
│   ├── docker/
│   └── server/
├── server/        # 后端代码
├── webapp/        # 前端构建产物
└── static/        # 静态资源
```

👉 原则：

* 配置与代码分离
* 数据必须持久化（dockerdata）
* 日志统一管理（方便 logrotate）

---

# 8）systemctl 服务管理（重点）

systemctl 是 Linux 上 **服务管理核心工具**

## 常用命令

```bash
systemctl start nginx      # 启动
systemctl stop nginx       # 停止
systemctl restart nginx    # 重启
systemctl reload nginx     # 平滑重载（推荐）
systemctl status nginx     # 查看状态

systemctl enable nginx     # 开机自启
systemctl disable nginx    # 取消自启
```

👉 区别：

| 命令      | 说明           |
| ------- | ------------ |
| restart | 会中断连接        |
| reload  | 平滑更新配置（生产推荐） |

---

# 9）systemctl 定时任务（Timer）

在 Debian 12 中，**cron 已逐步被 systemd timer 替代**

## 查看所有定时任务

```bash
systemctl list-timers
```

---

## 示例：Certbot 自动续期

```bash
systemctl status certbot.timer
```

它会定期执行：

```bash
certbot.service
```

---

## 示例：创建自己的定时任务

### 1）创建 service

```bash
sudo vim /etc/systemd/system/backup.service
```

```ini
[Unit]
Description=Backup Script

[Service]
Type=oneshot
ExecStart=/usr/bin/bash /jmni/backup.sh
```

---

### 2）创建 timer

```bash
sudo vim /etc/systemd/system/backup.timer
```

```ini
[Unit]
Description=Run backup daily

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

---

### 3）启用

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload

sudo systemctl enable --now backup.timer
```

---

### 4）查看执行情况

```bash
systemctl list-timers
journalctl -u backup.service
```

---

# 10）总结

你现在已经完成：

✅ 系统初始化
✅ Git 安装
✅ Docker + Compose 环境
✅ Nginx Web 服务
✅ HTTPS 自动证书（Certbot）
✅ Python 3.10.6
✅ systemctl 服务管理
✅ systemd 定时任务

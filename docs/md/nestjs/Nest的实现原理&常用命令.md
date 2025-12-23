---
title: "Nest的实现原理"
tag: "nestjs"
classify: "md"
description: "Nest的实现原理"
pubDate: "2024/9/18 14:19:29"
heroImage: ""
---

调用 `Reflect.defineMetadata` 来给这个类添加了一些元数据。
后面创建 IOC 容器的时候就会取出这些元数据来处理

Nest 的实现原理就是通过装饰器给 class 或者对象添加元数据，然后初始化的时候取出这些元数据，进行依赖的分析，然后创建对应的实例对象就可以了。

TypeScript 支持编译时自动添加一些 metadata 数据
**通过装饰器给 class 或者对象添加 metadata，并且开启 ts 的 emitDecoratorMetadata 来自动添加类型相关的 metadata，然后运行的时候通过这些元数据来实现依赖的扫描，对象的创建等等功能。**

---

##  常用相关命令一览表

| 目的              | 命令示例                                          |
| --------------- | --------------------------------------------- |
| 新建 Nest 项目      | `nest new my-project`                         |
| 生成 REST CRUD 资源 | `nest g resource <name>`                      |
| 生成模块           | `nest g module <name>`                        |
| 生成控制器          | `nest g controller <name>`                    |
| 生成服务           | `nest g service <name>`                       |
| 生成类             | `nest g class <name>`                         |
| 生成接口           | `nest g interface <name>`                     |
| 生成 provider      | `nest g provider <name>`                      |
| 启动项目           | `nest start`                                  |
| 启动项目（watch）    | `nest start --watch`                          |
| 构建项目           | `nest build`                                  |
| 测试项目           | `nest test`                                   |
---

##  常用 monorepo 相关命令一览表

| 目的              | 命令示例                                          |
| --------------- | --------------------------------------------- |
| 新建 Nest 项目      | `nest new my-project`                         |
| 新增子应用（app）      | `nest g app admin-api`                        |
| 新增库（lib）        | `nest g lib shared`                           |
| 在指定 app 里加模块    | `nest g module users --project=admin-api`     |
| 在指定 app 里加控制器   | `nest g controller users --project=admin-api` |
| 在指定 app 里加服务    | `nest g service users --project=admin-api`    |
| 在指定 lib 里加模块    | `nest g module utils --project=shared`        |
| 启动指定 app        | `nest start admin-api`                        |
| 启动指定 app（watch） | `nest start admin-api --watch`                |
| 构建指定 app        | `nest build admin-api`                        |
| 测试指定 app        | `nest test admin-api`                         |+


## 1. 项目级命令（new / start / build / test）

### 1.1 创建项目

```bash
nest new my-project
```

常用参数：

* `--package-manager npm|yarn|pnpm`：指定包管理器
* `--skip-git`：不初始化 git
* `--skip-install`：只生成代码，不安装依赖

---

### 1.2 启动项目

```bash
# 最常用（等价于 npm run start）
nest start

# 监听文件变更（开发模式，等价于 npm run start:dev）
nest start --watch

# 指定环境
nest start --watch --debug

# monorepo 下启动某个子应用
nest start admin-api --watch
```

---

### 1.3 构建项目

```bash
# 打包构建（等价于 npm run build）
nest build

# monorepo 下构建指定项目
nest build admin-api

# 构建时显示详细日志
nest build --verbose
```

> 一般搭配 Docker 或 CI 用。

---

### 1.4 测试相关

```bash
# 单元测试（等价于 npm run test）
nest test

# 监听模式，代码变更自动跑 test
nest test --watch

# 覆盖率报告
nest test --coverage

# monorepo 下指定项目
nest test admin-api
```

E2E 测试：

```bash
nest e2e
nest e2e --watch
```

---

## 2. 代码生成（最常用的那一类：generate / g）

最常用：生成一个 REST CRUD 资源
```bash
nest g resource <name>
# 例如：
nest g resource users
```
选完之后，CLI 会生成一整套东西：
```
src/users/
  users.module.ts
  users.service.ts
  users.controller.ts
  dto/
    create-user.dto.ts
    update-user.dto.ts
  entities/
    user.entity.ts

```

核心命令：

```bash
nest generate <schematic> <name> [options]
# 或简写：
nest g <schematic> <name> [options]
```

常见 schematic 有：

### 2.1 module（模块）

```bash
nest g module users
# monorepo：指定项目
nest g module users --project=admin-api
```

### 2.2 controller（控制器）

```bash
nest g controller users
nest g controller users --project=admin-api
```

常用参数：

* `--flat`：不生成文件夹，直接在当前目录下生成文件
* `--no-spec`：不生成测试用例文件

例子：

```bash
nest g controller users --no-spec --flat
```

### 2.3 service（服务）

```bash
nest g service users
nest g service users --project=admin-api
```

同样支持 `--flat` / `--no-spec`。

### 2.4 provider / class / interface 等

```bash
# 普通类
nest g class common/logger

# 接口
nest g interface user/user-profile

# provider
nest g provider user/user-repository
```

### 2.5 app / lib（monorepo 用得多）

```bash
# 新建子应用
nest g app admin-api
nest g app client-api

# 新建库
nest g lib shared
nest g lib domain-user
```

---

## 3. 辅助信息与工具（info / update / add）

### 3.1 查看项目信息

```bash
nest info
```

会输出：

* Nest 版本
* Node 版本
* TypeScript 版本
* 操作系统信息
* 包管理器信息

排查环境问题挺好用。

---

### 3.2 更新 Nest（官方脚手架升级）

```bash
nest update
```

> 帮你把依赖升级到推荐版本（注意要看 changelog，小版本还好，大版本注意 breaking changes）。

---

### 3.3 增加官方/社区集成（某些版本有 `add`）

新版 CLI 有一些插件式的 add（类似 `ng add` 的思路），比如：

```bash
nest add @nestjs/swagger
nest add @nestjs/config
```

（这个具体能 add 什么看当前版本 CLI 的帮助）

---

## 4. 常用全局帮助命令

### 4.1 查看所有命令

```bash
nest --help
```

### 4.2 查看某个命令的帮助

```bash
nest generate --help
nest start --help
nest build --help
```

---

## 5. 常见组合用法示例

### 5.1 快速搭一个模块（含 controller + service）

```bash
nest g module users --project=admin-api
nest g controller users --project=admin-api
nest g service users --project=admin-api
```

然后在 `UsersModule` 里把 `UsersService`、`UsersController` 注册一下，直接就能跑。

---

### 5.2 搭建 monorepo 的两个服务 + 一个共享库

```bash
nest new my-platform
cd my-platform

nest g app admin-api
nest g app client-api
nest g lib shared
```

配合启动：

```bash
nest start admin-api --watch
nest start client-api --watch
```

---

### 5.3 生成 DTO / 类型文件

```bash
nest g class users/dto/create-user.dto --flat
nest g class users/dto/update-user.dto --flat
```

---


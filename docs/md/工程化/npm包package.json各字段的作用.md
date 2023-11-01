---
title: "npm包package.json各字段的作用"
tag: "工程化"
classify: "md"
description: "npm包package.json各字段的作用"
pubDate: "2023/11/1 16:22:34"
heroImage: ""
---

> package.json文件可以使你的npm包对于其他人来说更容易管理和下载。发布npm包也是必须要有该文件的。

## name
> npm包的名字，必须是一个小写的单词，可以包含连字符-和下划线_。发布时必填。

## version
> npm包的版本号，必须是x.x.x的形式，并且遵循语义化版本规则。发布时必填。

[版本语义可以看这篇文章](https://blog.jmni.cn/md/%E8%A7%84%E8%8C%83/%E5%BC%80%E5%8F%91%E8%A7%84%E8%8C%83.html)
> 版本号不存在十进制说法，当代码一直处于同一阶段更新时，版本号可以一直增加、1.0.39、1.24.5都是可以的。

## description
> npm包的简短描述，它会显示在npm官方搜索的列表中。

## keywords
> npm包的关键词，是一个字符串数组，可以帮助其他人在npm搜索列表中发现你的包。

## homepage
> npm包项目主页地址，可以是托管平台的地址。

## bugs
> npm包问题反馈的地址，可以是github的issue或者是邮箱地址。对于那些使用遇到问题的人很有帮助。

## license
> 为npm包指定许可证，以便其他人知道他们被允许使用方式以及该npm包被施加的任何限制

## author
> npm包的作者，电子邮件和网站都是可以
```json
"author": {
  "name" : "jmni",
  "email" : "1711008052@qq.com",
  "url" : "https://github.com/jmni-cn"
}
```

## files
> npm包作为依赖安装时要包括的文件，格式是文件正则的数组，["*"]代表所有文件。也可以使用npmignore 来忽略个别文件。 files字段优先级最大，不会被npmignore和.gitignore覆盖。
```json
"files": [
    "lib",
    "scripts"
  ],
```
以下文件总是被包含的，与配置无关
- package.json
- README.md
- CHANGES / CHANGELOG / HISTORY
- LICENCE / LICENSE

以下文件总是被忽略的，与配置无关
- .git
- .DS_Store
- node_modules
- .npmrc
- npm-debug.log
- package-lock.json

## main
> 指定npm包的入口文件，例 `"main": "./lib/index.cjs.js"`当`require(name)`的时候实质是引入了该文件。

## bin
> 开发可执行文件时，bin字段可以帮助你设置链接，不需要手动设置PATH。
```json
"bin" : { 
  "jmni" : "./cli.js" 
}
```
当像上面这样指定时，下载npm包，会自动链接`cli.js`到`use/local/bin/jmni`，可以直接在命令行执行`jmni`实质上执行的是npm包的`cli,js`文件，需要在可执行文件头部加上`#!/usr/bin/env node`，否则会在没有node的时候执行。当只有一个可执行文件且名字和包名一样，可以直接写成字符串形式。
```json
"bin": "./cli.js"
```

## repository
> npm包托管的地方，对于想贡献代码的人是有帮助的。
```json
"repository": {
  "type": "git",
  "url": "https://github.com/jmni-cn/"
}
```

## scripts
> 可执行的命令。[具体文档](https://docs.npmjs.com/misc/scripts)
```json
"scripts": {
  "dev": "cross-env NODE_ENV=development node server.js",
  "build": "cross-env NODE_ENV=production node server.js"
}
```

## dependencies
> npm包所依赖的其他npm包，当使用`npm install` 下载该包时，`dependencies`中指定的包都会一并被下载。指定版本范围的规则如下：
- version 严格匹配
- > version 必须大于该版本
- <= version 必须小于等于该版本
- ^version 兼容版本
- 1.2.x 1.2.0, 1.2.1等，不能是1.3x
- [等等](https://docs.npmjs.com/files/package.json.html#dependencies)

## devDependencies
> npm包所依赖的构建和测试相关的npm包，放置到`devDependencies`，当使用`npm install` 下载该包时，`devDependencies`中指定的包不会一并被下载。

## peerDependencies
> 指定npm包与主npm包的兼容性，当开发插件时是需要的，例如开发React组件时，其组件是依赖于`react`、`react-domnpm`包的，可以在`peerDependencies`指定需要的版本。
```json
"peerDependencies": {
  "react": ">=16.8.0",
  "react-dom": ">=16.8.0"
}
```

## engines
> 指定npm包可以使用的Node版本
```json
"engines" : {
  "node" : ">=12.0.0"
}
```

## 参考
[npm官方文档](https://docs.npmjs.com/files/package.json.html)



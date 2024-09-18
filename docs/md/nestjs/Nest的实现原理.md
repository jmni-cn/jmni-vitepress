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

---
title: "nestjs基础"
tag: "nestjs"
classify: "md"
description: "nestjs基础"
pubDate: "2024/1/19 14:35:29"
heroImage: ""
---

## 1. Spring三层架构
- Controller层俗称控制层，负责请求转发，接收页面（前端H5或者App）传过来的参数，并调用Service层中定义的方法进行业务操作，再将处理结果返回前端。

- Service层被称作业务逻辑层。顾名思义，它处理逻辑上的业务，而不去考虑具体的实现。

- DAO（Data Access Object） 模型就是写一个类，把访问数据库的代码封装起来，DAO在数据库与业务逻辑（Service）之间。

> Dao是数据访问层，Dao的作用是封装对数据库的访问：增删改查，不涉及业务逻辑，只是达到按某个条件获得指定数据的要求。

## 2. Object
- `VO（View Object）`：视图对象，用于展示层，它的作用是把某个指定页面（或组件）的所有数据封装起来。
- `DTO（Data Transfer Object）`：数据传输对象，这个概念来源于J2EE的设计模式，原来的目的是为了EJB的分布式应用提供粗粒度的数据实体，以减少分布式调用的次数，从而提高分布式调用的性能和降低网络负载，但在这里，更符合泛指用于展示层与服务层之间的数据传输对象。
- `BO（Business Object）`：业务对象，把业务逻辑封装为一个对象，这个对象可以包括一个或多个其它的对象。
- `PO（Persistent Object）`：持久化对象，它跟持久层（通常是关系型数据库）的数据结构形成一一对应的映射关系，如果持久层是关系型数据库，那么，数据表中的每个字段（或若干个）就对应PO的一个（或若干个）属性。
- `DO（Domain Object）`：领域对象，就是从现实世界中抽象出来的有形或无形的业务实体。

基于Spring Boot的逻辑分层结构
![nestjs1.png](//static.jmni.cn/blog/img/edf00b35c7d0d53a35eb.png)

## TypeORM
如果直接使用Node.js操作MySQL提供的接口， 那么编写的代码就比较底层

```js
// 向数据库中插入数据 
connection.query(`INSERT INTO pocket_article (title, content) VALUES ('${title}', '${content}')`,
    (err, data) => {
    if (err) { 
    console.error(err) 
    } else {
    console.log(data) 
    }
})
```
考虑到数据库表是一个二维表，包含多行多列,每一行可以用一个JavaScript对象来表示， 比如第一行:
```json
{
    id: 108,
    author_ad:"xxx",
    ctime: "",
    mtime: "",
    is_hidden: 0,
}
```
这就是ORM技术（Object-Relational Mapping）,把关系数据库的表结构映射到对象上
所以就出现了Sequelize、typeORM、Prisma这些ORM框架来做这个转换（如后端开发常用的Mybatics也属于ORM）

在nestjs中，根据Nest官网提供的方法，在app.module使用TypeOrmModule做连接即可

## CURD
使用Nest CLI `nest g resource user `命令, 快速创建一个`CURD` 模块

## 请求异常统一处理
### 拦截器
拦截器具有一系列有用的功能，这些功能受面向切面编程AOP（Aspect Oriented Programming）技术的启发。它们可以：

- 在函数执行之前/之后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据所选条件完全重写函数 (例如, 缓存目的)

## 1. 创建全局拦截器统一响应体格式
> 拦截器 handle()返回一个Observable。这个流包含来自路由处理程序返回的值，因此我们可以使用RxJS的pipe()、map()等操作符轻松地对其进行变换
使用RxJS操作符来操作流的可能性为我们提供了许多功能，具体可以查看 [RxJS官网](https://rxjs.dev/api/index/function/map) 使用方法~

拦截器代码：
使用拦截器来实现”响应成功后的数据转换拦截器“

> 使用RxJS的map()操作符将响应对象分配给新创建的对象的data属性，然后将新对象返回给客户端
```ts
//common/interceptors/transform.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Response<T> {
    data: T;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((data) => ({
                data,
                code: 0,
                success: true,
                ts:new Date().getTime()
            })),
        );
    }
}
```
> 由于handle()方法返回一个Observable，我们可以使用强大的RxJS操作符进一步操控响应。使用面向切面编程AOP的术语，路由处理程序的调用（即调用handle()）被称为切入点（Pointcut），指示这是插入附加逻辑的点

## 2. 创建异常过滤器

```ts
//common/exceptions/http.exception.filter.ts
import { FastifyReply, FastifyRequest } from "fastify";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BusinessException } from "./business.exception";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();

    // 处理业务异常
    if (exception instanceof BusinessException) {
      const error = exception.getResponse();
      response.status(HttpStatus.OK).send({
        data: null,
        code: error['code'],
        message: error['message'],
        success: false,
        ts:new Date().getTime()
      });
      return;
    }
    
    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse(),
    });
  }
}
```
```ts
//common/exceptions/base.exception.filter.ts
import { FastifyReply, FastifyRequest } from "fastify";

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  ServiceUnavailableException,
  HttpException,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    request.log.error(exception)

    // 非 HTTP 标准异常的处理。
    response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: new ServiceUnavailableException().getResponse(),
    });
  }
}
```

## 3. 最后需要在main.ts中全局注册
```ts
// main.ts

...
import { AllExceptionsFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  ...
  
  // 全局拦截器统一响应体格式
  app.useGlobalInterceptors(new TransformInterceptor());
  // 异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // 接口版本化管理
  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL, '1'],
    type: VersioningType.URI,
  });
  
  await app.listen(3000);
}
bootstrap();
```


```ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

@Module({
  providers: [
    // 数据转换拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
```
> 当使用这种方法来进行拦截器的依赖注入时，无论在哪个模块中使用此构造，实际上拦截器是全局的

**过滤器和拦截器实现都是三部曲：创建 > 实现 > 注册**

## 接口入参校验`class-validator`
NestJS中的管道就是专门用来做数据转换
> 管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口。 
> 管道有两个类型:
> 转换：管道将输入数据转换为所需的数据输出 
> 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常;

管道在异常区域内运行。这意味着当抛出异常时，它们由核心异常处理程序和应用于当前上下文的 异常过滤器 处理。当在 Pipe 中发生异常，controller 不会继续执行任何方法。

通俗来讲就是，对请求接口的入参进行验证和转换的前置操作，验证好了我才会将内容给到路由对应的方法中去，失败了就进入异常过滤器中。

NestJS自带了三个开箱即用的管道：ValidationPipe、ParseIntPipe和ParseUUIDPipe, 其中ValidationPipe 配合class-validator就可以完美的实现我们想要的效果（对参数类型进行验证，验证失败抛出异常）。

## 文档生成（Swagger）


[NestJS官方文档](http://nestjs.inode.club/)

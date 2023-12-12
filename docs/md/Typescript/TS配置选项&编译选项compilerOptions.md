---
title: "TS配置选项&编译选项compilerOptions"
tag: "Typescript"
classify: "md"
description: "Typescript配置选项各字段的作用"
pubDate: "2023/12/12 16:30:34"
heroImage: ""
---

## 初始化
先安装 TypeScript，我们使用 tsc --init 可以初始化一个` tsconfig.json`文件，通过对配置文件的设置可以进行自定义的ts编译。
```shell
npm i typescript -D
npx tsc --init
```
然后我们需要添加修改` tsconfig.json`的配置项，如下：
```json
{
  "compilerOptions": {
    /* Basic Options */
    "baseUrl": ".", // 模块解析根路径，默认为 tsconfig.json 位于的目录
    "rootDir": "src", // 编译解析根路径，默认为 tsconfig.json 位于的目录
    "target": "ESNEXT", // 指定输出 ECMAScript 版本，默认为 es5
    "module": "ESNext", // 指定输出模块规范，默认为 Commonjs
    "lib": ["ESNext", "DOM"], // 编译需要包含的 API，默认为 target 的默认值
    "outDir": "dist", // 编译输出文件夹路径，默认为源文件同级目录
    "sourceMap": true, // 启用 sourceMap，默认为 false
    "declaration": true, // 生成 .d.ts 类型文件，默认为 false
    "declarationDir": "dist/types", // .d.ts 类型文件的输出目录，默认为 outDir 目录
    /* Strict Type-Checking Options */
    "strict": true, // 启用所有严格的类型检查选项，默认为 true
    "esModuleInterop": true, // 通过为导入内容创建命名空间，实现 CommonJS 和 ES 模块之间的互操作性，默认为 true
    "skipLibCheck": true, // 跳过导入第三方 lib 声明文件的类型检查，默认为 true
    "forceConsistentCasingInFileNames": true, // 强制在文件名中使用一致的大小写，默认为 true
    "moduleResolution": "Node", // 指定使用哪种模块解析策略，默认为 Classic
  },
  "include": ["src"] // 指定需要编译文件，默认当前目录下除了 exclude 之外的所有.ts, .d.ts,.tsx 文件
} 
```
## 配置选项
官方文档：[www.typescriptlang.org/tsconfig](www.typescriptlang.org/tsconfig)

### include
- 是一个数组，用来指定需要编译的ts文件，其中 *表示任意文件 **表示任意目录
- 默认值：["**/*"]
```json
"include":["src/**/*", "test/**/*"] // 所有src目录和test目录下的文件都会被编译
```

### exclude
- 定义不需要被编译的文件目录
- 默认值：["node_modules", "bower_components", "jspm_packages"]
```json
"exclude": ["./src/hello/**/*"]  // src下hello目录下的文件都不会被编译
```
### extends
- 定义被继承的配置文件
```json
"extends": "./configs/base" // 当前配置文件中会自动包含config目录下base.json中的所有配置信息
```
### files
- 指定被编译文件的列表，只有需要编译的文件少时才会用到
```json
"files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "tsc.ts"
]
```
- 列表中的文件都会被TS编译器所编译

### compilerOptions.lib
- 指定代码运行时所包含的库（宿主环境）
- 可选值："ES5", "ES6", "ES2015", "ES2015.Collection", "ES2015.Iterable", "ES2015.Promise", "DOM", "DOM.Iterable", "ScriptHost", "WebWorker", "WebWorker.ImportScripts"......
```json
"compilerOptions": {
    "lib": ["ES6", "DOM"]
}
```

### compilerOptions.target
- 设置ts代码编译的目标版本
- 可选值： "ES3"（默认）, "ES5", "ES6", "ES2015", "ES2016", "ES2017", "ES2018", "ES2019", "ES2020", "ES2021", "ESNext".
```json
"compilerOptions": {
    "target": "ESNext"
}}
```

### compilerOptions.module
- 设置编译后代码使用的模块化系统
- 可选值："CommonJS", "AMD", "System", "UMD", "ES6", "ES2015", "ES2020", "ESNext", "None", "es2022", "node12", "nodenext"
```json
"compilerOptions": {
    "module": "CommonJS"
}
```

### compilerOptions.outDir
- 编译后文件的所在目录
- 默认情况下，编译后的js文件会和ts文件位于相同的目录，设置outDir后可以改变编译后文件的位置
```json
"compilerOptions": {
    "outDir": "./dist"
}
```

### compilerOptions.outFile
- 将所有的文件编译为一个js文件
- 默认会将所有的编写在全局作用域中的代码合并为一个js文件，如果 module 制定了 None、System 或 AMD 则会将模块一起合并到文件之中
```json
"compilerOptions": {
    "outFile": "./dist/app.js"
}
```
这种合并，我们应该交给打包工具去做

### compilerOptions.rootDir
- 指定代码的根目录，默认情况下编译后文件的目录结构会以最长的公共目录为根目录，通过rootDir可以手动指定根目录
```json
"compilerOptions": {
    "rootDir": "./src"
}
```
### 其他配置
|标题|功能|
|-|-|
|allowJs|是否对js文件编译，默认值：false|
|checkJs|是否对js文件进行语法检查，默认值：false|
|removeComments|是否删除注释，默认值：false|
|noEmit|不生成编译后的文件，默认值：false|
|noEmitOnError|当有错误的时候不生成编译后的文件，默认值：false|
|sourceMap|是否生成sourceMap，默认值：false|

### 严格检查
|标题|功能|
|-|-|
|strict|启用所有的严格检查，设置后相当于开启了所有的严格检查，默认值：false|
|alwaysStrict|总是以严格模式对代码进行编译，默认值：false|
|noImplicitAny|禁止隐式的any类型，默认值：false|
|noImplicitThis|禁止类型不明确的this，默认值：false|
|strictBindCallApply|严格检查bind、call和apply的参数列表，默认值：false|
|strictFunctionTypes|严格检查函数的类型，默认值：false|
|strictNullChecks|严格的空值检查，默认值：false|
|strictPropertyInitialization|严格检查属性是否初始化，默认值：false|

### 额外检查
|标题|功能|
|-|-|
|noFallthroughCasesInSwitch|检查switch语句包含正确的break|
|noImplicitReturns|检查函数没有隐式的返回值|
|noUnusedLocals|检查未使用的局部变量|
|noUnusedParameters|检查未使用的参数|
|allowUnreachableCode|检查不可达代码；true：忽略不可达代码，false：不可达代码将引起错误|
|noEmitOnError|有错误的情况下不进行编译，默认值：false|




### 持续更新...
## commit 提交规范

消息必须与以下正则表达式匹配：

```js
/^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip)(\(.+\))?: .{1,50}/
```

- feat：新功能、新特性
- fix: 修改 bug
- perf：更改代码，以提高性能
- refactor：代码重构（重构，在不影响代码内部行为、功能下的代码修改）
- docs：文档修改
- style：代码格式修改, 注意不是 css 修改（例如分号修改）
- test：测试用例新增、修改
- build：影响项目构建或依赖项修改
- revert：恢复上一次提交
- ci：持续集成相关文件修改
- chore：其他修改（不在上述类型中的修改）
- release：发布新版本
- workflow：工作流相关文件修改

### 出现在"Features"标题下，`theme`副标题：

```
feat(theme): add home page feature
```

### 出现在“Bug Fixes”标题下，`theme`副标题，带有问题 #28 的链接：

```
fix(theme): remove underline on sidebar hover style

close #28
```

### 出现在“Performance Improvements”标题下，并在“"Breaking Changes"下显示重大变更说明：

```
perf: improve store getters performance by removing 'foo' option

BREAKING CHANGE: The 'foo' option has been removed.
```

以下提交和提交667ecc1如果在同一版本下，则不会出现在更改日志中。如果不是，还原提交将出​​现在“还原”标题下。

```
revert: feat(theme): add home page feature

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

### 完整消息格式

提交消息由header、body和footer组成。header 有一个type，scope和subject

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

标头是强制性的，标头的范围是可选的。

### Revert

如果提交还原了先前的提交，它应该以 开头`revert: `，后跟还原的提交的标头。在正文中，它应该说：`This reverts commit <hash>.`，其中哈希是要还原的提交的 SHA。


## 模块规范

成熟的类库都支持 cjs、esm、umd 等多种模式

- ESM：常见的前端开发标配
- CJS：CommonJS 标准的模块化
- IIFE：适用于逻辑简单、无需搭建工程化环境的前端应用

## 建立语义化版本

软件从不成熟到成熟的过程，软件版本不能只是简单的自动递增，如以下几个问题：

1. 哪些是稳定的正式版本
2. 哪些是测试版本，以及测试版本的完善程度如何
3. 哪些版本之间 API 出现了不兼容的现象
4. 哪些版本只是修复 bug、可以稳定升级

语义化版本格式：主版本号.次版本号.修订号(MAJOR.MINOR.PATCH)，递增规则如下：

- 主版本号：当做了不兼容的 API 修改
- 次版本号：当做了向下兼容的功能性新增
- 修订号：当做了向下兼容的问题修正

以 Vue 为例：

- Vue 2.6.0
- Vue 2.7.0 - 新增 Composition API；
- Vue 2.7.1 - 修正 bug；
- Vue 3.0.0 - alpha - 新版本 Vue 的第一个预览版、与以前版本 API 不兼容；
- Vue 3.0.0 - alpha.2 - 第二个预览版；
- Vue 3.0.0 - beta - 测试版、也叫公开测试版；
- Vue 3.0.3 - RC - Release Condidate 已经具备正式上线条件的版本，也叫做上线候选版；
- Vue 3.0.0 - GA - General Availability 正式发布的版本；
- Vue 3.0.1 - 修正 bug。

## 编码规范

### 目录规范

├── config # 配置文件
├── coverage # 覆盖率报告
├── demo # 代码范例
├── docs # 文档
├── node_modules  
├── scripts # 脚本 发布、提交信息检查
├── src # 组件代码
└── types # TS 类型定义

### 文件命名规范

├── src # 组件代码
└── button # 组件包名
├── index.ts # 组件入口
├── Button.tsx # 组件代码  
 └── **tests** # 测试用例
└── Button.spec.ts  
包名：小写 + 中划线；
统一入口文件： index.ts；
组件代码： 大驼峰；
测试用例代码 ： 测试对象名+ .spec.ts。


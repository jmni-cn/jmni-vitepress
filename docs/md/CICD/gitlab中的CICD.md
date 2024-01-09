---
title: "gitlab中的CICD"
tag: "CICD"
classify: "md"
description: "gitlab中的CICD"
pubDate: "2024/1/9 17:47:14"
heroImage: ""
---

# 简介

> CICD 已经集成在 GitLab 中，我们只要在项目中添加一个 .gitlab-ci.yml 文件，即可进行持续集成。

## Pipeline

一次 Pipeline 其实相当于一次构建任务，里面可以包含多个流程，如安装依赖、运行测试、编译、部署测试服务器、部署生产服务器等流程。Pipeline的触发条件有很多种，例如代码提交或者 Merge Request 的合并，如下图所示：


Stages 表示构建阶段，说白了就是上面提到的流程。 我们可以在一次 Pipeline 中定义多个 Stages，这些 Stages 会有以下特点：Stages
所有 Stages 会按照顺序运行，即当一个 Stage 完成后，下一个 Stage 才会开始
只有当所有 Stages 完成后，该构建任务 (Pipeline) 才会成功
如果任何一个 Stage 失败，那么后面的 Stages 不会执行，该构建任务 (Pipeline) 失败

因此，Stages 和 Pipeline 的关系就是：

```
+--------------------------------------------------------+
|                                                        |
|  Pipeline                                              |
|                                                        |
|  +-----------+     +------------+      +------------+  |
|  |  Stage 1  |---->|   Stage 2  |----->|   Stage 3  |  |
|  +-----------+     +------------+      +------------+  |
|                                                        |
+--------------------------------------------------------+
```

## Jobs

Jobs 表示构建工作，表示某个 Stage 里面执行的工作。 我们可以在 Stages 里面定义多个 Jobs，这些 Jobs 会有以下特点：

相同 Stage 中的 Jobs 会并行执行
相同 Stage 中的 Jobs 都执行成功时，该 Stage 才会成功
如果任何一个 Job 失败，那么该 Stage 失败，即该构建任务 (Pipeline) 失败

所以，Jobs 和 Stage 的关系图就是：

```
+------------------------------------------+
|                                          |
|  Stage 1                                 |
|                                          |
|  +---------+  +---------+  +---------+   |
|  |  Job 1  |  |  Job 2  |  |  Job 3  |   |
|  +---------+  +---------+  +---------+   |
|                                          |
+------------------------------------------+
```


理解了上面的基本概念之后，有没有觉得少了些什么东西 —— 由谁来执行这些构建任务呢？ 答案就是 GitLab Runner 了！

## Runner 

runner接受gitlab的指令，负责具体CICD的执行。注意：CICD运行调度的单位为job，也就是说job的运行是相互独立的。

目前gitlab支持多种类型的runner，例如 shell, docker, k8s。其中k8s类型的runner功能最为全面，隔离性和资源扩展性也最好，因此我们选择k8s runner作为cicd系统的底层实现。

## .gitlab-ci.yml

配置好 Runner 之后，我们要做的事情就是在项目根目录中添加 .gitlab-ci.yml 文件了。 当我们添加了 .gitlab-ci.yml 文件后，每次提交代码或者合并 MR 都会自动运行构建任务了。

还记得 Pipeline 是怎么触发的吗？Pipeline 也是通过提交代码或者合并 MR 来触发的！ 那么 Pipeline 和 .gitlab-ci.yml 有什么关系呢？ 其实 .gitlab-ci.yml 就是在定义 Pipeline ！

基本写法

我们先来看下.gitlab-ci.yml文件的样式
```yml
include:
  - remote: "http://www.baidu.com/data/prod.yml"

variables:
  - buildImage: "http://hub.com/nginx"

workflow:
  rules:
    - if: '$CI-PIPELINE_SOURCE' == "push"'
      when: never
    - when: always

stages:
    - build
    - nextStep
    - testStep1

build-job:
  stage: build
  script:
    - echo "Hello, $GITLAB_USER_LOGIN!"

test-job1:
  stage: nextStep
  script:
    - echo "This job tests something"

test-job2:
  stage: nextStep
  script:
    - echo "This job tests something, but takes more time than test-job1."
    - echo "After the echo commands complete, it runs the sleep command for 20 seconds"

deploy-prod:
  stage: testStep1
  script:
    - echo "This job deploys something from the $CI_COMMIT_BRANCH branch."

```


```yml
# 定义 stages
stages:
  - build
  - test

# 定义 job
job1:
  stage: test
  script:
    - echo "I am job1"
    - echo "I am in test stage"

# 定义 job
job2:
  stage: build
  script:
    - echo "I am job2"
    - echo "I am in build stage"

```


用 stages 关键字来定义 Pipeline 中的各个构建阶段，然后用一些非关键字来定义 jobs。 每个 job 中可以可以再用 stage 关键字来指定该 job 对应哪个 stage。 job 里面的 script 关键字是最关键的地方了，也是每个 job 中必须要包含的，它表示每个 job 要执行的命令。 

上面的pipeline执行完成后，就会输出

```yml
I am job2
I am in build stage
I am job1
I am in test stage
```


当然gitlab cicd支持的功能要丰富的多，大家可以参考下官方文档

[https://docs.gitlab.com/ee/ci/yaml/](https://docs.gitlab.com/ee/ci/yaml/)

我们目前对核心的功能进行重点的介绍。

## 全局关键字

|关键字|说明|值|备注|
|-|-|-|-|
|stages|阶段，类型数组|分别为自定义的jobs|规定各个任务的执行顺序，任务名称相同，则同时执行|
|include|应用的yml或yaml配置文件|key: 包括，local、remote、file、templatelocal |一般是本地文件，remote 可以是远程其他可访问的地址，filter一般是其他项目下的文件路径，template是官方提供的模版|
|variables|变量|预定义或自定义|根据变量位置不同，优先级不样，相同的变量会根据优先级进行覆盖|
|workflow|工作流|rules|用来定义CI/CD何时触发，和jobs中的rules、only相似|

## variable
[Gitlab之CICD环境变量](https://blog.jmni.cn/md/CICD/Gitlab%E4%B9%8BCICD%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F.html)
## include

* include在一个文件可以出现多次
* include可以使用定义好的变量
* remote yml文件的仓库必须是public的
* project 表示引用当前用户可访问的项目的yml文件
* template 表示可以使用Gitlab定义好的yml文件，[官方的公用模版](https://gitlab.com/gitlab-org/gitlab/tree/master/lib/gitlab/ci/templates)
```yml
include: "http://www.baidu.com/file/prod.yml"
include: ".test1.yml"
include:
  - local: ".test1.yml"
  - remote: "http://www.baidu.com/file/prod.yml"
include: 
  - "http://www.baidu.com/file/prod1.yml"
  - ".test.yml"
  - template: "Auto-DevOps.gitlab-ci.yml"
include:
  - project: "console/gitlab-ci-templates"
    ref: "master"
    file: ".gitlab-ci-console-cli.yml"
```
## workflow
`workflow`决定何时触发`pipeline`或者禁止`pipeline`

* if结合预定义变量判断条件为真，则触发pipeline或禁止
* 满足if条件，可以直接定义变量
```yml
workflow:
  rules: 
    - if: '$CI_COMMIT_SOURCE = "schedule"'
      when: never
    - if: '$CI_COMMIT_SOURCE = "push"'
      when: never
    - when: always
    - if: $CI_COMMIT_BRANCH = "feature"
      variables:
        IS_A_FEATURE: "true" 
```

最后一个`$CI_COMMIT_BRANCH = feature` 满足分支名为feature的时候定义变量`IS_A_FEATURE`

[引用地址](https://juejin.cn/post/6971013569986953223#heading-4)

# 简介

> 段落引用CICD 已经集成在 GitLab 中，我们只要在项目中添加一个 .gitlab-ci.yml 文件，即可进行持续集成。

## 核心概念

我们先来看下一些核心概念

### Pipeline

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

### Jobs

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

### Runner 

runner接受gitlab的指令，负责具体CICD的执行。注意：CICD运行调度的单位为job，也就是说job的运行是相互独立的。

目前gitlab支持多种类型的runner，例如 shell, docker, k8s。其中k8s类型的runner功能最为全面，隔离性和资源扩展性也最好，因此我们选择k8s runner作为cicd系统的底层实现。

### .gitlab-ci.yml

配置好 Runner 之后，我们要做的事情就是在项目根目录中添加 .gitlab-ci.yml 文件了。 当我们添加了 .gitlab-ci.yml 文件后，每次提交代码或者合并 MR 都会自动运行构建任务了。

还记得 Pipeline 是怎么触发的吗？Pipeline 也是通过提交代码或者合并 MR 来触发的！ 那么 Pipeline 和 .gitlab-ci.yml 有什么关系呢？ 其实 .gitlab-ci.yml 就是在定义 Pipeline ！

基本写法

我们先来看下.gitlab-ci.yml文件的样式

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









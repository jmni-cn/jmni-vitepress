---
title: "Gitlab之CICD环境变量"
tag: "CICD"
classify: "md"
description: "Gitlab之CICD环境变量"
pubDate: "2024/1/9 17:47:14"
heroImage: ""
---

## 预定义变量

> 就是gitlab的CI/CD内置的一些变量
```yml
test_variable:
  stage: test
  script:
    - echo "$CI_JOB_STAGE"
```
常用预设变量表 [https://docs.gitlab.com/ee/ci/variables/predefined_variables.html](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html)
|变量名称|GitLab|GitLabRunner|描述|
|-|-|-|-|
|CI|all|0.4|对CI/CD中的所有作业可见，值为true|
|CI_BUILDS_DIR|all|11.10|构建时的最顶层目录|
|CI_COMMIT_AUTHOR|13.11|all|提交的作者，格式为：名称<邮箱>|
|CI_COMMIT_BEFORE_SHA|11.2|all|当前分支的上一个提交哈希值|
|CI_COMMIT_BRANCH|12.6|0.5|提交的分支名，在合并流水线和tag流水线时不可见|
|CI_COMMIT_DESCRIPTION|10.8|all|提交的描述|
|CI_COMMIT_MESSAGE|10.8|all|完整的提交信息|
|CI_COMMIT_REF_NAME|9.0|all|项目的分支名或tag名|
|CI_COMMIT_REF_PROTECTED|11.11|all|如果作业正在构建的是被保护的分支或tag-拿我格子衫来，值为true|
|CI_COMMIT_REF_SLUG|9.0|all|CI_COMMIT_REF_NAME的小写形式。|
|CI_COMMIT_SHA|9.0|all|提交的完整哈希值|
|CI_COMMIT_SHORT_SHA|11.7|all|8个字符的提交哈希值|
|CI_COMMIT_TAG|9.0|0.5|提交的tag，仅在tag流水线可见|
|CI_COMMIT_TIMESTAMP|13.4|all|提交时的时间戳|
|CI_COMMIT_TITLE|10.8|all|提交的标题|
|CI_DEFAULT_BRANCH|12.4|all|项目的默认分支|
|CI_DEPLOY_FREEZE|13.2|all|当流水运行是处于部署冻结阶段时可见，值为true。|
|CI_ENVIRONMENT_NAME|8.15|all|当前作业的部署环境名，当设置了environment:name时可见|
|CI_ENVIRONMENT_URL|9.3|all|当前作业的部署环境地址，只有设置了environment:url可见|
|CI_JOB_ID|9.0|all|当前作业的ID，系统内唯一|
|CI_JOB_IMAGE|12.9|12.9|当前作业使用的Docker镜像名|
|CI_JOB_NAME|9.0|0.5|当前作业名称|
|CI_JOB_STAGE|9.0|0.5|当前作业所属的阶段名拿我格子衫来|
|CI_PIPELINE_ID|8.10|all|当前流水线ID（实例级），系统内唯一|
|CI_PIPELINE_SOURCE|10.0|all|流水线触发方式，枚举值为push,web,schedule,api,external,chat,webide,merge_request_event,external_pull_request_event,parent_pipeline,trigger,或者pipeline|
|CI_PIPELINE_TRIGGERED|all|all|当作业是使用trigger触发的时为true|
|CI_PIPELINE_URL|11.1|0.5|流水线详情的地址|
|CI_PIPELINE_CREATED_AT|13.10|all|流水线创建时间|
|CI_PROJECT_DIR|all|all|存放克隆项目的完整路径，作业运行的目录。|
|CI_PROJECT_NAME|8.10|0.5|当前项目名称，不包含组名|
|CI_PROJECT_NAMESPACE|8.10|0.5|项目的命名空间（组名或用户名）|
|CI_PROJECT_PATH|8.10|0.5|包含项目名称的命名空间|
|CI_PROJECT_TITLE|12.4|all|项目名称（网页上显示的）|
|CI_PROJECT_URL|8.10|0.5|项目HTTP(S)地址|
|CI_RUNNER_TAGS|8.10|0.5|逗号分割的runner标签列表|
|GITLAB_USER_EMAIL|8.12|all|开始当前作业的用户邮箱|
|GITLAB_USER_LOGIN|10.0|all|开始当前作业的登录用户名-拿我格子衫来|
|GITLAB_USER_NAME|10.0|all|开始当前作业的用户名|
|CI_MERGE_REQUEST_APPROVED（仅合并流水线）|14.1|all|当合并流水线的MR被通过时值为true|
|CI_MERGE_REQUEST_ASSIGNEES（仅合并流水线）|11.9|all|逗号分割的合并请求指派人列表|
|CI_MERGE_REQUEST_SOURCE_BRANCH_NAM（仅合并流水线）|11.6|all|合并请求中的源分支名称|
|CI_MERGE_REQUEST_TARGET_BRANCH_NAM（仅合并流水线）|11.6|all|合并请求中的目标分支名称|
|CI_MERGE_REQUEST_TITL（仅合并流水线）|11.9|all|合并请求的标题|

## 自定义变量
> 全局变量或者在job、scripts中声明
.gitlab-ci.yml中定义变量

```yml
variables:
  TEST_VAR: "All jobs can use this variable's value"

job1:
  variables:
    TEST_VAR_JOB: "Only job1 can use this variable's value"
  script:
    - echo "$TEST_VAR" and "$TEST_VAR_JOB"
```

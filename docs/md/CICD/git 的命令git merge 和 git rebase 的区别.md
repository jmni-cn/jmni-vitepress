---
title: "git merge和git rebase和HEAD"
tag: "JavaScript"
classify: "md"
description: "git merge 和 git rebase 的区别"
pubDate: "2024/1/17 1:58:14"
heroImage: ""
---

merge 是一个合并操作，会将两个分支的修改合并在一起，默认操作的情况下会提交合并中修改的内容
merge 的提交历史记录了实际发生过什么，关注点在真实的提交历史上面
rebase 并没有进行合并操作，只是提取了当前分支的修改，将其复制在了目标分支的最新提交后面
rebase 操作会丢弃当前分支已提交的 commit，故不要在已经 push 到远程，和其他人正在协作开发的分支上执行 rebase 操作
merge 与 rebase 都是很好的分支合并命令，没有好坏之分，使用哪一个应由团队的实际开发需求及场景决定

**一句话概括：保留记录用merge，清除记录用rebase，合代码进master用merge！**

## git merge
 `git merge`命令 它会把两个分支的最新快照以及二者最近的共同祖先进行三方合并，合并的结果是生成一个新的快照（并提交）。
> 可以让我们知道代码是什么时候合并的，是从哪个分支合并进来的。

## git rebase
 `git rebase`命令 当执行 rebase 操作时，git 会从两个分支的共同祖先开始提取待变基分支上的修改，然后将待变基分支指向基分支的最新提交，最后将刚才提取的修改应用到基分支的最新提交的后面。
> 操作会改变分支的基准点，所以commit Id都会改变，但是它不会产生额外的提交记录，会让我们的提交树呈现一条直线，比较清晰。


## 最佳实践
公共分支建议使用` merge`，可以完整的保留提交记录及合并记录，方便溯源。
自己的开发分支建议使用 `rebase`，如果公共分支更新频繁的话，多次使用`merge`会产生很多的合并记录，对自己的分支产生一定的污染，使用`rebase`可以很清晰的看到自己的分支每一次代码提交。

开发完成后需要把自己分支的代码合并的主分支，则可以按以下步骤操作：
1、先在自己的开发分支进行`git rebase master`，如果冲突过多的话可以先将自己开发分支的多次提交合并成一次提交。
2、在`master`进行`git merge my-branch`，将自己的开发分支合并到主分支。

## git rebase 合并提交记录
`git rebase`也可以将多次提交记录合并成一次，比如说对于我们拉取出来的开发分支，可能会在开发过程中多次提交测试，会产生很多不规范的、不必要的提交，这类提交将会造成我们的分支污染，当出现问题需要回退时，将增加难度，所以我们可以将其合并起来：
```shell
// 前开后闭，不输endCommitId的话默认是当前分支HEAD所指向的commit
git rebase -i <startCommitId> <endCommitId>

// 下面这种写法也支持，n是要合并的个数
git rebase -i HEAD~n
```
![rebase和merge.jpeg](//static.jmni.cn/blog/img/c81fc0dee6b145df934c.jpeg)
![rebase和merge2.jpeg](//static.jmni.cn/blog/img/7890388b14b9d8a03d98.jpeg)

## HEAD和指针
Git 又是怎么知道当前在哪一个分支上呢？ 也很简单，它有一个名为 HEAD 的特殊指针，指向当前所在的本地分支（译注：将 HEAD 想象为当前分支的别名）


* HEAD的本质是指向某个commit对象的指针
* 分支指针的本质是指向某个commit对象的指针
>分支是git库中众多commit对象的组织方式，所以分支又可以看成是commit对象链表。而分支指针则指向这个链表的尾部。借用C语言中的知识，可以用分支指针完全表示这个commit链表，所以分支指针就是分支（正如int a[] = {1,2,3};中的a的含义一样）。
* HEAD的本质和分支指针的本质是相同的
* 分支指针指向的是所在分支最新提交产生的commit对象,而HEAD指向的是某一个分支最新提交产生的commit对象。就是说`HEAD`肯定是分支指针，而只有被激活的分支（或者称为“当前分支”）的分支指针才可以被称为是HEAD。

## HEAD表达式
* HEAD 指向当前分支最新的提交。
* HEAD~ 等同于 HEAD^，表示当前提交的父提交。
* HEAD^ 表示当前提交的第一个父提交。
* HEAD~n 表示当前提交的第 n 代祖先提交。
## HEAD相关操作

* 查看当前 HEAD 的位置：使用 `git rev-parse HEAD` 命令可以查看 HEAD 所指向的提交的 SHA 值
* 切换到另一个分支：使用` git checkout branch-name` 命令可以切换到另一个分支，并将 HEAD 指针移动到该分支。
* 检出特定提交：使用 `git checkout commit-hash` 命令可以将 HEAD 指针移动到特定的提交
* 执行交互式的 rebase 操作：使用 `git rebase -i HEAD~n` 命令可以执行交互式的变基操作，编辑、合并或重新排序提交；这个代码简单理解成对最近n次提交进行操作。

在网上看到一个比较好的解答[https://juejin.cn/post/6844903826646892557?from=search-suggest](https://juejin.cn/post/6844903826646892557?from=search-suggest)

# git 的常用命令操作

## 1) 初始化与克隆

```bash
git init                  # 当前目录初始化仓库
git clone <url>           # 克隆远程仓库
```

常见：

```bash

git clone -b develop <url>  # 克隆并直接切到指定分支
```

---

## 2) 基础三板斧：状态 / 暂存 / 提交

```bash
git status                # 看当前改动、暂存区状态
git add .                 # 把所有改动加入暂存区
git add -p                # 交互式分块 add（很推荐）
git commit -m "msg"       # 提交
```

想改上一次提交信息/补进文件：

```bash
git commit --amend
```

---

## 3) 分支：创建 / 切换 / 删除

```bash
git branch                # 看本地分支
git branch -a             # 看所有分支（含远程）
git switch <name>         # 切换分支（新命令，推荐）
git checkout <name>       # 切换分支（旧命令）
git switch -c feat/login  # 创建并切换
git branch -d <name>      # 删除本地分支（已合并才允许）
git branch -D <name>      # 强制删除本地分支
```

---

## 4) 拉取与推送：同步远端

```bash
git fetch                 # 只拉远端引用，不改本地代码
git pull                  # = fetch + merge（会产生 merge）
git pull --rebase         # = fetch + rebase（更干净的线性历史）
git push                  # 推送当前分支到远端
git push -u origin <name> # 第一次推送并绑定上游
```

删除远程分支：

```bash
git push origin --delete <branch>
```

---

## 5) 查看历史：定位问题必备

```bash
git log --oneline --graph --decorate --all   # 最常用的历史视图
git show <hash>                               # 看某次提交详情
git diff                                     # 工作区 vs 暂存区
git diff --staged                            # 暂存区 vs HEAD
```

---

## 6) 撤销与回滚：最容易踩坑的部分

### 6.1 撤销工作区改动（还没 add）

```bash
git restore <file>        # 撤销单文件
git restore .             # 撤销全部
```

### 6.2 撤销暂存（add 了但没 commit）

```bash
git restore --staged <file>
git restore --staged .
```

### 6.3 回滚一次提交（已提交、历史保留、推荐）

```bash
git revert <hash>
```

可以用下面命令看它是不是 merge commit（输出里如果有 Merge: ... 就是）：

```bash
git show --summary <hash>
```

如果是 merge commit，一般要这样回滚（保留主线 parent=1 的情况最常见）：

```bash
git revert -m 1 <hash>
```

回滚后会进入编辑提交 message 界面：
>按 Esc 输入 :wq 
然后回车保存并退出，revert 提交就会生成（默认这段 message 保留就行）

### 6.4 重写历史（危险，慎用）

把分支“回到某个提交”并丢掉后面的历史：

```bash
git reset --hard <hash>
git push -f
```

适合：个人分支、没人基于你的分支开发；不适合：共享主干分支。

---

## 7) 合并与变基：团队协作核心

### merge（保留分支结构）

```bash
git merge feat/login
```

### rebase（线性历史，更干净）

```bash
git rebase develop
```

解决冲突流程：

```bash
# 手动改冲突文件
git add .
git rebase --continue     # 或 git merge --continue（较少见）
git rebase --abort        # 放弃本次 rebase
```

---

## 8) 临时保存：stash（切分支救命）

```bash
git stash                 # 把未提交改动暂存起来
git stash list
git stash pop             # 取出并删除 stash
git stash apply           # 取出但保留 stash
git stash drop            # 删除某个 stash
```

---

## 9) 远程与配置：常用信息

```bash
git remote -v             # 查看远程地址
git remote set-url origin <url>  # 修改远程地址

git config --global user.name "xxx"
git config --global user.email "xxx@xx.com"
```

---

## 10) 推荐一套“日常标准工作流”（你可直接照抄）

```bash
git switch develop
git pull --rebase

git switch -c feat/xxx
# coding...

git add -p
git commit -m "feat: xxx"

git push -u origin feat/xxx
# 提 PR，review 合并
```



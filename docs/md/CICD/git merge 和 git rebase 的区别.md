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

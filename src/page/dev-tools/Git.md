---
lang: zh-CN
title: Git
order: 3
description: 微服务和分布式
---

## 1.git的4个区域及转换

Git本地有三个工作区域：工作目录（Working Directory）、暂存区(Stage/Index)、资源库(Repository或Git Directory)。如果在加上远程的git仓库(Remote Directory)就可以分为四个工作区域。文件在这四个区域之间的转换关系如下：


![](http://www.img.youngxy.top/Java/fig/git.png)

**Workspace**：工作区，就是你平时存放项目代码的地方;

**Index / Stage**：暂存区，用于临时存放你的改动，事实上它只是一个文件，保存即将提交到文件列表信息,一般存放在 .git 目录下的 index 文件（.git/index）中，所以我们把暂存区有时也叫作索引（index）;

**Repository**：仓库区（或本地仓库），就是安全存放数据的位置，这里面有你提交到所有版本的数据。其中HEAD指向最新放入仓库的版本;

**Remote**：远程仓库，托管代码的服务器，可以简单的认为是你项目组中的一台电脑用于远程数据交换;

## 2.列举工作中常用的几个git命令？

```sh
远程仓库中clone代码到本地：git clone https://github.com/yangluheng/yangluheng.github.io

新增文件的命令：git add file或者git add .

提交文件的命令：git commit –m或者git commit –a

本地仓库提交到远程仓库：git push

查看工作区状况：git status –s

拉取合并远程分支的操作：git fetch/git merge或者git pull 

查看提交记录命令：git reflog

切换到主分支： git checkout master
```



## 3.提交时发生冲突，你能解释冲突是如何产生的吗？你是如何解决的？

开发过程中，我们都有自己的特性分支，所以冲突发生的并不多，但也碰到过。诸如公共类的公共方法，我和别人同时修改同一个文件，他提交后我再提交就会报冲突的错误。

发生冲突，在IDE里面一般都是对比本地文件和远程分支的文件，然后把远程分支上文件的内容手工修改到本地文件，然后再提交冲突的文件使其保证与远程分支的文件一致，这样才会消除冲突，然后再提交自己修改的部分。特别要注意下，修改本地冲突文件使其与远程仓库的文件保持一致后，需要提交后才能消除冲突，否则无法继续提交。必要时可与同事交流，消除冲突。

通过git pull命令，拉取远程分支上的代码并合并到本地分支，目的是消除冲突。



## 4.如果本次提交误操作，如何撤销？

1.使用git reset命令

可以通过`git reset HEAD^`来撤销最近的一次提交,将暂存区和工作目录回到上一次提交之后的状态。

2.使用git revert命令

`git revert HEAD`可以创建一个新的提交来撤销之前提交的内容,保留提交历史。

3.如果已经推送了提交到远程仓库

- 可以使用`git revert`在本地创建回滚提交,然后力推到远程,远程历史中会多出一次回滚提交。
- 或者通过`git reset`回退到旧提交,然后使用`git push -f`强制推送到远程,这种方式会改写远程仓库的提交历史。

4.如果误操作的是未提交的内容

可以使用`git checkout .`来撤销工作目录中所有未提交的修改。

5.使用GUI工具查看提交历史,以便确定需要回滚的提交



## 5.git add和git stage的区别

在回答这个问题之前需要先了解 git 仓库的三个组成部分：工作区（Working Directory）、暂存区（Stage）和历史记录区（History）：

工作区：在 git 管理下的正常目录都算是工作区，我们平时的编辑工作都是在工作区完成。

暂存区：临时区域。里面存放将要提交文件的快照。

历史记录区：git commit 后的记录区。

然后我们就可以来说一下 git add 和 git stage 了。其实，他们两是同义的，所以，惊不惊喜，意不意外？这个问题竟然是个陷阱…

引入 git stage 的原因其实比较有趣：

是因为要跟 svn add 区分，两者的功能是完全不一样的，svn add 是将某个文件加入版本控制，而 git add 则是把某个文件加入暂存区，因为在 git 出来之前大家用 svn 比较多，所以为了避免误导，git 引入了git stage，然后把 git diff –staged 做为 git diff –cached 的相同命令。基于这个原因，我们建议使用 git stage 以及 git diff –staged。

## 6.git add . 和 git add * 区别

git add . 会把本地所有untrack的文件都加入暂存区，并且会根据.gitignore做过滤，但是git add * 会忽略.gitignore把任何文件都加入。

## 7.git add和git commit的区别

git add把文件添加进去，实际上就是把文件修改添加到暂存区；

git commit提交更改，实际上就是把暂存区的所有内容提交到当前分支。

因为我们创建Git版本库时，Git自动为我们创建了唯一一个master分支。所以，git commit就是往master分支上提交更改。

你可以简单理解为，需要提交的文件修改通通放到暂存区，然后，一次性提交暂存区的所有修改。

所以要想将修改提交到master中一定要先git add到暂存区中，再git commit到master分支。


## 8.能不能说一下git fetch和git pull命令之间的区别？

git pull 命令从中央存储库中提取特定分支的新更改或提交，并更新本地存储库中的目标分支。

git fetch 也用于相同的目的，但它的工作方式略有不同。当你执行 git fetch 时，它会从所需的分支中提取所有新提交，并将其存储在本地存储库中的新分支中。如果要在目标分支中反映这些更改，必须在 git fetch 之后执行git merge。只有在对目标分支和获取的分支进行合并后才会更新目标分支。

为了方便起见，请记住以下等式：

**git pull = git fetch + git merge**

## 9.git跟其他版本控制器有啥区别？

GIT是分布式版本控制系统，其他类似于SVN是集中式版本控制系统。

分布式区别于集中式在于：每个节点的地位都是平等，拥有自己的版本库，在没有网络的情况下，对工作空间内代码的修改可以提交到本地仓库，此时的本地仓库相当于集中式的远程仓库，可以基于本地仓库进行提交、撤销等常规操作，从而方便日常开发。

## 10.我们在本地工程常会修改一些配置文件，这些文件不需要被提交，而我们又不想每次执行git status时都让这些文件显示出来，我们该如何操作？

首先利用命令touch .gitignore新建文件

$ touch .gitignore
然后往文件中添加需要忽略哪些文件夹下的什么类型的文件

## 11.如何把本地仓库的内容推向一个空的远程仓库？

首先确保本地仓库与远程之间是连同的。如果提交失败，则需要进行下面的命令进行连通：

**git remote add origin XXXX**

注意：XXXX是你的远程仓库地址。

如果是第一次推送，则进行下面命令：

**git push -u origin master**

注意：-u 是指定origin为默认主分支

之后的提交，只需要下面的命令：

**git push origin master**

参考：https://blog.csdn.net/xushiyu1996818/article/details/120166824?spm=1001.2101.3001.6650.4&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4-120166824-blog-131392335.235%5Ev38%5Epc_relevant_default_base&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-4-120166824-blog-131392335.235%5Ev38%5Epc_relevant_default_base&utm_relevant_index=7

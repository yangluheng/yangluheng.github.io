---
lang: zh-CN
title: Docker
order: 2
description: 微服务和分布式
---

## 1.什么是 Docker?

- **Docker 是世界领先的软件容器平台。**
- **Docker** 使用 Google 公司推出的 **Go 语言** 进行开发实现，基于 **Linux 内核** 提供的 CGroup 功能和 namespace 来实现的，以及 AUFS 类的 **UnionFS** 等技术，**对进程进行封装隔离，属于操作系统层面的虚拟化技术。** 由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。
- **Docker 能够自动执行重复性任务，例如搭建和配置开发环境，从而解放了开发人员以便他们专注在真正重要的事情上：构建杰出的软件。**
- **用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。**

**组成部分：**

- 镜像（`Image`）：Docker 镜像是一个特殊的文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像是**静态**的，不包含任何动态数据，其内容在构建之后也不会被改变。
- 容器（`Container`）：镜像（`Image`）和容器（`Container`）的关系，就像是面向对象程序设计中的 `类` 和 `实例` 一样，**镜像是静态的定义，容器是镜像运行时的实体**。容器可以被创建、启动、停止、删除、暂停等。
- 仓库（`Repository`）：仓库（`Repository`）类似Git的**远程仓库**，集中存放镜像文件。

![](http://www.img.youngxy.top/Java/fig/docker.png)

## 2.Docker的架构

Docker 是一个 C/S 模式的架构，后端是一个松耦合架构，模块各司其职。

1. 用户是使用 Docker Client 与 Docker Daemon 建立通信，并发送请求给后者。
2. Docker Daemon 作为 Docker 架构中的主体部分，首先提供 Docker Server 的功能使其可以接受 Docker Client 的请求。
3. Docker Engine 执行 Docker 内部的一系列工作，每一项工作都是以一个 Job 的形式的存在。
4. Job 的运行过程中，当需要容器镜像时，则从 Docker Registry 中下载镜像，并通过镜像管理驱动 Graphdriver 将下载镜像以 Graph 的形式存储。
5. 当需要为 Docker 创建网络环境时，通过网络管理驱动 Networkdriver 创建并配置 Docker容器网络环境。
6. 当需要限制 Docker 容器运行资源或执行用户指令等操作时，则通过 Execdriver 来完成。
7. Libcontainer 是一项独立的容器管理包，Networkdriver 以及 Execdriver 都是通过 Libcontainer 来实现具体对容器进行的操作。



## 3.镜像和容器的相关操作

```sh
#查看基本信息
docker version #查看 docker 的版本号，包括客户端、服务端等。

# 搜索镜像
docker search <image> # 在 docker index 中搜索 image
# 下载镜像
docker pull <image> # 从 docker registry server 中下拉 image
# 查看镜像
docker images： #列出 images
docker images -a #列出所有的 images（包含历史）
docker rmi <image ID>： #删除一个或多个 image

# 使用镜像创建容器
docker run -i -t sauloal/ubuntu14.04

#查看容器
docker ps ：列出当前所有正在运行的 container

# 再次启动容器
docker start/stop/restart <container> #：开启/停止/重启 container

#进入正在运行的 docker 容器
docker exec -it [container_id] /bin/bash

# 删除容器
docker rm <container...> #：删除一个或多个 container
```



## 4.Docker面试题

### 4.1Docker与虚拟机的对比

下面的图片比较了 Docker 和传统虚拟化方式的不同之处，可见**容器是在操作系统层面上实现虚拟化**，直接复用本地主机的操作系统， 而**虚拟机传统方式则是在硬件层面**实现。

![](http://www.img.youngxy.top/Java/fig/docker1.png)

传统的虚拟机首先通过`Hypervisor`层对物理硬件进行虚拟化，然后在虚拟的硬件资源上安装从操作系统`(guest os)`，最后将相关应用运行在从操作系统上。其中`APP+BINS/LIBS+Guest OS`为虚拟机。

而`docker`不像虚拟机那样利用`Hypervisor`和`guest os`实现资源与环境的隔离，其仅通过一个`docker` `daemon/engine`来实现**资源限制与环境隔离**( **终极目标是app的隔离**  )(主要利用 **linux内核** 本身支持的容器方式来实现这一功能)，其中`APP+BINS/LIBS`为容器`(container)`。 `docker daemon/engine`可以简单看成对Linux内核中的`NameSpace`、`Cgroup`、镜像管理文件系统操作的封装。 简单的说，`docker`利用`namespace`实现系统环境的隔离；利用`Cgroup`实现资源限制；利用镜像实现根目录环境的隔离。

### 4.2什么是 Docker 容器？

Docker容器在应用程序层创建抽象并将应用程序及其所有依赖项打包在一起。这使我们能够快速可靠地部署应用程序。容器不需要我们安装不同的操作系统。相反，它们使用底层系统的 CPU 和内存来执行任务。这意味着任何容器化应用程序都可以在任何平台上运行，而不管底层操作系统如何。我们也可以将容器视为 Docker 镜像的运行时实例。

### 4.3什么是 DockerFile？ 

> Dockerfile 是一个文本文件，其中包含我们需要运行以构建 Docker 映像的所有命令。Docker 使用 Dockerfile 中的指令自动构建镜像。我们可以docker build用来创建按顺序执行多个命令行指令的自动构建。

### 4.4如何从 Docker 镜像创建 Docker 容器？ 

为了从镜像创建容器，我们从 Docker 存储库中提取我们想要的镜像并创建一个容器。我们可以使用以下命令：

```sh
docker run -it -d <image_name>

–detach	-d	在后台运行容器，并且打印容器id。
–interactive	-i	即使没有连接，也要保持标准输入保持打开状态，一般与 -t 连用。
–tty	-t	分配一个伪tty，一般与 -i 连用。
```

### 4.5停止和终止容器的区别？

> 两个命令都是停止容器，不同之处在于：
>
> docker stop: 先发 SIGTERM 信号给容器，允许其在一定时间（默认 10s）内进行一些操作，若这段时间内容器未停止，则发送 SIGKILL 信号强行杀掉容器；
>
> docker kill: 直接发送 SIGKILL 信号杀掉容器。
>
> 这两个命令在实际使用时，通俗说法就是 stop 类似按关机键关机，kill 则相当于直接拔电源。

### 4.6解释 Docker 组件?

> 三个架构组件包括 Docker 客户端、主机和注册表。
>
> Docker 客户端：该组件执行构建和运行操作以与 Docker 主机通信。
>
> Docker 主机：该组件包含 Docker 守护程序、Docker 镜像和 Docker 容器。守护进程建立到 Docker Registry 的连接。
>
> Docker Registry：该组件存储 Docker 镜像。它可以是公共注册表，例如 Docker Hub 或 Docker Cloud，也可以是私有注册表。


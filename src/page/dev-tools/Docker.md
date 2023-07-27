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



## 2.Docker的架构

Docker 是一个 C/S 模式的架构，后端是一个松耦合架构，模块各司其职。下图是它的总体架构图：

![img](https://pics4.baidu.com/feed/3b292df5e0fe9925352c266b0d1303d78db17128.jpeg@f_auto?token=c40cb7490618ce8a15a9032ad3bb0eea)



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


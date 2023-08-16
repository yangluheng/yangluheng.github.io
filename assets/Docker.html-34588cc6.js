import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as r,c as o,f as i}from"./app-5d9ed5d2.js";const c={},a=i('<h3 id="docker" tabindex="-1"><a class="header-anchor" href="#docker" aria-hidden="true">#</a> Docker</h3><h4 id="什么是-docker" tabindex="-1"><a class="header-anchor" href="#什么是-docker" aria-hidden="true">#</a> 什么是 Docker?</h4><ul><li><strong>Docker 是世界领先的软件容器平台。</strong></li><li><strong>Docker</strong> 使用 Google 公司推出的 <strong>Go 语言</strong> 进行开发实现，基于 <strong>Linux 内核</strong> 提供的 CGroup 功能和 namespace 来实现的，以及 AUFS 类的 <strong>UnionFS</strong> 等技术，<strong>对进程进行封装隔离，属于操作系统层面的虚拟化技术。</strong> 由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。</li><li><strong>Docker 能够自动执行重复性任务，例如搭建和配置开发环境，从而解放了开发人员以便他们专注在真正重要的事情上：构建杰出的软件。</strong></li><li><strong>用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。</strong></li></ul><h4 id="docker的架构" tabindex="-1"><a class="header-anchor" href="#docker的架构" aria-hidden="true">#</a> Docker的架构</h4><p>Docker 是一个 C/S 模式的架构，后端是一个松耦合架构，模块各司其职。下图是它的总体架构图：</p><figure><img src="https://pics4.baidu.com/feed/3b292df5e0fe9925352c266b0d1303d78db17128.jpeg@f_auto?token=c40cb7490618ce8a15a9032ad3bb0eea" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><ol><li>用户是使用 Docker Client 与 Docker Daemon 建立通信，并发送请求给后者。</li><li>Docker Daemon 作为 Docker 架构中的主体部分，首先提供 Docker Server 的功能使其可以接受 Docker Client 的请求。</li><li>Docker Engine 执行 Docker 内部的一系列工作，每一项工作都是以一个 Job 的形式的存在。</li><li>Job 的运行过程中，当需要容器镜像时，则从 Docker Registry 中下载镜像，并通过镜像管理驱动 Graphdriver 将下载镜像以 Graph 的形式存储。</li><li>当需要为 Docker 创建网络环境时，通过网络管理驱动 Networkdriver 创建并配置 Docker容器网络环境。</li><li>当需要限制 Docker 容器运行资源或执行用户指令等操作时，则通过 Execdriver 来完成。</li><li>Libcontainer 是一项独立的容器管理包，Networkdriver 以及 Execdriver 都是通过 Libcontainer 来实现具体对容器进行的操作。</li></ol><h4 id="镜像和容器的相关操作" tabindex="-1"><a class="header-anchor" href="#镜像和容器的相关操作" aria-hidden="true">#</a> 镜像和容器的相关操作</h4>',8),n=[a];function t(d,l){return r(),o("div",null,n)}const k=e(c,[["render",t],["__file","Docker.html.vue"]]);export{k as default};
import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as e}from"./app-2a6ee616.js";const o={},i=e(`<h2 id="_1-什么是-docker" tabindex="-1"><a class="header-anchor" href="#_1-什么是-docker" aria-hidden="true">#</a> 1.什么是 Docker?</h2><ul><li><strong>Docker 是世界领先的软件容器平台。</strong></li><li><strong>Docker</strong> 使用 Google 公司推出的 <strong>Go 语言</strong> 进行开发实现，基于 <strong>Linux 内核</strong> 提供的 CGroup 功能和 namespace 来实现的，以及 AUFS 类的 <strong>UnionFS</strong> 等技术，<strong>对进程进行封装隔离，属于操作系统层面的虚拟化技术。</strong> 由于隔离的进程独立于宿主和其它的隔离的进程，因此也称其为容器。</li><li><strong>Docker 能够自动执行重复性任务，例如搭建和配置开发环境，从而解放了开发人员以便他们专注在真正重要的事情上：构建杰出的软件。</strong></li><li><strong>用户可以方便地创建和使用容器，把自己的应用放入容器。容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。</strong></li></ul><h2 id="_2-docker的架构" tabindex="-1"><a class="header-anchor" href="#_2-docker的架构" aria-hidden="true">#</a> 2.Docker的架构</h2><p>Docker 是一个 C/S 模式的架构，后端是一个松耦合架构，模块各司其职。下图是它的总体架构图：</p><figure><img src="https://pics4.baidu.com/feed/3b292df5e0fe9925352c266b0d1303d78db17128.jpeg@f_auto?token=c40cb7490618ce8a15a9032ad3bb0eea" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><ol><li>用户是使用 Docker Client 与 Docker Daemon 建立通信，并发送请求给后者。</li><li>Docker Daemon 作为 Docker 架构中的主体部分，首先提供 Docker Server 的功能使其可以接受 Docker Client 的请求。</li><li>Docker Engine 执行 Docker 内部的一系列工作，每一项工作都是以一个 Job 的形式的存在。</li><li>Job 的运行过程中，当需要容器镜像时，则从 Docker Registry 中下载镜像，并通过镜像管理驱动 Graphdriver 将下载镜像以 Graph 的形式存储。</li><li>当需要为 Docker 创建网络环境时，通过网络管理驱动 Networkdriver 创建并配置 Docker容器网络环境。</li><li>当需要限制 Docker 容器运行资源或执行用户指令等操作时，则通过 Execdriver 来完成。</li><li>Libcontainer 是一项独立的容器管理包，Networkdriver 以及 Execdriver 都是通过 Libcontainer 来实现具体对容器进行的操作。</li></ol><h2 id="_3-镜像和容器的相关操作" tabindex="-1"><a class="header-anchor" href="#_3-镜像和容器的相关操作" aria-hidden="true">#</a> 3.镜像和容器的相关操作</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment">#查看基本信息</span>
<span class="token function">docker</span> version <span class="token comment">#查看 docker 的版本号，包括客户端、服务端等。</span>

<span class="token comment"># 搜索镜像</span>
<span class="token function">docker</span> search <span class="token operator">&lt;</span>image<span class="token operator">&gt;</span> <span class="token comment"># 在 docker index 中搜索 image</span>
<span class="token comment"># 下载镜像</span>
<span class="token function">docker</span> pull <span class="token operator">&lt;</span>image<span class="token operator">&gt;</span> <span class="token comment"># 从 docker registry server 中下拉 image</span>
<span class="token comment"># 查看镜像</span>
<span class="token function">docker</span> images： <span class="token comment">#列出 images</span>
<span class="token function">docker</span> images <span class="token parameter variable">-a</span> <span class="token comment">#列出所有的 images（包含历史）</span>
<span class="token function">docker</span> rmi <span class="token operator">&lt;</span>image ID<span class="token operator">&gt;</span>： <span class="token comment">#删除一个或多个 image</span>

<span class="token comment"># 使用镜像创建容器</span>
<span class="token function">docker</span> run <span class="token parameter variable">-i</span> <span class="token parameter variable">-t</span> sauloal/ubuntu14.04

<span class="token comment">#查看容器</span>
<span class="token function">docker</span> <span class="token function">ps</span> ：列出当前所有正在运行的 container

<span class="token comment"># 再次启动容器</span>
<span class="token function">docker</span> start/stop/restart <span class="token operator">&lt;</span>container<span class="token operator">&gt;</span> <span class="token comment">#：开启/停止/重启 container</span>

<span class="token comment">#进入正在运行的 docker 容器</span>
<span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token punctuation">[</span>container_id<span class="token punctuation">]</span> /bin/bash

<span class="token comment"># 删除容器</span>
<span class="token function">docker</span> <span class="token function">rm</span> <span class="token operator">&lt;</span>container<span class="token punctuation">..</span>.<span class="token operator">&gt;</span> <span class="token comment">#：删除一个或多个 container</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),c=[i];function r(t,l){return s(),a("div",null,c)}const m=n(o,[["render",r],["__file","Docker.html.vue"]]);export{m as default};

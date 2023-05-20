---
lang: zh-CN
title: HTTP协议中为什么广泛使用的还是HTTP1.1？
order: 10
description: 计算机网络
---

![](https://img-blog.csdnimg.cn/img_convert/0b59eaba42b578929cf4284114a73b94.png)

最近一段时间以来，关于HTTP/3的新闻有很多，越来越多的国际大公司已经开始使用HTTP/3了。

所以，HTTP/3已经是箭在弦上了，全面使用只是个时间问题，那么，作为一线开发者，我们也是时候了解下到底什么是HTTP/3，为什么需要HTTP/3了。

**但是为什么现在广泛使用的还是HTTP1.1？**

## 一、关于HTTP2

### HTTP/2 辉煌不在？

虽然HTTP/2标准在2015年5月就以RFC 7540正式发表了，并且多数浏览器在2015年底就支持了。

但是，真正被广泛使用起来要到2018年左右，但是也是在2018年，11月IETF给出了官方批准，认可HTTP-over-QUIC成为HTTP/3。

2018年的时候，那时候HTTP/2还是个新技术，刚刚开始有软件支持，短短两年过去了，现在HTTP/3已经悄然而至了。

**根据W3Techs的数据，截至2019年6月，全球也仅有36.5%的网站支持了HTTP/2。**所以，可能很多网站还没开始支持HTTP/2，HTTP/3就已经来了。

所以，对于很多网站来说，或许直接升级HTTP/3是一个更加正确的选择。

### 回顾 HTTP/2

我默认大家对HTTP/2有了一定的基本了解。

我们知道，HTTP/2的诞生，主要是为了解决HTTP/1.1中的效率问题，HTTP/2中最核心的技术就是多路复用技术，即允许同时通过单一的HTTP/2.0连接发起多重的请求-响应消息。
![](https://img-blog.csdnimg.cn/img_convert/b4c1f312ac8e16edb503784d48ad1fbe.png)

同时还实现了二进制分帧、header压缩、服务端推送等技术。

具体的细节请移步：[HTTP2协议](https://yangluheng.github.io/page/计算机网络/HTTP2.html)

## 二、关于HTTP3

具体的细节请移步：[HTTP3协议](https://yangluheng.github.io/page/计算机网络/HTTP3.html)



## 三、HTTP历史

![](https://pics6.baidu.com/feed/4610b912c8fcc3ce6f5c5cdb23df1b8ed63f20df.png@f_auto?token=304e48cc877ad83b77954f32fa9d1490)



随着网络技术的发展，1999 年设计的 HTTP/1.1 已经不能满足需求，所以 Google 在  2009 年设计了基于 TCP 的 SPDY，后来 SPDY 的开发组推动 SPDY 成为正式标准，不过最终没能通过。不过 SPDY  的开发组全程参与了 HTTP/2 的制定过程，参考了 SPDY 的很多设计，所以我们一般认为 SPDY 就是 HTTP/2 的前身。无论  SPDY 还是 HTTP/2，都是基于 TCP 的，TCP 与 UDP 相比效率上存在天然的劣势，所以 2013 年 Google 开发了基于  UDP 的名为 QUIC 的传输层协议，QUIC 全称 Quick UDP Internet Connections，希望它能替代  TCP，使得网页传输更加高效。后经提议，互联网工程任务组正式将基于 QUIC 协议的 HTTP （HTTP over QUIC）重命名为  HTTP/3。



## 三、原因

小羊看来网站上大家的讨论，总结了下面的几点。

1.至少目前来看，要启用http2必须使用OpenSSL/ssl加密协议，而且在对传输速率要求不高的情况下，HTTP1.1完全可以hold住任何场景。所以还是需要等待催生http2不得不出的时机到来。

2.HTTP 1.1 用着也还行，性能不好，但也不算差。

3.HTTP 3 出来得太快了，没有给HTTP 2留下发挥时间，HTTP 2还没来得及全面推广，HTTP 3就横空出世了，既然有更好的可以用，有什么理由还升HTTP 2呢？
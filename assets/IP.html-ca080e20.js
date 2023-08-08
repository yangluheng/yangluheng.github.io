import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as a,o as l,c as s,a as r,e,d as n,f as c}from"./app-e1e4ec42.js";const i={},h=c('<h2 id="_1-ip-地址的基础知识" tabindex="-1"><a class="header-anchor" href="#_1-ip-地址的基础知识" aria-hidden="true">#</a> 1.IP 地址的基础知识</h2><p>IP 地址（IPv4 地址）由 <code>32</code> 位正整数来表示，IP 地址在计算机是以二进制的方式处理的。每 8 位作为一组，并用点分十进制的表示方式。</p><p>IPv6 的地址是 <code>128</code> 位的，这可分配的地址数量是大的惊人，说个段子 **IPv6 可以保证地球上的每粒沙子都能被分配到一个 IP 地址。**每 16 位作为一组，每组用冒号 「:」 隔开。</p><h3 id="_1-1ip-地址的分类" tabindex="-1"><a class="header-anchor" href="#_1-1ip-地址的分类" aria-hidden="true">#</a> 1.1IP 地址的分类</h3><p>IP 地址分类成了 5 种类型，分别是 A 类、B 类、C 类、D 类、E 类。</p><figure><img src="http://www.img.youngxy.top/Java/fig/ip分类.webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_2-arp协议" tabindex="-1"><a class="header-anchor" href="#_2-arp协议" aria-hidden="true">#</a> 2.ARP协议</h2><ul><li>主机会通过<strong>广播发送 ARP 请求</strong>，这个包中包含了想要知道的 MAC 地址的主机 IP 地址。</li><li>当同个链路中的所有设备收到 ARP 请求时，会去拆开 ARP 请求包里的内容，如果 ARP 请求包中的目标 IP 地址与自己的 IP 地址一致，那么这个设备就将自己的 MAC 地址塞入 <strong>ARP 响应包</strong>返回给主机。</li></ul><p>操作系统通常会把第一次通过 ARP 获取的 MAC 地址缓存起来，以便下次直接从缓存中找到对应 IP 地址的 MAC 地址。</p><p>不过，MAC 地址的缓存是有一定期限的，超过这个期限，缓存的内容将被清除。</p><h2 id="_3-dns协议" tabindex="-1"><a class="header-anchor" href="#_3-dns协议" aria-hidden="true">#</a> 3.DNS协议</h2><p>域名的层级关系类似一个树状结构：</p>',12),_=r("li",null,"根 DNS 服务器",-1),d=r("li",null,"顶级域 DNS 服务器（com）",-1),p={href:"http://server.com",target:"_blank",rel:"noopener noreferrer"},w=r("p",null,[e("浏览器首先看一下自己的缓存里有没有，如果没有就向操作系统的缓存要，还没有就检查本机域名解析文件 "),r("code",null,"hosts"),e("，如果还是没有，就会 DNS 服务器进行查询，查询的过程如下：")],-1),f={href:"http://www.server.com",target:"_blank",rel:"noopener noreferrer"},m={href:"http://www.server.com",target:"_blank",rel:"noopener noreferrer"},u={href:"http://www.server.com",target:"_blank",rel:"noopener noreferrer"},P={href:"http://www.server.com",target:"_blank",rel:"noopener noreferrer"},I={href:"http://www.server.com",target:"_blank",rel:"noopener noreferrer"},v={href:"http://www.server.com",target:"_blank",rel:"noopener noreferrer"},N={href:"http://server.com",target:"_blank",rel:"noopener noreferrer"},g=r("li",null,"权威 DNS 服务器查询后将对应的 IP 地址 X.X.X.X 告诉本地 DNS。",-1),D=r("li",null,"本地 DNS 再将 IP 地址返回客户端，客户端和目标建立连接。",-1);function S(b,A){const o=a("ExternalLinkIcon");return l(),s("div",null,[h,r("ul",null,[_,d,r("li",null,[e("权威 DNS 服务器（"),r("a",p,[e("server.com"),n(o)]),e("）")])]),w,r("ul",null,[r("li",null,[e("客户端首先会发出一个 DNS 请求，问 "),r("a",f,[e("www.server.com"),n(o)]),e(" 的 IP 是啥，并发给本地 DNS 服务器（也就是客户端的 TCP/IP 设置中填写的 DNS 服务器地址）。")]),r("li",null,[e("本地域名服务器收到客户端的请求后，如果缓存里的表格能找到 "),r("a",m,[e("www.server.com"),n(o)]),e("，则它直接返回 IP 地址。如果没有，本地 DNS 会去问它的根域名服务器：“老大， 能告诉我 "),r("a",u,[e("www.server.com"),n(o)]),e(" 的 IP 地址吗？” 根域名服务器是最高层次的，它不直接用于域名解析，但能指明一条道路。")]),r("li",null,[e("根 DNS 收到来自本地 DNS 的请求后，发现后置是 .com，说：“"),r("a",P,[e("www.server.com"),n(o)]),e(" 这个域名归 .com 区域管理”，我给你 .com 顶级域名服务器地址给你，你去问问它吧。”")]),r("li",null,[e("本地 DNS 收到顶级域名服务器的地址后，发起请求问“老二， 你能告诉我 "),r("a",I,[e("www.server.com"),n(o)]),e(" 的 IP 地址吗？”")]),r("li",null,[e("顶级域名服务器说：“我给你负责 "),r("a",v,[e("www.server.com"),n(o)]),e(" 区域的权威 DNS 服务器的地址，你去问它应该能问到”。")]),r("li",null,[e("本地 DNS 于是转向问权威 DNS 服务器：“老三，www.server.com对应的IP是啥呀？” "),r("a",N,[e("server.com"),n(o)]),e(" 的权威 DNS 服务器，它是域名解析结果的原出处。为啥叫权威呢？就是我的域名我做主。")]),g,D])])}const C=t(i,[["render",S],["__file","IP.html.vue"]]);export{C as default};

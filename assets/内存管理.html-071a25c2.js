import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as s,f as e}from"./app-e1e4ec42.js";const r={},t=e(`<h2 id="_1-局部性原理" tabindex="-1"><a class="header-anchor" href="#_1-局部性原理" aria-hidden="true">#</a> 1.局部性原理</h2><p>在了解这部分知识之前，我要先告诉大家一个常见的<strong>局部性原理</strong>：</p><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>程序局部性原理表现为：<strong>时间局部性和空间局部性</strong>。时间局部性是指如果程序中的某条指令一旦执行，则不久之后该指令可能再次被执行；如果某块数据被访问，则不久之后该数据可能再次被访问。空间局部性是指一旦程序访问了某个存储单元，则不久之后，其附近的存储单元也将被访问。</p></div><p>说白了就是<strong>一个变量在程序运行过程中，如果被引用过一次，那后续很有可能会再被引用到；一个变量被访问到过后，这个变量所在的位置附近的位置很有可能在程序后续运行中被访问到</strong>。</p><p>下面我们通过一段代码来看看局部性原理：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">sum</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> array<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> sum <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> array<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            sum <span class="token operator">=</span> sum <span class="token operator">+</span> array<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> sum<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从上面的这段代码来看，就是一个很简单的数组元素求和，这里我们主要看 sum 和 array 两个变量，我们可以看到 sum 在每次循环中都会用到，另外它只是一个简单变量，所以我们可以看到，sum 是符合我们上面提到的时间局部性，再访问一次后还会被继续访问到，但是它不存在我们所说的空间局部性了。</p><p>相反的，array 数组中的每个元素只访问一次，另外数组底层的存储是连续的，所以 array 变量符合我们上面提到的空间局部性，但是不符合时间局部性。</p><h2 id="_2-为什么需要虚拟内存" tabindex="-1"><a class="header-anchor" href="#_2-为什么需要虚拟内存" aria-hidden="true">#</a> 2.为什么需要虚拟内存？</h2><p><strong>操作系统会提供一种机制，将不同进程的虚拟地址和不同内存的物理地址映射起来。</strong></p><p>如果程序要访问虚拟地址的时候，由操作系统转换成不同的物理地址，这样不同的进程运行的时候，写入的是不同的物理地址，这样就不会冲突了。</p><p>于是，这里就引出了两种地址的概念：</p><ul><li>我们程序所使用的内存地址叫做<strong>虚拟内存地址</strong>（<em>Virtual Memory Address</em>）</li><li>实际存在硬件里面的空间地址叫<strong>物理内存地址</strong>（<em>Physical Memory Address</em>）。</li></ul><p>操作系统引入了虚拟内存，进程持有的虚拟地址会通过 CPU 芯片中的内存管理单元（MMU）的映射关系，来转换变成物理地址，然后再通过物理地址访问内存。</p><p><strong>虚拟内存有什么作用？</strong></p><ul><li>第一，虚拟内存可以使得进程对运行内存超过物理内存大小，因为程序运行符合局部性原理，CPU 访问内存会有很明显的重复访问的倾向性，对于那些没有被经常使用到的内存，我们可以把它换出到物理内存之外，比如硬盘上的 swap 区域。</li><li>第二，由于每个进程都有自己的页表，所以每个进程的虚拟内存空间就是相互独立的。进程也没有办法访问其他进程的页表，所以这些页表是私有的，这就解决了多进程之间地址冲突的问题。</li><li>第三，页表里的页表项中除了物理地址之外，还有一些标记属性的比特，比如控制一个页的读写权限，标记该页是否存在等。在内存访问方面，操作系统提供了更好的安全性。</li></ul><h2 id="_3-内存分段" tabindex="-1"><a class="header-anchor" href="#_3-内存分段" aria-hidden="true">#</a> 3.内存分段</h2><p>程序是由若干个逻辑分段组成的，如可由代码分段、数据分段、栈段、堆段组成。<strong>不同的段是有不同的属性的，所以就用分段（*Segmentation*）的形式把这些段分离出来。</strong></p><blockquote><p>分段机制下，虚拟地址和物理地址是如何映射的？</p></blockquote><p>分段机制下的虚拟地址由两部分组成，<strong>段选择因子</strong>和<strong>段内偏移量</strong>。</p><p>段选择因子和段内偏移量：</p><ul><li><strong>段选择子</strong>就保存在段寄存器里面。段选择子里面最重要的是<strong>段号</strong>，用作段表的索引。<strong>段表</strong>里面保存的是这个<strong>段的基地址、段的界限和特权等级</strong>等。</li><li>虚拟地址中的<strong>段内偏移量</strong>应该位于 0 和段界限之间，如果段内偏移量是合法的，就将段基地址加上段内偏移量得到物理内存地址。</li></ul><p>分段的办法很好，解决了程序本身不需要关心具体的物理内存地址的问题，但它也有一些不足之处：</p><ul><li>第一个就是<strong>内存碎片</strong>的问题。</li><li>第二个就是<strong>内存交换的效率低</strong>的问题。</li></ul><p>内存碎片主要分为，内部内存碎片和外部内存碎片。</p><p>内存分段管理可以做到段根据实际需求分配内存，所以有多少需求就分配多大的段，所以<strong>不会出现内部内存碎片</strong>。</p><p>但是由于每个段的长度不固定，所以多个段未必能恰好使用所有的内存空间，会产生了多个不连续的小物理内存，导致新的程序无法被装载，所以<strong>会出现外部内存碎片</strong>的问题。</p><p>解决「外部内存碎片」的问题就是<strong>内存交换</strong>。</p><h2 id="_4-内存分页" tabindex="-1"><a class="header-anchor" href="#_4-内存分页" aria-hidden="true">#</a> 4.内存分页</h2><p>分段的好处就是能产生连续的内存空间，但是会出现「外部内存碎片和内存交换的空间太大」的问题。</p><p>要解决这些问题，那么就要想出能少出现一些内存碎片的办法。另外，当需要进行内存交换的时候，让需要交换写入或者从磁盘装载的数据更少一点，这样就可以解决问题了。这个办法，也就是<strong>内存分页</strong>（<em>Paging</em>）。</p><p><strong>分页是把整个虚拟和物理内存空间切成一段段固定尺寸的大小</strong>。这样一个连续并且尺寸固定的内存空间，我们叫<strong>页</strong>（<em>Page</em>）。在 Linux 下，每一页的大小为 <code>4KB</code>。</p><blockquote><p>分页是怎么解决分段的「外部内存碎片和内存交换效率低」的问题？</p></blockquote><p>内存分页由于内存空间都是预先划分好的，也就不会像内存分段一样，在段与段之间会产生间隙非常小的内存，这正是分段会产生外部内存碎片的原因。而<strong>采用了分页，页与页之间是紧密排列的，所以不会有外部碎片。</strong></p><p>但是，因为内存分页机制分配内存的最小单位是一页，即使程序不足一页大小，我们最少只能分配一个页，所以页内会出现内存浪费，所以针对<strong>内存分页机制会有内部内存碎片</strong>的现象。</p><blockquote><p>分页机制下，虚拟地址和物理地址是如何映射的？</p></blockquote><p>在分页机制下，虚拟地址分为两部分，<strong>页号</strong>和<strong>页内偏移</strong>。页号作为页表的索引，<strong>页表</strong>包含物理页每页所在<strong>物理内存的基地址</strong>，这个基地址与页内偏移的组合就形成了物理内存地址。</p><h3 id="_4-1多级页表" tabindex="-1"><a class="header-anchor" href="#_4-1多级页表" aria-hidden="true">#</a> 4.1多级页表</h3><p>在前面我们知道了，对于单页表的实现方式，在 32 位和页大小 <code>4KB</code> 的环境下，一个进程的页表需要装下 100 多万个「页表项」，并且每个页表项是占用 4 字节大小的，于是相当于每个页表需占用 4MB 大小的空间。</p><p>我们把这个 100 多万个「页表项」的单级页表再分页，将页表（一级页表）分为 <code>1024</code> 个页表（二级页表），每个表（二级页表）中包含 <code>1024</code> 个「页表项」，形成<strong>二级分页</strong>。</p><p>对于 64 位的系统，两级分页肯定不够了，就变成了四级目录，分别是：</p><ul><li>全局页目录项 PGD（<em>Page Global Directory</em>）；</li><li>上层页目录项 PUD（<em>Page Upper Directory</em>）；</li><li>中间页目录项 PMD（<em>Page Middle Directory</em>）；</li><li>页表项 PTE（<em>Page Table Entry</em>）；</li></ul><h3 id="_4-2tlb" tabindex="-1"><a class="header-anchor" href="#_4-2tlb" aria-hidden="true">#</a> 4.2TLB</h3><p>多级页表虽然解决了空间上的问题，但是虚拟地址到物理地址的转换就多了几道转换的工序，这显然就降低了这俩地址转换的速度，也就是带来了时间上的开销。</p><p>TLB（<em>Translation Lookaside Buffer</em>） ，通常称为页表缓存、转址旁路缓存、快表等。</p><p>在 CPU 芯片里面，封装了内存管理单元（<em>Memory Management Unit</em>）芯片，它用来完成地址转换和 TLB 的访问与交互。</p><p>有了 TLB 后，那么 CPU 在寻址时，会先查 TLB，如果没找到，才会继续查常规的页表。</p><h2 id="_5-段页式内存管理" tabindex="-1"><a class="header-anchor" href="#_5-段页式内存管理" aria-hidden="true">#</a> 5.段页式内存管理</h2><p>段页式内存管理实现的方式：</p><ul><li>先将程序划分为多个有逻辑意义的段，也就是前面提到的分段机制；</li><li>接着再把每个段划分为多个页，也就是对分段划分出来的连续空间，再划分固定大小的页；</li></ul><p>这样，地址结构就由<strong>段号、段内页号和页内位移</strong>三部分组成。</p><p>用于段页式地址变换的数据结构是每一个程序一张段表，每个段又建立一张页表，段表中的地址是页表的起始地址，而页表中的地址则为某页的物理页号。</p><p>段页式地址变换中要得到物理地址须经过三次内存访问：</p><ul><li>第一次访问段表，得到页表起始地址；</li><li>第二次访问页表，得到物理页号；</li><li>第三次将物理页号与页内位移组合，得到物理地址。</li></ul><h2 id="_6-linux-内存布局" tabindex="-1"><a class="header-anchor" href="#_6-linux-内存布局" aria-hidden="true">#</a> 6.Linux 内存布局</h2><p><strong>Linux 内存主要采用的是页式内存管理，但同时也不可避免地涉及了段机制</strong>。</p><p>在 Linux 操作系统中，虚拟地址空间的内部又被分为<strong>内核空间和用户空间</strong>两部分，不同位数的系统，地址空间的范围也不同。比如最常见的 32 位和 64 位系统，如下所示：</p><figure><img src="http://www.img.youngxy.top/Java/fig/linux内存管理.webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>通过这里可以看出：</p><ul><li><code>32</code> 位系统的内核空间占用 <code>1G</code>，位于最高处，剩下的 <code>3G</code> 是用户空间；</li><li><code>64</code> 位系统的内核空间和用户空间都是 <code>128T</code>，分别占据整个内存空间的最高和最低处，剩下的中间部分是未定义的。</li></ul><h2 id="_7-如何避免预读失效和缓存污染的问题" tabindex="-1"><a class="header-anchor" href="#_7-如何避免预读失效和缓存污染的问题" aria-hidden="true">#</a> 7.如何避免预读失效和缓存污染的问题？</h2><h3 id="_7-1预读失效会带来什么问题" tabindex="-1"><a class="header-anchor" href="#_7-1预读失效会带来什么问题" aria-hidden="true">#</a> 7.1预读失效会带来什么问题？</h3><p>如果<strong>这些被提前加载进来的页，并没有被访问</strong>，相当于这个预读工作是白做了，这个就是<strong>预读失效</strong>。</p><p>如果使用传统的 LRU 算法，就会把「预读页」放到 LRU 链表头部，而当内存空间不够的时候，还需要把末尾的页淘汰掉。</p><p>如果这些「预读页」如果一直不会被访问到，就会出现一个很奇怪的问题，<strong>不会被访问的预读页却占用了 LRU 链表前排的位置，而末尾淘汰的页，可能是热点数据，这样就大大降低了缓存命中率</strong> 。</p><h3 id="_7-2缓存污染会带来什么问题" tabindex="-1"><a class="header-anchor" href="#_7-2缓存污染会带来什么问题" aria-hidden="true">#</a> 7.2缓存污染会带来什么问题？</h3><p>当我们在批量读取数据的时候，由于数据被访问了一次，这些大量数据都会被加入到「活跃 LRU 链表」里，然后之前缓存在活跃 LRU 链表（或者 young 区域）里的热点数据全部都被淘汰了，<strong>如果这些大量的数据在很长一段时间都不会被访问的话，那么整个活跃 LRU 链表（或者 young 区域）就被污染了</strong>。</p><h3 id="_7-3linux-操作系统的缓存" tabindex="-1"><a class="header-anchor" href="#_7-3linux-操作系统的缓存" aria-hidden="true">#</a> 7.3Linux 操作系统的缓存</h3><p>在应用程序读取文件的数据的时候，Linux 操作系统是会对读取的文件数据进行缓存的，会缓存在文件系统中的 <strong>Page Cache</strong>。</p><h4 id="_7-3-1linux-是如何避免预读失效带来的影响" tabindex="-1"><a class="header-anchor" href="#_7-3-1linux-是如何避免预读失效带来的影响" aria-hidden="true">#</a> 7.3.1Linux 是如何避免预读失效带来的影响？</h4><p>Linux 操作系统实现两个了 LRU 链表：<strong>活跃 LRU 链表（active_list）和非活跃 LRU 链表（inactive_list）</strong>。</p><ul><li><strong>active list</strong> 活跃内存页链表，这里存放的是最近被访问过（活跃）的内存页；</li><li><strong>inactive list</strong> 不活跃内存页链表，这里存放的是很少被访问（非活跃）的内存页；</li></ul><p>有了这两个 LRU 链表后，<strong>预读页就只需要加入到 inactive list 区域的头部，当页被真正访问的时候，才将页插入 active list 的头部</strong>。如果预读的页一直没有被访问，就会从 inactive list 移除，这样就不会影响 active list 中的热点数据。</p><h4 id="_7-3-2linux-操作系统怎么避免缓存污染造成的影响" tabindex="-1"><a class="header-anchor" href="#_7-3-2linux-操作系统怎么避免缓存污染造成的影响" aria-hidden="true">#</a> 7.3.2Linux 操作系统怎么避免缓存污染造成的影响？</h4><p>在内存页被访问<strong>第二次</strong>的时候，才将页从 inactive list 升级到 active list 里。</p><h3 id="_7-4mysql-的缓存" tabindex="-1"><a class="header-anchor" href="#_7-4mysql-的缓存" aria-hidden="true">#</a> 7.4MySQL 的缓存</h3><p>MySQL 的数据是存储在磁盘里的，为了提升数据库的读写性能，Innodb 存储引擎设计了一个<strong>缓冲池</strong>（Buffer Pool），Buffer Pool 属于内存空间里的数据。</p><h4 id="_7-4-1mysql-是如何避免预读失效带来的影响" tabindex="-1"><a class="header-anchor" href="#_7-4-1mysql-是如何避免预读失效带来的影响" aria-hidden="true">#</a> 7.4.1MySQL 是如何避免预读失效带来的影响？</h4><p>MySQL 的 Innodb 存储引擎是在一个 LRU 链表上划分来 2 个区域，<strong>young 区域 和 old 区域</strong>。</p><p>young 区域在 LRU 链表的前半部分，old 区域则是在后半部分，这两个区域都有各自的头和尾节点。</p><p><strong>划分这两个区域后，预读的页就只需要加入到 old 区域的头部，当页被真正访问的时候，才将页插入 young 区域的头部</strong>。如果预读的页一直没有被访问，就会从 old 区域移除，这样就不会影响 young 区域中的热点数据。</p><h4 id="_7-4-2mysql怎么避免缓存污染造成的影响" tabindex="-1"><a class="header-anchor" href="#_7-4-2mysql怎么避免缓存污染造成的影响" aria-hidden="true">#</a> 7.4.2MySQL怎么避免缓存污染造成的影响？</h4><p>在内存页被访问第二次的时候，并不会马上将该页从 old 区域升级到 young 区域，因为还要进行停留在 old 区域的时间判断：</p><ul><li>如果第二次的访问时间与第一次访问的时间<strong>在 1 秒内</strong>（默认值），那么该页就<strong>不会</strong>被从 old 区域升级到 young 区域；</li><li>如果第二次的访问时间与第一次访问的时间<strong>超过 1 秒</strong>，那么该页就<strong>会</strong>从 old 区域升级到 young 区域；</li></ul><h2 id="_8-内存页面置换算法" tabindex="-1"><a class="header-anchor" href="#_8-内存页面置换算法" aria-hidden="true">#</a> 8.内存页面置换算法</h2><p>页面置换算法的功能是，<strong>当出现缺页异常，需调入新页面而内存已满时，选择被置换的物理页面</strong>，也就是说选择一个物理页面换出到磁盘，然后把需要访问的页面换入到物理页。</p><p>常见的页面置换算法有如下几种：</p><ul><li>最佳页面置换算法（<em>OPT</em>）</li><li>先进先出置换算法（<em>FIFO</em>）</li><li>最近最久未使用的置换算法（<em>LRU</em>）</li><li>时钟页面置换算法（<em>Lock</em>）</li><li>最不常用置换算法（<em>LFU</em>）</li></ul><h3 id="_8-1最佳页面置换算法" tabindex="-1"><a class="header-anchor" href="#_8-1最佳页面置换算法" aria-hidden="true">#</a> 8.1最佳页面置换算法</h3><p>最佳页面置换算法基本思路是，<strong>置换在「未来」最长时间不访问的页面</strong>。</p><p>所以，该算法实现需要计算内存中每个逻辑页面的「下一次」访问时间，然后比较，选择未来最长时间不访问的页面。</p><p>这很理想，但是实际系统中无法实现，因为程序访问页面时是动态的，我们是无法预知每个页面在「下一次」访问前的等待时间。</p><p>所以，最佳页面置换算法作用是为了衡量你的算法的效率，你的算法效率越接近该算法的效率，那么说明你的算法是高效的。</p><h3 id="_8-2先进先出置换算法" tabindex="-1"><a class="header-anchor" href="#_8-2先进先出置换算法" aria-hidden="true">#</a> 8.2先进先出置换算法</h3><p><strong>选择在内存驻留时间很长的页面进行中置换</strong>，这个就是「先进先出置换」算法的思想。</p><h3 id="_8-3最近最久未使用的置换算法" tabindex="-1"><a class="header-anchor" href="#_8-3最近最久未使用的置换算法" aria-hidden="true">#</a> 8.3最近最久未使用的置换算法</h3><p>最近最久未使用（<em>LRU</em>）的置换算法的基本思路是，发生缺页时，<strong>选择最长时间没有被访问的页面进行置换</strong>，也就是说，该算法假设已经很久没有使用的页面很有可能在未来较长的一段时间内仍然不会被使用。</p><p>这种算法近似最优置换算法，最优置换算法是通过「未来」的使用情况来推测要淘汰的页面，而 LRU 则是通过「历史」的使用情况来推测要淘汰的页面。</p><p>虽然 LRU 在理论上是可以实现的，但代价很高。为了完全实现 LRU，需要在内存中维护一个所有页面的链表，最近最多使用的页面在表头，最近最少使用的页面在表尾。</p><p>困难的是，在每次访问内存时都必须要更新「整个链表」。在链表中找到一个页面，删除它，然后把它移动到表头是一个非常费时的操作。</p><p>所以，LRU 虽然看上去不错，但是由于开销比较大，实际应用中比较少使用。</p><h3 id="_8-4时钟页面置换算法" tabindex="-1"><a class="header-anchor" href="#_8-4时钟页面置换算法" aria-hidden="true">#</a> 8.4时钟页面置换算法</h3><p>该算法的思路是，把所有的页面都保存在一个类似钟面的「环形链表」中，一个表针指向最老的页面。</p><p>当发生缺页中断时，算法首先检查表针指向的页面：</p><ul><li>如果它的访问位位是 0 就淘汰该页面，并把新的页面插入这个位置，然后把表针前移一个位置；</li><li>如果访问位是 1 就清除访问位，并把表针前移一个位置，重复这个过程直到找到了一个访问位为 0 的页面为止；</li></ul><h3 id="_8-5最不常用算法" tabindex="-1"><a class="header-anchor" href="#_8-5最不常用算法" aria-hidden="true">#</a> 8.5最不常用算法</h3><p>最不常用（<em>LFU</em>）算法，这名字听起来很调皮，但是它的意思不是指这个算法不常用，而是<strong>当发生缺页中断时，选择「访问次数」最少的那个页面，并将其淘汰</strong>。</p><p>它的实现方式是，对每个页面设置一个「访问计数器」，每当一个页面被访问时，该页面的访问计数器就累加 1。在发生缺页中断时，淘汰计数器值最小的那个页面。</p><h2 id="_9-磁盘调度算法" tabindex="-1"><a class="header-anchor" href="#_9-磁盘调度算法" aria-hidden="true">#</a> 9.磁盘调度算法</h2><p>常见的磁盘调度算法有：</p><ul><li>先来先服务算法</li><li>最短寻道时间优先算法</li><li>扫描算法</li><li>循环扫描算法</li><li>LOOK 与 C-LOOK 算法</li></ul><h3 id="_9-1先来先服务" tabindex="-1"><a class="header-anchor" href="#_9-1先来先服务" aria-hidden="true">#</a> 9.1先来先服务</h3><p>顾名思义，先到来的请求，先被服务。</p><h3 id="_9-2最短寻道时间优先" tabindex="-1"><a class="header-anchor" href="#_9-2最短寻道时间优先" aria-hidden="true">#</a> 9.2最短寻道时间优先</h3><p>最短寻道时间优先（<em>Shortest Seek First，SSF</em>）算法的工作方式是，优先选择从当前磁头位置所需寻道时间最短的请求。</p><p>但这个算法可能存在某些请求的<strong>饥饿</strong>，这里<strong>产生饥饿的原因是磁头在一小块区域来回移动</strong>。</p><h3 id="_9-3扫描算法" tabindex="-1"><a class="header-anchor" href="#_9-3扫描算法" aria-hidden="true">#</a> 9.3扫描算法</h3><p><strong>磁头在一个方向上移动，访问所有未完成的请求，直到磁头到达该方向上的最后的磁道，才调换方向，这就是扫描（Scan）算法</strong>。</p><h3 id="_9-4循环扫描算法" tabindex="-1"><a class="header-anchor" href="#_9-4循环扫描算法" aria-hidden="true">#</a> 9.4循环扫描算法</h3><p>循环扫描（<em>Circular Scan, CSCAN</em> ）规定：只有磁头朝某个特定方向移动时，才处理磁道访问请求，而返回时直接快速移动至最靠边缘的磁道，也就是复位磁头，这个过程是很快的，并且<strong>返回中途不处理任何请求</strong>，该算法的特点，就是<strong>磁道只响应一个方向上的请求</strong>。</p><h3 id="_9-5look-与-c-look算法" tabindex="-1"><a class="header-anchor" href="#_9-5look-与-c-look算法" aria-hidden="true">#</a> 9.5LOOK 与 C-LOOK算法</h3><p>针对 SCAN 算法的优化则叫 LOOK 算法，它的工作方式，磁头在每个方向上仅仅移动到最远的请求位置，然后立即反向移动，而不需要移动到磁盘的最始端或最末端，<strong>反向移动的途中会响应请求</strong>。</p><p>针对 C-SCAN 算法的优化则叫 C-LOOK，它的工作方式，磁头在每个方向上仅仅移动到最远的请求位置，然后立即反向移动，而不需要移动到磁盘的最始端或最末端，<strong>反向移动的途中不会响应请求</strong>。</p>`,123),i=[t];function o(p,l){return a(),s("div",null,i)}const h=n(r,[["render",o],["__file","内存管理.html.vue"]]);export{h as default};

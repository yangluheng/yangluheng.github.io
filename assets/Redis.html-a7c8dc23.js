import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r as d,o as r,c as s,d as e,e as n,b as o,f as t}from"./app-e5b0ad63.js";const l={},h=t(`<h3 id="redis" tabindex="-1"><a class="header-anchor" href="#redis" aria-hidden="true">#</a> Redis</h3><h4 id="redis-为什么这么快" tabindex="-1"><a class="header-anchor" href="#redis-为什么这么快" aria-hidden="true">#</a> Redis 为什么这么快？</h4><p>Redis 内部做了非常多的性能优化，比较重要的主要有下面 3 点：</p><ul><li>Redis 基于内存，内存的访问速度是磁盘的上千倍；</li><li>Redis 基于 Reactor 模式设计开发了一套高效的事件处理模型，主要是单线程事件循环和 IO 多路复用（Redis 线程模式后面会详细介绍到）；</li><li>Redis 内置了多种优化过后的数据结构实现，性能非常高。</li></ul><h4 id="基本数据类型" tabindex="-1"><a class="header-anchor" href="#基本数据类型" aria-hidden="true">#</a> 基本数据类型</h4><p><strong>5 种基础数据类型</strong> ：String（字符串）、List（列表）、Set（集合）、Hash（散列）、Zset（有序集合）。</p><p><strong>3 种特殊数据类型</strong> ：HyperLogLogs（基数统计）、Bitmap （位存储）、Geospatial (地理位置)。</p><h4 id="数据结构及适用场景" tabindex="-1"><a class="header-anchor" href="#数据结构及适用场景" aria-hidden="true">#</a> 数据结构及适用场景</h4><h5 id="string-字符串" tabindex="-1"><a class="header-anchor" href="#string-字符串" aria-hidden="true">#</a> String（字符串）：</h5><h6 id="数据结构" tabindex="-1"><a class="header-anchor" href="#数据结构" aria-hidden="true">#</a> 数据结构：</h6><p>String 类型的底层的数据结构实现主要是 int 和 SDS（简单动态字符串）。</p><p>SDS 和我们认识的 C 字符串不太一样，之所以没有使用 C 语言的字符串表示，因为 SDS 相比于 C 的原生字符串：</p><ul><li><strong>SDS 不仅可以保存文本数据，还可以保存二进制数据</strong>。因为 <code>SDS</code> 使用 <code>len</code> 属性的值而不是空字符来判断字符串是否结束，并且 SDS 的所有 API 都会以处理二进制的方式来处理 SDS 存放在 <code>buf[]</code> 数组里的数据。所以 SDS 不光能存放文本数据，而且能保存图片、音频、视频、压缩文件这样的二进制数据。</li><li><strong>SDS 获取字符串长度的时间复杂度是 O(1)</strong>。因为 C 语言的字符串并不记录自身长度，所以获取长度的复杂度为 O(n)；而 SDS 结构里用 <code>len</code> 属性记录了字符串长度，所以复杂度为 <code>O(1)</code>。</li><li><strong>Redis 的 SDS API 是安全的，拼接字符串不会造成缓冲区溢出</strong>。因为 SDS 在拼接字符串之前会检查 SDS 空间是否满足要求，如果空间不够会自动扩容，所以不会导致缓冲区溢出的问题。</li></ul><h6 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> 应用场景：</h6><ul><li>常规数据（比如 session、token、序列化后的对象、图片的路径）的缓存；</li><li>计数比如用户单位时间的请求数（简单限流可以用到）、页面单位时间的访问数；</li><li>分布式锁(利用 <code>SETNX key value</code> 命令可以实现一个最简易的分布式锁)；</li></ul><h5 id="list-列表" tabindex="-1"><a class="header-anchor" href="#list-列表" aria-hidden="true">#</a> List（列表）：</h5><h6 id="数据结构-1" tabindex="-1"><a class="header-anchor" href="#数据结构-1" aria-hidden="true">#</a> 数据结构：</h6><p>List 类型的底层数据结构是由<strong>双向链表或压缩列表</strong>实现的：</p><ul><li>如果列表的元素个数小于 <code>512</code> 个（默认值，可由 <code>list-max-ziplist-entries</code> 配置），列表每个元素的值都小于 <code>64</code> 字节（默认值，可由 <code>list-max-ziplist-value</code> 配置），Redis 会使用<strong>压缩列表</strong>作为 List 类型的底层数据结构；</li><li>如果列表的元素不满足上面的条件，Redis 会使用<strong>双向链表</strong>作为 List 类型的底层数据结构；</li></ul><p>但是<strong>在 Redis 3.2 版本之后，List 数据类型底层数据结构就只由 quicklist 实现了，替代了双向链表和压缩列表</strong>。</p><h6 id="应用场景-1" tabindex="-1"><a class="header-anchor" href="#应用场景-1" aria-hidden="true">#</a> 应用场景：</h6><p>消息队列，List 可以使用 LPUSH + RPOP （或者反过来，RPUSH+LPOP）命令实现消息队列；</p><h5 id="set-集合" tabindex="-1"><a class="header-anchor" href="#set-集合" aria-hidden="true">#</a> Set（集合）：</h5><h6 id="数据结构-2" tabindex="-1"><a class="header-anchor" href="#数据结构-2" aria-hidden="true">#</a> 数据结构：</h6><p>Set 类型的底层数据结构是由<strong>哈希表或整数集合</strong>实现的：</p><ul><li>如果集合中的元素都是整数且元素个数小于 <code>512</code> （默认值，<code>set-maxintset-entries</code>配置）个，Redis 会使用<strong>整数集合</strong>作为 Set 类型的底层数据结构；</li><li>如果集合中的元素不满足上面条件，则 Redis 使用<strong>哈希表</strong>作为 Set 类型的底层数据结构。</li></ul><h6 id="应用场景-2" tabindex="-1"><a class="header-anchor" href="#应用场景-2" aria-hidden="true">#</a> 应用场景：</h6><p>点赞、共同关注；</p><h5 id="hash-散列" tabindex="-1"><a class="header-anchor" href="#hash-散列" aria-hidden="true">#</a> Hash（散列）：</h5><h6 id="数据结构-3" tabindex="-1"><a class="header-anchor" href="#数据结构-3" aria-hidden="true">#</a> 数据结构：</h6><p>Hash 类型的底层数据结构是由<strong>压缩列表或哈希表</strong>实现的：</p><ul><li>如果哈希类型元素个数小于 <code>512</code> 个（默认值，可由 <code>hash-max-ziplist-entries</code> 配置），所有值小于 <code>64</code> 字节（默认值，可由 <code>hash-max-ziplist-value</code> 配置）的话，Redis 会使用<strong>压缩列表</strong>作为 Hash 类型的底层数据结构；</li><li>如果哈希类型元素不满足上面条件，Redis 会使用<strong>哈希表</strong>作为 Hash 类型的 底层数据结构。</li></ul><p><strong>在 Redis 7.0 中，压缩列表数据结构已经废弃了，交由 listpack 数据结构来实现了</strong>。</p><h6 id="应用场景-3" tabindex="-1"><a class="header-anchor" href="#应用场景-3" aria-hidden="true">#</a> 应用场景：</h6><p>Hash 类型的 （key，field， value） 的结构与对象的（对象id， 属性， 值）的结构相似，也可以用来存储对象以及购物车；</p><h5 id="zset-有序集合" tabindex="-1"><a class="header-anchor" href="#zset-有序集合" aria-hidden="true">#</a> Zset（有序集合）：</h5><h6 id="数据结构-4" tabindex="-1"><a class="header-anchor" href="#数据结构-4" aria-hidden="true">#</a> 数据结构：</h6><p>Zset 类型的底层数据结构是由<strong>压缩列表或跳表</strong>实现的：</p><ul><li>如果有序集合的元素个数小于 <code>128</code> 个，并且每个元素的值小于 <code>64</code> 字节时，Redis 会使用<strong>压缩列表</strong>作为 Zset 类型的底层数据结构；</li><li>如果有序集合的元素不满足上面的条件，Redis 会使用<strong>跳表</strong>作为 Zset 类型的底层数据结构；</li></ul><p><strong>在 Redis 7.0 中，压缩列表数据结构已经废弃了，交由 listpack 数据结构来实现了。</strong></p><h6 id="应用场景-4" tabindex="-1"><a class="header-anchor" href="#应用场景-4" aria-hidden="true">#</a> 应用场景：</h6><p>有序集合比较典型的使用场景就是排行榜。例如学生成绩的排名榜、游戏积分排行榜、视频播放排名、电商系统中商品的销量排名等。</p><h4 id="持久化" tabindex="-1"><a class="header-anchor" href="#持久化" aria-hidden="true">#</a> 持久化</h4><p>Redis 不同于 Memcached 的很重要一点就是，Redis 支持持久化，而且支持 3 种持久化方式:</p><ul><li>快照（snapshotting，RDB）</li><li>只追加文件（append-only file, AOF）</li><li>RDB 和 AOF 的混合持久化(Redis 4.0 新增)</li></ul><h3 id="什么是-rdb-持久化" tabindex="-1"><a class="header-anchor" href="#什么是-rdb-持久化" aria-hidden="true">#</a> 什么是 RDB 持久化？</h3><p>Redis 可以通过创建快照来获得存储在内存里面的数据在 <strong>某个时间点</strong> 上的副本。Redis 创建快照之后，可以对快照进行备份，可以将快照复制到其他服务器从而创建具有相同数据的服务器副本（Redis 主从结构，主要用来提高 Redis 性能），还可以将快照留在原地以便重启服务器的时候使用。</p><p>快照持久化是 Redis 默认采用的持久化方式，在 <code>redis.conf</code> 配置文件中默认有此下配置：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>save 900 1           #在900秒(15分钟)之后，如果至少有1个key发生变化，Redis就会自动触发bgsave命令创建快照。

save 300 10          #在300秒(5分钟)之后，如果至少有10个key发生变化，Redis就会自动触发bgsave命令创建快照。

save 60 10000        #在60秒(1分钟)之后，如果至少有10000个key发生变化，Redis就会自动触发bgsave命令创建快照。

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="rdb-创建快照时会阻塞主线程吗" tabindex="-1"><a class="header-anchor" href="#rdb-创建快照时会阻塞主线程吗" aria-hidden="true">#</a> RDB 创建快照时会阻塞主线程吗？</h3><p>Redis 提供了两个命令来生成 RDB 快照文件：</p><ul><li><code>save</code> : 同步保存操作，会阻塞 Redis 主线程；</li><li><code>bgsave</code> : fork 出一个子进程，子进程执行，不会阻塞 Redis 主线程，默认选项。</li></ul><h3 id="什么是-aof-持久化" tabindex="-1"><a class="header-anchor" href="#什么是-aof-持久化" aria-hidden="true">#</a> 什么是 AOF 持久化？</h3><p>与快照持久化相比，AOF 持久化的实时性更好。默认情况下 Redis 没有开启 AOF（append only file）方式的持久化（Redis 6.0 之后已经默认是开启了），可以通过 <code>appendonly</code> 参数开启：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>appendonly yes
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>开启 AOF 持久化后每执行一条会更改 Redis 中的数据的命令，Redis 就会将该命令写入到 AOF 缓冲区 <code>server.aof_buf</code> 中，然后再写入到 AOF 文件中（此时还在系统内核缓存区为同步到磁盘），最后再根据持久化方式（ <code>fsync</code>策略）的配置来决定何时将系统内核缓存区的数据同步到硬盘中的。</p><p>只有同步到磁盘中才算持久化保存了，否则依然存在数据丢失的风险，比如说：系统内核缓存区的数据还未同步，磁盘机器就宕机了，那这部分数据就算丢失了。</p><p>AOF 文件的保存位置和 RDB 文件的位置相同，都是通过 <code>dir</code> 参数设置的，默认的文件名是 <code>appendonly.aof</code>。</p><h3 id="aof-工作基本流程是怎样的" tabindex="-1"><a class="header-anchor" href="#aof-工作基本流程是怎样的" aria-hidden="true">#</a> AOF 工作基本流程是怎样的？</h3><p>AOF 持久化功能的实现可以简单分为 5 步：</p><ol><li><strong>命令追加（append）</strong> ：所有的写命令会追加到 AOF 缓冲区中。</li><li><strong>文件写入（write）</strong> ：将 AOF 缓冲区的数据写入到 AOF 文件中。这一步需要调用<code>write</code>函数（系统调用），<code>write</code>将数据写入到了系统内核缓冲区之后直接返回了（延迟写）。注意！！！此时并没有同步到磁盘。</li><li><strong>文件同步（fsync）</strong> ：AOF 缓冲区根据对应的持久化方式（ <code>fsync</code> 策略）向硬盘做同步操作。这一步需要调用 <code>fsync</code> 函数（系统调用）， <code>fsync</code> 针对单个文件操作，对其进行强制硬盘同步，<code>fsync</code> 将阻塞直到写入磁盘完成后返回，保证了数据持久化。</li><li><strong>文件重写（rewrite）</strong> ：随着 AOF 文件越来越大，需要定期对 AOF 文件进行重写，达到压缩的目的。</li><li><strong>重启加载（load）</strong> ：当 Redis 重启时，可以加载 AOF 文件进行数据恢复。</li></ol><blockquote><p>Linux 系统直接提供了一些函数用于对文件和设备进行访问和控制，这些函数被称为 <strong>系统调用（syscall）</strong>。</p></blockquote><p>这里对上面提到的一些 Linux 系统调用再做一遍解释：</p><ul><li><code>write</code> ：写入系统内核缓冲区之后直接返回（仅仅是写到缓冲区），不会立即同步到硬盘。虽然提高了效率，但也带来了数据丢失的风险。同步硬盘操作通常依赖于系统调度机制，Linux 内核通常为 30s 同步一次，具体值取决于写出的数据量和 I/O 缓冲区的状态。</li><li><code>fsync</code> ： <code>fsync</code>用于强制刷新系统内核缓冲区（同步到到磁盘），确保写磁盘操作结束才会返回。</li></ul><p>AOF 工作流程图如下：</p><figure><img src="https://oss.javaguide.cn/github/javaguide/database/redis/aof-work-process.png" alt="AOF 工作基本流程" tabindex="0" loading="lazy"><figcaption>AOF 工作基本流程</figcaption></figure><h4 id="删除与淘汰策略" tabindex="-1"><a class="header-anchor" href="#删除与淘汰策略" aria-hidden="true">#</a> 删除与淘汰策略</h4><h5 id="过期的数据的删除策略了解么" tabindex="-1"><a class="header-anchor" href="#过期的数据的删除策略了解么" aria-hidden="true">#</a> 过期的数据的删除策略了解么？</h5><p>如果假设你设置了一批 key 只能存活 1 分钟，那么 1 分钟后，Redis 是怎么对这批 key 进行删除的呢？</p><p>常用的过期数据的删除策略就两个（重要！自己造缓存轮子的时候需要格外考虑的东西）：</p><ol><li><strong>惰性删除</strong> ：只会在取出 key 的时候才对数据进行过期检查。这样对 CPU 最友好，但是可能会造成太多过期 key 没有被删除。</li><li><strong>定期删除</strong> ： 每隔一段时间抽取一批 key 执行删除过期 key 操作。并且，Redis 底层会通过限制删除操作执行的时长和频率来减少删除操作对 CPU 时间的影响。</li></ol><p>定期删除对内存更加友好，惰性删除对 CPU 更加友好。两者各有千秋，所以 Redis 采用的是 <strong>定期删除+惰性/懒汉式删除</strong> 。</p><p>但是，仅仅通过给 key 设置过期时间还是有问题的。因为还是可能存在定期删除和惰性删除漏掉了很多过期 key 的情况。这样就导致大量过期 key 堆积在内存里，然后就 Out of memory 了。</p><p>怎么解决这个问题呢？答案就是：<strong>Redis 内存淘汰机制。</strong></p><h5 id="redis-内存淘汰机制了解么" tabindex="-1"><a class="header-anchor" href="#redis-内存淘汰机制了解么" aria-hidden="true">#</a> Redis 内存淘汰机制了解么？</h5><blockquote><p>相关问题：MySQL 里有 2000w 数据，Redis 中只存 20w 的数据，如何保证 Redis 中的数据都是热点数据?</p></blockquote><p>Redis 提供 6 种数据淘汰策略：</p><ol><li><strong>volatile-lru（least recently used）</strong>：从已设置过期时间的数据集（<code>server.db[i].expires</code>）中挑选最近最少使用的数据淘汰。</li><li><strong>volatile-ttl</strong>：从已设置过期时间的数据集（<code>server.db[i].expires</code>）中挑选将要过期的数据淘汰。</li><li><strong>volatile-random</strong>：从已设置过期时间的数据集（<code>server.db[i].expires</code>）中任意选择数据淘汰。</li><li><strong>allkeys-lru（least recently used）</strong>：当内存不足以容纳新写入数据时，在键空间中，移除最近最少使用的 key（这个是最常用的）。</li><li><strong>allkeys-random</strong>：从数据集（<code>server.db[i].dict</code>）中任意选择数据淘汰。</li><li><strong>no-eviction</strong>：禁止驱逐数据，也就是说当内存不足以容纳新写入数据时，新写入操作会报错。这个应该没人使用吧！</li></ol><p>4.0 版本后增加以下两种：</p><ol><li><strong>volatile-lfu（least frequently used）</strong>：从已设置过期时间的数据集（<code>server.db[i].expires</code>）中挑选最不经常使用的数据淘汰。</li><li><strong>allkeys-lfu（least frequently used）</strong>：当内存不足以容纳新写入数据时，在键空间中，移除最不经常使用的 key。</li></ol><h4 id="主从复制" tabindex="-1"><a class="header-anchor" href="#主从复制" aria-hidden="true">#</a> 主从复制</h4><h4 id="哨兵" tabindex="-1"><a class="header-anchor" href="#哨兵" aria-hidden="true">#</a> 哨兵</h4><h4 id="缓存雪崩-击穿-穿透" tabindex="-1"><a class="header-anchor" href="#缓存雪崩-击穿-穿透" aria-hidden="true">#</a> 缓存雪崩/击穿/穿透</h4><h5 id="什么是缓存穿透" tabindex="-1"><a class="header-anchor" href="#什么是缓存穿透" aria-hidden="true">#</a> 什么是缓存穿透？</h5><p>缓存穿透说简单点就是大量请求的 key 是不合理的，<strong>根本不存在于缓存中，也不存在于数据库中</strong> 。这就导致这些请求直接到了数据库上，根本没有经过缓存这一层，对数据库造成了巨大的压力，可能直接就被这么多请求弄宕机了。</p><h5 id="有哪些解决办法" tabindex="-1"><a class="header-anchor" href="#有哪些解决办法" aria-hidden="true">#</a> 有哪些解决办法？</h5><p>最基本的就是首先做好参数校验，一些不合法的参数请求直接抛出异常信息返回给客户端。比如查询的数据库 id 不能小于 0、传入的邮箱格式不对的时候直接返回错误消息给客户端等等。</p><p><strong>1）缓存无效 key</strong></p><p>如果缓存和数据库都查不到某个 key 的数据就写一个到 Redis 中去并设置过期时间，具体命令如下： <code>SET key value EX 10086</code> 。这种方式可以解决请求的 key 变化不频繁的情况，如果黑客恶意攻击，每次构建不同的请求 key，会导致 Redis 中缓存大量无效的 key 。很明显，这种方案并不能从根本上解决此问题。如果非要用这种方式来解决穿透问题的话，尽量将无效的 key 的过期时间设置短一点比如 1 分钟。</p><p><strong>2）布隆过滤器</strong></p><p>布隆过滤器是一个非常神奇的数据结构，通过它我们可以非常方便地判断一个给定数据是否存在于海量数据中。我们需要的就是判断 key 是否合法，有没有感觉布隆过滤器就是我们想要找的那个“人”。</p><p>具体是这样做的：把所有可能存在的请求的值都存放在布隆过滤器中，当用户请求过来，先判断用户发来的请求的值是否存在于布隆过滤器中。不存在的话，直接返回请求参数错误信息给客户端，存在的话才会走下面的流程。</p><p>但是，需要注意的是布隆过滤器可能会存在误判的情况。总结来说就是： <strong>布隆过滤器说某个元素存在，小概率会误判。布隆过滤器说某个元素不在，那么这个元素一定不在。</strong></p><p><em>为什么会出现误判的情况呢? 我们还要从布隆过滤器的原理来说！</em></p><p>我们先来看一下，<strong>当一个元素加入布隆过滤器中的时候，会进行哪些操作：</strong></p><ol><li>使用布隆过滤器中的哈希函数对元素值进行计算，得到哈希值（有几个哈希函数得到几个哈希值）。</li><li>根据得到的哈希值，在位数组中把对应下标的值置为 1。</li></ol><p>我们再来看一下，<strong>当我们需要判断一个元素是否存在于布隆过滤器的时候，会进行哪些操作：</strong></p><ol><li>对给定元素再次进行相同的哈希计算；</li><li>得到值之后判断位数组中的每个元素是否都为 1，如果值都为 1，那么说明这个值在布隆过滤器中，如果存在一个值不为 1，说明该元素不在布隆过滤器中。</li></ol><p>然后，一定会出现这样一种情况：<strong>不同的字符串可能哈希出来的位置相同。</strong> （可以适当增加位数组大小或者调整我们的哈希函数来降低概率）</p><h5 id="什么是缓存击穿" tabindex="-1"><a class="header-anchor" href="#什么是缓存击穿" aria-hidden="true">#</a> 什么是缓存击穿？</h5><p>缓存击穿中，请求的 key 对应的是 <strong>热点数据</strong> ，该数据 <strong>存在于数据库中，但不存在于缓存中（通常是因为缓存中的那份数据已经过期）</strong> 。这就可能会导致瞬时大量的请求直接打到了数据库上，对数据库造成了巨大的压力，可能直接就被这么多请求弄宕机了。</p><h5 id="有哪些解决办法-1" tabindex="-1"><a class="header-anchor" href="#有哪些解决办法-1" aria-hidden="true">#</a> 有哪些解决办法？</h5><ul><li>设置热点数据永不过期或者过期时间比较长。</li><li>针对热点数据提前预热，将其存入缓存中并设置合理的过期时间比如秒杀场景下的数据在秒杀结束之前不过期。</li><li>请求数据库写数据到缓存之前，先获取互斥锁，保证只有一个请求会落到数据库上，减少数据库的压力。</li></ul><h5 id="缓存穿透和缓存击穿有什么区别" tabindex="-1"><a class="header-anchor" href="#缓存穿透和缓存击穿有什么区别" aria-hidden="true">#</a> 缓存穿透和缓存击穿有什么区别？</h5><p>缓存穿透中，请求的 key 既不存在于缓存中，也不存在于数据库中。</p><p>缓存击穿中，请求的 key 对应的是 <strong>热点数据</strong> ，该数据 <strong>存在于数据库中，但不存在于缓存中（通常是因为缓存中的那份数据已经过期）</strong> 。</p><h5 id="什么是缓存雪崩" tabindex="-1"><a class="header-anchor" href="#什么是缓存雪崩" aria-hidden="true">#</a> 什么是缓存雪崩？</h5><p>我发现缓存雪崩这名字起的有点意思，哈哈。</p><p>实际上，缓存雪崩描述的就是这样一个简单的场景：<strong>缓存在同一时间大面积的失效，导致大量的请求都直接落到了数据库上，对数据库造成了巨大的压力。</strong> 这就好比雪崩一样，摧枯拉朽之势，数据库的压力可想而知，可能直接就被这么多请求弄宕机了。</p><p>另外，缓存服务宕机也会导致缓存雪崩现象，导致所有的请求都落到了数据库上。</p><h5 id="有哪些解决办法-2" tabindex="-1"><a class="header-anchor" href="#有哪些解决办法-2" aria-hidden="true">#</a> 有哪些解决办法？</h5><p><strong>针对 Redis 服务不可用的情况：</strong></p><ol><li>采用 Redis 集群，避免单机出现问题整个缓存服务都没办法使用。</li><li>限流，避免同时处理大量的请求。</li></ol><p><strong>针对热点缓存失效的情况：</strong></p><ol><li>设置不同的失效时间比如随机设置缓存的失效时间。</li><li>缓存永不失效（不太推荐，实用性太差）。</li><li>设置二级缓存。</li></ol><h5 id="缓存雪崩和缓存击穿有什么区别" tabindex="-1"><a class="header-anchor" href="#缓存雪崩和缓存击穿有什么区别" aria-hidden="true">#</a> 缓存雪崩和缓存击穿有什么区别？</h5><p>缓存雪崩和缓存击穿比较像，但缓存雪崩导致的原因是缓存中的大量或者所有数据失效，缓存击穿导致的原因主要是某个热点数据不存在与缓存中（通常是因为缓存中的那份数据已经过期）。</p><h4 id="redis-6-0-多线程的实现机制" tabindex="-1"><a class="header-anchor" href="#redis-6-0-多线程的实现机制" aria-hidden="true">#</a> redis 6.0 多线程的实现机制：</h4>`,118),c={href:"https://blog.csdn.net/zhizhengguan/article/details/120627481",target:"_blank",rel:"noopener noreferrer"};function p(g,u){const i=d("ExternalLinkIcon");return r(),s("div",null,[h,e("p",null,[e("a",c,[n("https://blog.csdn.net/zhizhengguan/article/details/120627481"),o(i)])])])}const x=a(l,[["render",p],["__file","Redis.html.vue"]]);export{x as default};

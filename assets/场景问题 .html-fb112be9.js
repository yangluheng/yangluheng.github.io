import{_ as d}from"./plugin-vue_export-helper-c27b6911.js";import{r as n,o as h,c as t,d as e,e as a,b as c,f as r}from"./app-e5b0ad63.js";const o={},s=r(`<h3 id="缓存一致性解决" tabindex="-1"><a class="header-anchor" href="#缓存一致性解决" aria-hidden="true">#</a> 缓存一致性解决</h3><h3 id="_4g数据找系统记录-大数据题" tabindex="-1"><a class="header-anchor" href="#_4g数据找系统记录-大数据题" aria-hidden="true">#</a> 4G数据找系统记录(大数据题)</h3><h3 id="很多短任务线程-选择-synchronized-还是-lock-2022-04-11-携程" tabindex="-1"><a class="header-anchor" href="#很多短任务线程-选择-synchronized-还是-lock-2022-04-11-携程" aria-hidden="true">#</a> 很多短任务线程，选择 synchronized 还是 lock（2022-04-11 携程）</h3><p>锁竞争小时，synchronized和lock效率没差，偏向模式下（单线程读写）甚至高于lock，但是并发量上升时锁撤销会大幅影响性能，稳定自适应轻量级锁状态下，线程接近交替运行，或者说短任务线程多，基本一样，因为都是自旋，大量任务并发竞争时，随着任务量的增大，synchronized的效率会远小于lock，因为重量级锁会频繁切换内核态与用户态；大量长任务，只能重量级锁。</p><h3 id="多个人给一个主播打赏怎么设计-2022-6-3-58同城" tabindex="-1"><a class="header-anchor" href="#多个人给一个主播打赏怎么设计-2022-6-3-58同城" aria-hidden="true">#</a> 多个人给一个主播打赏怎么设计？（2022-6-3 58同城）</h3><p>我说是一个高并发写的操作，对一个记录频繁写，分批操作，比如 10 个记录 操作一次。他说这个方案可以 但是有 100 个记录 怎么去做一个一个操作呢？我说如果在一个进程可以 分多个线程分批。他说还是不够快 我们是用的 MQ 多个消费者 一个打赏就发一个消息</p><h3 id="怎么实现一个点赞功能" tabindex="-1"><a class="header-anchor" href="#怎么实现一个点赞功能" aria-hidden="true">#</a> 怎么实现一个点赞功能？</h3><p>主要的流程解释下：先查询数据库改用户是否进行点赞，如果已经点赞则抛出异常，如果没有则new一个对象来一个一个Set，然后将已点赞的信息存入redis中，相反，取消点赞的操作就是删除redis中的数据即可，然后通过Dubbo调用API来完成保存操作，因为我这里是还要获取点赞数和评论数啥的，所以会对动态表进行更新操作。</p><h3 id="比如下单清空购物车-你是如何设计的" tabindex="-1"><a class="header-anchor" href="#比如下单清空购物车-你是如何设计的" aria-hidden="true">#</a> 比如下单清空购物车，你是如何设计的？</h3><ol><li>生产者（订单系统）产生消息，发送一条半事务消息到MQ服务器</li><li>MQ收到消息后，将消息持久化到存储系统，这条消息的状态是待发送状态。</li><li>MQ服务器返回ACK确认到生产者，此时MQ不会触发消息推送事件</li><li>生产者执行本地事务（订单创建成功，提交事务消息）</li><li>如果本地事务执行成功，即commit执行结果到MQ服务器；如果执行失败，发送rollback。</li><li>如果是commit正常提交，MQ服务器更新消息状态为<strong>可发送</strong>；如果是rollback，即<strong>删除消息</strong>。</li><li>如果消息状态更新为可发送，则MQ服务器会push消息给消费者（购物车系统）。消费者消费完（即拿到订单消息，清空购物车成功）就应答ACK。</li><li>如果MQ服务器长时间没有收到生产者的commit或者rollback，它会反查生产者，然后根据查询到的结果（回滚操作或者重新发送消息）执行最终状态。</li></ol><p>有些伙伴可能有疑惑，如果消费者消费失败怎么办呢？那数据是不是不一致啦？所以就需要消费者消费成功，执行业务逻辑成功，再反馈ack嘛。如果消费者消费失败，那就自动重试嘛，接口支持幂等即可。</p><h3 id="排行榜的实现-比如高考成绩排序-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#排行榜的实现-比如高考成绩排序-2022-虾皮" aria-hidden="true">#</a> 排行榜的实现，比如高考成绩排序（2022 虾皮）</h3><p>排行版的实现，一般使用redis的<strong>zset</strong>数据类型。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>zadd key score member [score member ...]，zrank key member
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="有一批帖子-会根据类别搜索-但是现在是单独一个表-现在查询非常慢-如何提高搜索性能-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#有一批帖子-会根据类别搜索-但是现在是单独一个表-现在查询非常慢-如何提高搜索性能-2022-虾皮" aria-hidden="true">#</a> 有一批帖子，会根据类别搜索，但是现在是单独一个表，现在查询非常慢，如何提高搜索性能？（2022 虾皮）</h3><p>根据类别分库分表，库可以放到不同的实例上，经常查询的不变的数据]可以放到缓存里。 数据有更新时，需要刷新下缓存 因为分表后，只能是固定类别，所以需要根据类别去分开查找。 如果还有另一个重要的字段也需要查，可以再建一个分表，user-ses/ses-user就是这么做的，但是冗余就比较大。</p><h3 id="如果有多个表-进行聚合查询-如何解决深分页的问题-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#如果有多个表-进行聚合查询-如何解决深分页的问题-2022-虾皮" aria-hidden="true">#</a> 如果有多个表，进行聚合查询，如何解决深分页的问题（2022 虾皮）</h3><p>就是保存每个节点的表id给前端，前端查询时把id返回过来了，然后加到SQL里，但是不一定准。这里回答的是单个表吧。</p><h3 id="分表的数据-动态增加一张表-不停服如何实现-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#分表的数据-动态增加一张表-不停服如何实现-2022-虾皮" aria-hidden="true">#</a> 分表的数据，动态增加一张表，不停服如何实现？（2022 虾皮）</h3><p>分区策略使用一致性哈希 然后新表的数据，查询的时候，先查老的，再插入新的。如果老数据没有动，需要有对应的迁移服务进行定时迁移。插入的时候优先插入到新的表。</p><h3 id="迁移线程和用户线程同时执行-会有数据库不一致的问题-怎么解决-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#迁移线程和用户线程同时执行-会有数据库不一致的问题-怎么解决-2022-虾皮" aria-hidden="true">#</a> 迁移线程和用户线程同时执行，会有数据库不一致的问题，怎么解决？（2022 虾皮）</h3><p>加分布式锁。</p><h3 id="两个机房-某个机房可能断电-如何做多机房容灾-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#两个机房-某个机房可能断电-如何做多机房容灾-2022-虾皮" aria-hidden="true">#</a> 两个机房，某个机房可能断电，如何做多机房容灾（2022 虾皮）</h3><p>负载均衡层，支持切换机房写数据的时候，中间件（db/redis/es）都要进行双写。</p>`,24),l={href:"https://cloud.tencent.com/developer/article/1358933",target:"_blank",rel:"noopener noreferrer"},p=r('<h3 id="主从机房同步有什么问题呢-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#主从机房同步有什么问题呢-2022-虾皮" aria-hidden="true">#</a> 主从机房同步有什么问题呢？ （2022 虾皮）</h3><blockquote><p>会有比较大的延迟。 一些分布式的问题，例如分布式事务，可能就执行了几步，然后就挂了，需要有一定的策略，进行回滚或者提交。 切换机房的过程中，可能存在数据丢失，重复数据等</p></blockquote><ul><li>双向同步，两个机房都能写入，如果操作的是各自的数据的话，问题不大。如果操作的是相同数据，必然会有冲突，需要解决。所以上层保证相同数据到同一个机房即可，然后同步到另外一个机房，保证每个机房都有全量的数据。各种中间件都要做改造。</li><li>总之，分片的核心思路在于，让同一个用户的相关请求，只在一个机房内完成所有业务「闭环」，不再出现「跨机房」访问。</li><li>阿里在实施这种方案时，给它起了个名字，叫做「单元化」。</li><li>这里还有一种情况，是无法做数据分片的：全局数据。例如系统配置、商品库存这类需要强一致的数据，这类服务依旧只能采用写主机房，读从机房的方案，不做双活。</li><li>双活的重点，是要优先保证「核心」业务先实现双活，并不是「全部」业务实现双活。</li></ul><h3 id="冷机房新请求过来-发现缓存没有-会把数据库打挂-这个怎么解决-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#冷机房新请求过来-发现缓存没有-会把数据库打挂-这个怎么解决-2022-虾皮" aria-hidden="true">#</a> 冷机房新请求过来，发现缓存没有，会把数据库打挂，这个怎么解决？（2022 虾皮）</h3><p>预热，提前加载到缓存。 或者平时保持一定的流量。 用了缓存的，一般需要预热下，防止雪崩。</p><h3 id="定时任务这种-怎么改变执行的机房-2022-虾皮" tabindex="-1"><a class="header-anchor" href="#定时任务这种-怎么改变执行的机房-2022-虾皮" aria-hidden="true">#</a> 定时任务这种，怎么改变执行的机房（2022 虾皮）</h3><p>加开关，任何时候都有一个条件不满足，在空跑。</p>',7);function u(b,m){const i=n("ExternalLinkIcon");return h(),t("div",null,[s,e("p",null,[a("kafka容灾，mirror maker: "),e("a",l,[a("https://cloud.tencent.com/developer/article/1358933"),c(i)])]),p])}const x=d(o,[["render",u],["__file","场景问题 .html.vue"]]);export{x as default};

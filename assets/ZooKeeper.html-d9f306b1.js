import{_ as c}from"./plugin-vue_export-helper-c27b6911.js";import{r as a,o as t,c as s,a as e,e as o,d as n,f as r}from"./app-6de35cd4.js";const i={},l=r('<h2 id="_1-基本功能" tabindex="-1"><a class="header-anchor" href="#_1-基本功能" aria-hidden="true">#</a> 1.基本功能</h2><p>ZooKeeper 是一个开源的<strong>分布式协调服务</strong>，它的设计目标是将那些复杂且容易出错的分布式一致性服务封装起来，构成一个高效可靠的原语集，并以一系列简单易用的接口提供给用户使用。</p><p>ZooKeeper 为我们提供了高可用、高性能、稳定的分布式数据一致性解决方案，通常被用于实现诸如数据发布/订阅、负载均衡、命名服务、分布式协调/通知、集群管理、Master 选举、分布式锁和分布式队列等功能。这些功能的实现主要依赖于 ZooKeeper 提供的 <strong>数据存储+事件监听</strong> 功能。</p><p>ZooKeeper 将数据保存在内存中，性能是不错的。 在“读”多于“写”的应用程序中尤其地高性能，因为“写”会导致所有的服务器间同步状态。（“读”多于“写”是协调服务的典型场景）。</p><p>另外，很多顶级的开源项目都用到了 ZooKeeper，比如：</p><ul><li><strong>Kafka</strong> : ZooKeeper 主要为 Kafka 提供 Broker 和 Topic 的注册以及多个 Partition 的负载均衡等功能。不过，在 Kafka 2.8 之后，引入了基于 Raft 协议的 KRaft 模式，不再依赖 Zookeeper，大大简化了 Kafka 的架构。</li><li>Kafka严重依赖于ZooKeeper集群。所有的broker在启动的时候都会往zookeeper进行注册，目的就是选举出一个controller，controller会读取注册上来的从节点的数据（通过监听机制），生成集群的元数据信息，之后把这些信息都分发给其他的服务器，让其他服务器能感知到集群中其它成员的存在 。通过这个方法让整个集群都得知这个分区方案，此时从节点就各自创建好目录等待创建分区副本即可。这也是整个集群的管理机制。</li></ul><p><strong>kafka已经取消了依赖zookeeper</strong>：</p><p><strong>最新版的<code>Kafka 2.8.0</code>，移除了对<code>Zookeeper</code>的依赖，通过<code>KRaft</code>进行自己的集群管理。</strong></p><p>Kafka作为一个消息队列，竟然要依赖一个重量级的协调系统ZooKeeper，不得不说是一个笑话。同样作为消息队列，人家RabbitMQ早早的就实现了自我管理。</p><p>Zookeeper非常笨重，还要求奇数个节点的集群配置，扩容和缩容也不方便。Zk的配置方式，也和kafka的完全不一样，要按照调优Kafka，竟然还要兼顾另外一个系统。</p><p>Kafka要想往轻量级，开箱即用的方向发展，就不得不干掉Zk。</p><h2 id="_2-paxos协议" tabindex="-1"><a class="header-anchor" href="#_2-paxos协议" aria-hidden="true">#</a> 2.Paxos协议</h2><h2 id="_3-raft协议" tabindex="-1"><a class="header-anchor" href="#_3-raft协议" aria-hidden="true">#</a> 3.Raft协议</h2><h3 id="_3-1什么是分布式一致性" tabindex="-1"><a class="header-anchor" href="#_3-1什么是分布式一致性" aria-hidden="true">#</a> 3.1什么是分布式一致性 ？</h3><p>分布式系统通常由异步网络连接的多个节点构成，每个节点有独立的计算和存储，节点之间通过网络通信进行协作。分布式一致性指多个节点对某一变量的取值达成一致，一旦达成一致，则变量的本次取值即被确定。</p><p>在大量客户端并发请求读/写的情况下，维护数据多副本的一致性无疑非常重要，且富有挑战。因此，分布式一致性在我们生产环境中显得尤为重要。</p><p>总结来讲，分布式一致性就是为了解决以下两个问题：</p><ul><li><strong>数据不能存在单个节点（主机）上，否则可能出现单点故障。</strong></li><li><strong>多个节点（主机）需要保证具有相同的数据。</strong></li></ul><h3 id="_3-2常见分布式一致性算法" tabindex="-1"><a class="header-anchor" href="#_3-2常见分布式一致性算法" aria-hidden="true">#</a> 3.2常见分布式一致性算法</h3><p>常见的一致性算法包括Paxos算法，Raft算法，ZAB算法等，</p><ul><li>Paxos算法是Lamport宗师提出的一种基于消息传递的分布式一致性算法，使其获得2013年图灵奖。自Paxos问世以来就持续垄断了分布式一致性算法，Paxos这个名词几乎等同于分布式一致性, 很多分布式一致性算法都由Paxos演变而来。</li><li>Paxos是出了名的难懂，而Raft正是为了探索一种更易于理解的一致性算法而产生的。它的首要设计目的就是易于理解，所以在选主的冲突处理等方式上它都选择了非常简单明了的解决方案。</li><li>ZAB 协议全称：Zookeeper Atomic Broadcast（Zookeeper 原子广播协议）, 它应该是所有一致性协议中生产环境中应用最多的了。为什么呢？因为他是为 Zookeeper 设计的分布式一致性协议！</li></ul><h3 id="_3-3raft算法基础" tabindex="-1"><a class="header-anchor" href="#_3-3raft算法基础" aria-hidden="true">#</a> 3.3Raft算法基础</h3><p>Raft算法和其他分布式一致算法一样，内部采用如下图所示的<strong>复制状态机模型</strong>，在这个模型中，会利用多台服务器构成一个集群，工作流程如下图所示：</p><figure><img src="http://www.img.youngxy.top/Java/fig/raft1.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Raft算法在具体实现中，将分布式一致性问题分解为了<strong>Leader选举</strong>、<strong>日志同步</strong>和<strong>安全性保证</strong>三大子问题。</p><p>Raft 正常工作时的流程如下图，也就是正常情况下日志复制的流程。Raft 中使用日志来记录所有操作，所有结点都有自己的日志列表来记录所有请求。算法将机器分成三种角色：<strong>Leader</strong>、<strong>Follower</strong> 和 <strong>Candidate</strong>。正常情况下只存在一个 Leader，其他均为 Follower，所有客户端都与 Leader 进行交互。</p><figure><img src="http://www.img.youngxy.top/Java/fig/raft2.gif" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>所有操作采用类似<strong>两阶段提交</strong>的方式，Leader 在收到来自客户端的请求后并不会执行，只是将其写入自己的日志列表中，然后将该操作发送给所有的 Follower。Follower 在收到请求后也只是写入自己的日志列表中然后回复 Leader，当有超过半数的结点写入后 Leader 才会提交该操作并返回给客户端，同时通知所有其他结点提交该操作。</p><p>通过这一流程保证了只要提交过后的操作一定在多数结点上留有记录（在日志列表中），从而保证了该数据不会丢失。</p><blockquote><p>Raft 是一个非拜占庭的一致性算法，即所有通信是正确的而非伪造的。<strong>N个结点的情况下（N为奇数）可以最多容忍(N-1)/2个结点故障</strong>。如果更多的节点故障，后续的Leader选举和日志同步将无法进行。</p></blockquote>',30),p={href:"https://juejin.cn/post/7218915344130359351",target:"_blank",rel:"noopener noreferrer"},g=r('<h2 id="_3-zab协议" tabindex="-1"><a class="header-anchor" href="#_3-zab协议" aria-hidden="true">#</a> 3.ZAB协议</h2><h3 id="_3-1zab-协议介绍" tabindex="-1"><a class="header-anchor" href="#_3-1zab-协议介绍" aria-hidden="true">#</a> 3.1ZAB 协议介绍</h3><p>ZAB（ZooKeeper Atomic Broadcast 原子广播） 协议是为分布式协调服务 ZooKeeper 专门设计的一种支持崩溃恢复的原子广播协议。 在 ZooKeeper 中，主要依赖 ZAB 协议来实现分布式数据一致性，基于该协议，ZooKeeper 实现了一种主备模式的系统架构来保持集群中各个副本之间的数据一致性。这里的主备系统架构模型，就是指只有一台客户端（Leader）负责处理外部的写事务请求，然后Leader客户端将数据同步到其他Follower节点。</p><p>客户端的读取流程：客户端会随机的链接到 zookeeper 集群中的一个节点，如果是读请求，就直接从当前节点中读取数据；如果是写请求，那么节点就会向 Leader 提交事务，Leader 接收到事务提交，会广播该事务，只要超过半数节点写入成功，该事务就会被提交。</p><p><strong>ZAB 协议两种基本的模式：崩溃恢复和消息广播</strong>：</p><ul><li><p><strong>崩溃恢复</strong> ：当整个服务框架在启动过程中，或是当 Leader 服务器出现网络中断、崩溃退出与重启等异常情况时，ZAB 协议就会进入恢复模式并选举产生新的 Leader 服务器。当选举产生了新的 Leader 服务器，同时集群中已经有过半的机器与该 Leader 服务器完成了状态同步之后，ZAB 协议就会退出恢复模式。其中，<strong>所谓的状态同步是指数据同步，用来保证集群中存在过半的机器能够和 Leader 服务器的数据状态保持一致</strong>。说白了就是 <code>ZAB</code> 协议是如何处理写请求的。那么 <code>Follower</code> 和 <code>Observer</code> 也需要 <strong>同步更新数据</strong> 。</p><p>第一步 <code>Leader</code> 将写请求 <strong>广播</strong> 出去，让 <code>Leader</code> 问问 <code>Followers</code> 是否同意更新，如果超过半数以上的同意那么就进行 <code>Follower</code> 和 <code>Observer</code> 的更新。</p><p>在 <code>Leader</code> 这端，它为每个其他的 <code>zkServer</code> 准备了一个 <strong>队列</strong> ，采用先进先出的方式发送消息。由于协议是 <strong>通过 <code>TCP</code></strong> 来进行网络通信的，保证了消息的发送顺序性，接受顺序性也得到了保证。</p><p>除此之外，在 <code>ZAB</code> 中还定义了一个 <strong>全局单调递增的事务ID <code>ZXID</code></strong> ，它是一个64位long型，其中高32位表示 <code>epoch</code> 年代，低32位表示事务id。<code>epoch</code> 是会根据 <code>Leader</code> 的变化而变化的，当一个 <code>Leader</code> 挂了，新的 <code>Leader</code> 上位的时候，年代（<code>epoch</code>）就变了。而低32位可以简单理解为递增的事务id。</p></li><li><p><strong>消息广播</strong> ：<strong>当集群中已经有过半的 Follower 服务器完成了和 Leader 服务器的状态同步，那么整个服务框架就可以进入消息广播模式了。</strong> 当一台同样遵守 ZAB 协议的服务器启动后加入到集群中时，如果此时集群中已经存在一个 Leader 服务器在负责进行消息广播，那么新加入的服务器就会自觉地进入数据恢复模式：找到 Leader 所在的服务器，并与其进行数据同步，然后一起参与到消息广播流程中去。</p></li></ul><h3 id="_3-2消息广播" tabindex="-1"><a class="header-anchor" href="#_3-2消息广播" aria-hidden="true">#</a> 3.2消息广播</h3><blockquote><p>Zookeeper集群中，存在以下三种角色的节点： <strong>Leader</strong>：Zookeeper集群的核心角色，在集群启动或崩溃恢复中通过Follower参与选举产生，<strong>为客户端提供读写服务，并对事务请求进行处理</strong>。 <strong>Follower</strong>：Zookeeper集群的核心角色，在集群启动或崩溃恢复中参加选举，没有被选上就是这个角色，<strong>为客户端提供读取服务</strong>，也就是处理非事务请求，Follower不能处理事务请求，对于收到的事务请求会转发给Leader。 <strong>Observer</strong>：观察者角色，<strong>不参加选举，为客户端提供读取服务，处理非事务请求</strong>，对于收到的事务请求会转发给Leader。使用Observer的目的是为了扩展系统，提高读取性能。</p></blockquote><ol><li>Leader 接收到消息请求后，将消息赋予一个全局唯一的 64 位自增 id，叫做：zxid，通过 zxid 的大小比较即可实现因果有序这一特性。</li><li>Leader 通过先进先出队列（通过 TCP 协议来实现，以此实现了全局有序这一特性）将带有 zxid 的消息作为一个提案（proposal）分发给所有 follower。</li><li>当 follower 接收到 proposal，先将 proposal 写到硬盘，写硬盘成功后再向 leader 回一个 ACK。</li><li>当 leader 接收到合法数量的 ACKs 后，leader 就向所有 follower 发送 COMMIT 命令，同时会在本地执行该消息。</li><li>当 follower 收到消息的 COMMIT 命令时，就会执行该消息。</li></ol><figure><img src="http://www.img.youngxy.top/Java/fig/zab1.awebp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>相比于完整的二阶段提交，Zab 协议最大的区别就是不能终止事务，follower 要么回 ACK 给 leader，要么抛弃 leader，在某一时刻，leader 的状态与 follower 的状态很可能不一致，因此它不能处理 leader 挂掉的情况，所以 Zab 协议引入了恢复模式来处理这一问题。</p><p>从另一角度看，正因为 Zab 的广播过程不需要终止事务，也就是说不需要所有 follower 都返回 ACK 才能进行 COMMIT，而是只需要合法数量（2n+1 台服务器中的 n+1 台） 的follower，也提升了整体的性能。</p><blockquote><p>Leader 服务器与每一个 Follower 服务器之间都维护了一个单独的 FIFO 消息队列进行收发消息，使用队列消息可以做到异步解耦。 Leader 和 Follower 之间只需要往队列中发消息即可。如果使用同步的方式会引起阻塞，性能要下降很多。</p></blockquote><h3 id="_3-3崩溃恢复" tabindex="-1"><a class="header-anchor" href="#_3-3崩溃恢复" aria-hidden="true">#</a> 3.3崩溃恢复</h3><h4 id="_3-3-1选举-leader" tabindex="-1"><a class="header-anchor" href="#_3-3-1选举-leader" aria-hidden="true">#</a> 3.3.1选举 <code>Leader</code></h4><p>当系统出现崩溃影响最大应该是 <code>Leader</code> 的崩溃，因为我们只有一个 <code>Leader</code> ，所以当 <code>Leader</code> 出现问题的时候我们势必需要重新选举 <code>Leader</code> 。</p><p><code>Leader</code> 选举可以分为两个不同的阶段，第一个是我们提到的 <code>Leader</code> 宕机需要重新选举，第二则是当 <code>Zookeeper</code> 启动时需要进行系统的 <code>Leader</code> 初始化选举。下面我先来介绍一下 <code>ZAB</code> 是如何进行初始化选举的。</p><p>假设我们集群中有3台机器，那也就意味着我们需要两台以上同意（超过半数）。比如这个时候我们启动了 <code>server1</code> ，它会首先 <strong>投票给自己</strong> ，投票内容为服务器的 <code>myid</code> 和 <code>ZXID</code> ，因为初始化所以 <code>ZXID</code> 都为0，此时 <code>server1</code> 发出的投票为 (1,0)。但此时 <code>server1</code> 的投票仅为1，所以不能作为 <code>Leader</code> ，此时还在选举阶段所以整个集群处于 <strong><code>Looking</code> 状态</strong>。</p><p>接着 <code>server2</code> 启动了，它首先也会将投票选给自己(2,0)，并将投票信息广播出去（<code>server1</code>也会，只是它那时没有其他的服务器了），<code>server1</code> 在收到 <code>server2</code> 的投票信息后会将投票信息与自己的作比较。<strong>首先它会比较 <code>ZXID</code> ，<code>ZXID</code> 大的优先为 <code>Leader</code>，如果相同则比较 <code>myid</code>，<code>myid</code> 大的优先作为 <code>Leader</code></strong>。所以此时<code>server1</code> 发现 <code>server2</code> 更适合做 <code>Leader</code>，它就会将自己的投票信息更改为(2,0)然后再广播出去，之后<code>server2</code> 收到之后发现和自己的一样无需做更改，并且自己的 <strong>投票已经超过半数</strong> ，则 <strong>确定 <code>server2</code> 为 <code>Leader</code></strong>，<code>server1</code> 也会将自己服务器设置为 <code>Following</code> 变为 <code>Follower</code>。整个服务器就从 <code>Looking</code> 变为了正常状态。</p><p>当 <code>server3</code> 启动发现集群没有处于 <code>Looking</code> 状态时，它会直接以 <code>Follower</code> 的身份加入集群。</p><p>还是前面三个 <code>server</code> 的例子，如果在整个集群运行的过程中 <code>server2</code> 挂了，那么整个集群会如何重新选举 <code>Leader</code> 呢？其实和初始化选举差不多。</p><p>首先毫无疑问的是剩下的两个 <code>Follower</code> 会将自己的状态 <strong>从 <code>Following</code> 变为 <code>Looking</code> 状态</strong> ，然后每个 <code>server</code> 会向初始化投票一样首先给自己投票（这不过这里的 <code>zxid</code> 可能不是0了，这里为了方便随便取个数字）。</p><p>假设 <code>server1</code> 给自己投票为(1,99)，然后广播给其他 <code>server</code>，<code>server3</code> 首先也会给自己投票(3,95)，然后也广播给其他 <code>server</code>。<code>server1</code> 和 <code>server3</code> 此时会收到彼此的投票信息，和一开始选举一样，他们也会比较自己的投票和收到的投票（<code>zxid</code> 大的优先，如果相同那么就 <code>myid</code> 大的优先）。这个时候 <code>server1</code> 收到了 <code>server3</code> 的投票发现没自己的合适故不变，<code>server3</code> 收到 <code>server1</code> 的投票结果后发现比自己的合适于是更改投票为(1,99)然后广播出去，最后 <code>server1</code> 收到了发现自己的投票已经超过半数就把自己设为 <code>Leader</code>，<code>server3</code> 也随之变为 <code>Follower</code>。</p><blockquote><p>请注意 <code>ZooKeeper</code> 为什么要设置奇数个结点？比如这里我们是三个，挂了一个我们还能正常工作，挂了两个我们就不能正常工作了（已经没有超过半数的节点数了，所以无法进行投票等操作了）。而假设我们现在有四个，挂了一个也能工作，<strong>但是挂了两个也不能正常工作了</strong>，这是和三个一样的，而三个比四个还少一个，带来的效益是一样的，所以 <code>Zookeeper</code> 推荐奇数个 <code>server</code> 。</p></blockquote><h4 id="_3-3-2确保已经被leader提交的提案最终能够被所有的follower提交" tabindex="-1"><a class="header-anchor" href="#_3-3-2确保已经被leader提交的提案最终能够被所有的follower提交" aria-hidden="true">#</a> 3.3.2确保已经被Leader提交的提案最终能够被所有的Follower提交：</h4><p>假设 <code>Leader (server2)</code> 发送 <code>commit</code> 请求，他发送给了 <code>server3</code>，然后要发给 <code>server1</code> 的时候突然挂了。这个时候重新选举的时候我们如果把 <code>server1</code> 作为 <code>Leader</code> 的话，那么肯定会产生数据不一致性，因为 <code>server3</code> 肯定会提交刚刚 <code>server2</code> 发送的 <code>commit</code> 请求的提案，而 <code>server1</code> 根本没收到所以会丢弃。</p><figure><img src="http://www.img.youngxy.top/Java/fig/zk1.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>那怎么解决呢？</p><p><strong>这个时候 <code>server1</code> 已经不可能成为 <code>Leader</code> 了，因为 <code>server1</code> 和 <code>server3</code> 进行投票选举的时候会比较 <code>ZXID</code> ，而此时 <code>server3</code> 的 <code>**ZXID</code> 肯定比 <code>server1</code> 的大了。</strong></p><h4 id="_3-3-3跳过那些已经被丢弃的提案" tabindex="-1"><a class="header-anchor" href="#_3-3-3跳过那些已经被丢弃的提案" aria-hidden="true">#</a> 3.3.3跳过那些已经被丢弃的提案：</h4><p>假设 <code>Leader (server2)</code> 此时同意了提案N1，自身提交了这个事务并且要发送给所有 <code>Follower</code> 要 <code>commit</code> 的请求，却在这个时候挂了，此时肯定要重新进行 <code>Leader</code> 的选举，比如说此时选 <code>server1</code> 为 <code>Leader</code> 。但是过了一会，这个 <strong>挂掉的 <code>Leader</code> 又重新恢复了</strong> ，此时它肯定会作为 <code>Follower</code> 的身份进入集群中，需要注意的是刚刚 <code>server2</code> 已经同意提交了提案N1，但其他 <code>server</code> 并没有收到它的 <code>commit</code> 信息，所以其他 <code>server</code> 不可能再提交这个提案N1了，这样就会出现数据不一致性问题了，所以 <strong>该提案N1最终需要被抛弃掉</strong> 。</p><figure><img src="http://www.img.youngxy.top/Java/fig/zk2.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3-4zookeeper-架构" tabindex="-1"><a class="header-anchor" href="#_3-4zookeeper-架构" aria-hidden="true">#</a> 3.4Zookeeper 架构</h3><p>作为一个优秀高效且可靠的分布式协调框架，<code>ZooKeeper</code> 在解决分布式数据一致性问题时并没有直接使用 <code>Paxos</code> ，而是专门定制了一致性协议叫做 <code>ZAB(ZooKeeper Atomic Broadcast)</code> 原子广播协议，该协议能够很好地支持 <strong>崩溃恢复</strong> 。</p><p><strong>ZAB 中的三个角色</strong>：</p><p><code>ZAB</code> 中三个主要的角色，<code>Leader 领导者</code>、<code>Follower跟随者</code>、<code>Observer观察者</code> 。</p><ul><li><code>Leader</code> ：集群中 <strong>唯一的写请求处理者</strong> ，能够发起投票（投票也是为了进行写请求）。</li><li><code>Follower</code>：能够接收客户端的请求，如果是读请求则可以自己处理，<strong>如果是写请求则要转发给 <code>Leader</code></strong> 。在选举过程中会参与投票，<strong>有选举权和被选举权</strong> 。</li><li><code>Observer</code> ：就是没有选举权和被选举权的 <code>Follower</code> 。</li></ul><h2 id="_4-cap" tabindex="-1"><a class="header-anchor" href="#_4-cap" aria-hidden="true">#</a> 4.CAP</h2><h3 id="_4-1简介" tabindex="-1"><a class="header-anchor" href="#_4-1简介" aria-hidden="true">#</a> 4.1简介</h3><p><strong>CAP</strong> 也就是 <strong>Consistency（一致性）</strong>、<strong>Availability（可用性）</strong>、<strong>Partition Tolerance（分区容错性）</strong> 这三个单词首字母组合。</p><figure><img src="http://www.img.youngxy.top/Java/fig/zk3.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>在理论计算机科学中，CAP 定理指出对于一个分布式系统来说，当设计读写操作时，只能同时满足以下三点中的两个：</p><ul><li><strong>一致性（Consistency）</strong> : 所有节点访问同一份最新的数据副本</li><li><strong>可用性（Availability）</strong>: 非故障的节点在合理的时间内返回合理的响应（不是错误或者超时的响应）。</li><li><strong>分区容错性（Partition Tolerance）</strong> : 分布式系统出现网络分区的时候，仍然能够对外提供服务。</li></ul><p><strong>什么是网络分区？</strong></p><p>分布式系统中，多个节点之前的网络本来是连通的，但是因为某些故障（比如部分节点网络出了问题）某些节点之间不连通了，整个网络就分成了几块区域，这就叫 <strong>网络分区</strong>。</p><h3 id="_4-2不是所谓的-3-选-2" tabindex="-1"><a class="header-anchor" href="#_4-2不是所谓的-3-选-2" aria-hidden="true">#</a> 4.2不是所谓的“3 选 2”</h3><p>大部分人解释这一定律时，常常简单的表述为：“一致性、可用性、分区容忍性三者你只能同时达到其中两个，不可能同时达到”。实际上这是一个非常具有误导性质的说法，而且在 CAP 理论诞生 12 年之后，CAP 之父也在 2012 年重写了之前的论文。</p><blockquote><p><strong>当发生网络分区的时候，如果我们要继续服务，那么强一致性和可用性只能 2 选 1。也就是说当网络分区之后 P 是前提，决定了 P 之后才有 C 和 A 的选择。也就是说分区容错性（Partition tolerance）我们是必须要实现的。</strong></p><p>简而言之就是：CAP 理论中分区容错性 P 是一定要满足的，在此基础上，只能满足可用性 A 或者一致性 C。</p></blockquote><p>因此，<strong>分布式系统理论上不可能选择 CA 架构，只能选择 CP 或者 AP 架构。</strong> 比如 ZooKeeper 就是 CP 架构，Cassandra、Eureka 就是 AP 架构，Nacos 不仅支持 CP 架构也支持 AP 架构。</p><p><strong>为啥不可能选择 CA 架构呢？</strong> 举个例子：若系统出现“分区”，系统中的某个节点在进行写操作。为了保证 C， 必须要禁止其他节点的读写操作，这就和 A 发生冲突了。如果为了保证 A，其他节点的读写操作正常的话，那就和 C 发生冲突了。</p><p><strong>选择 CP 还是 AP 的关键在于当前的业务场景，没有定论，比如对于需要确保强一致性的场景如银行一般会选择保证 CP 。</strong></p><p>另外，需要补充说明的一点是： <strong>如果网络分区正常的话（系统在绝大部分时候所处的状态），也就说不需要保证 P 的时候，C 和 A 能够同时保证。</strong></p>',52);function h(f,u){const d=a("ExternalLinkIcon");return t(),s("div",null,[l,e("p",null,[o("参考："),e("a",p,[o("https://juejin.cn/post/7218915344130359351"),n(d)])]),g])}const k=c(i,[["render",h],["__file","ZooKeeper.html.vue"]]);export{k as default};
---
lang: zh-CN
title: Kafka
order: 1
description: 消息中间件
---

**消息队列是什么？**

消息队列是在消息的传输过程中保存消息的容器，简单点理解就是传递消息的队列，具备先进先出的特点，一般用于异步、解耦、流量削锋等问题，实现高性能、高可用、高扩展的架构。一个消息队列可以被一个或多个消费者消费，一般包含以下元素：

> Producer：消息生产者，负责产生和发送消息到 Broker。
> Broker：消息处理中心，负责消息存储、确认、重试等，一般其中会包含多个 Queue。
> Consumer：消息消费者，负责从 Broker 中获取消息，并进行相应处理。 

**消息队列应用场景**

常见的消息队列使用场景有 6 个：

> 应用解耦：消息队列减少了服务之间的耦合性，不同的服务可以通过消息队列进行通信，而不用关心彼此的实现细节。
> 异步处理：消息队列本身是异步的，它允许接收者在消息发送很长时间后再取回消息。
> 流量削锋：当上下游系统处理能力存在差距的时候，利用消息队列做一个通用的”载体”，在下游有能力处理的时候，再进行分发与处理。
> 日志处理：将消息队列用在日志处理中，比如 Kafka 的应用，解决大量日志传输的问题。
> 消息通讯：消息队列一般都内置了高效的通信机制，因此也可以用在纯消息通讯，比如实现聊天室等。
> 消息广播：如果没有消息队列，每当一个新业务方接入，都要接入一次新接口。有了消息队列，我们只需要关心消息是否送达了队列，至于谁订阅，是下游的事，无疑极大地减少了开发和联调的工作量。 

比较核心的有 3 个：解耦、异步、削峰，下面着重讲下：

**解耦**

假设在没有消息队列的情况下，现在有上游服务 A 用来发布消息，下游服务 B、C 用来接收服务 A 的消息。但随着业务需要，现在有服务 D、E、F 需要接收服务 A 的消息，那么就出现问题了，每次新加入服务都要改一次代码，可想而知这是极大的工作量。

![](http://www.img.youngxy.top/Java/fig/mq1.png)

如果引入消息队列，那就好办了，只需要下游服务自己订阅消息队列，而无需改动服务 A 的代码。

![](http://www.img.youngxy.top/Java/fig/mq2.png)

**异步**

先来看没有消息队列的场景下。

服务 A 的某个接口接收到请求，分别需要在服务A、服务B、服务C、服务D进行写库。假设用户发起请求到服务 A 耗时 10ms，自己写库需要 50ms，在服务 B 写库需要 250ms，在服务 C 写库需要 300ms，在服务 D 写库需要400ms，在没有消息队列的情况下，也就是同步操作，总耗时会是 10 + 50ms + 250ms + 300ms + 400ms = 1.01s。用户发送个请求，结果感觉有点卡顿，响应的非常慢，任谁都是很难忍受的。
![](http://www.img.youngxy.top/Java/fig/mq3.png)

如果使用了消息队列，那么服务 A 只需要把对服务A、B、C、D  进行写库的操作分别放进四个消息队列，假如用户发起请求到服务器耗时是10ms，发送消息到四个消息队列的耗时是10ms，那么总耗时就是 20 ms  。用户点击了按钮后立马返回，没有卡顿现象，体验效果就会有极大的提升了。

![](http://www.img.youngxy.top/Java/fig/mq4.png)

一般接口同步处理时间很长，不能通过水平扩容来解决，且业务场景允许异步，就可以使用异步解决，比如文件上传下载受限于用户的网络带宽因素，扩容也无用，以及上述同步操作耗时长等情况，都可以先放进消息队列，等服务再进行拉取消费。

**削峰**

在淘宝双十一活动日，特别是 0 点的秒杀活动高峰期时，接口流量会飙升，远远高于平时，就像一个山峰，没有做好处理的话，在高峰期数据库就可能被流量打死，从而导致整个服务奔溃。如果为了在高峰期能顶住流量而常备高流量设备，会有极大的成本浪费。如果是在要高峰期前进行临时服务扩容，很可能会出现许多扩容问题，没有那么简单。

使用消息队列的话，就可以将高峰期过多的流量请求放进消息队列，等高峰期过后，服务再慢慢进行处理，就不会出现峰值流量了，而是一个相对平稳的状态。

举个例子：

> 大量的用户在中午高峰期的时候，每秒有 4k 个请求，那么每秒就有 4k 个请求放到 MQ 里。
>
> 服务A 每秒只能处理 2k 个请求，因为 Mysql 每秒最多处理 2k 个请求。
>
> 服务A 就每秒从 MQ 拉取 2k 个请求进行处理，不会超过自己每秒能处理的最大请求量，所以高峰期服务 A 就不会挂掉。
>
> 对于MQ，每秒 4k 个请求进来，但是却只有 2k 个请求出去，导致在高峰期 1h 内可能有几十万的请求积压在 MQ 中。这个短暂的高峰期请求积压是可以接受的，因为过了这个时间点，每秒就 100 个请求进 MQ，但这时服务 A 还是会按照每秒 2k 的速度处理 MQ 积压的请求。
>
> 所以，高峰期一过，服务 A 就会快速的将 MQ 积压的消息处理掉。

![](http://www.img.youngxy.top/Java/fig/mq5.png)



**消息队列对比**

消息队列有 ActiveMQ、ZeroMQ、RabbitMQ、RocketMQ、Kafka，其中 ZeroMQ 太过轻量，主要用于学习，实际是不会应用到生产，所以主要对比 Kafka、RocketMQ、RabbitMQ、ActiveMQ 这四种 MQ。

![](http://www.img.youngxy.top/Java/fig/mq6.png)

![](http://www.img.youngxy.top/Java/fig/mq7.png)

Kafka 和 RocketMQ 都支持 10w 级别的高吞吐量。

Kafka 一开始的目的就是用于日志收集和传输，适合有大量数据产生的互联网业务，特别是大数据领域的实时计算、日志采集等场景，用 Kafka 绝对没错，社区活跃度高，业内标准。

RocketMQ 特别适用于金融互联网领域这类对于可靠性要求很高的场景，比如订单交易等，而且 RocketMQ 是阿里出品的，经历过那么多次淘宝双十一的考验，大品牌，在稳定性值得信赖。但如果阿里不再维护这个技术了，社区有可能突然黄掉的风险。因此如果公司对自己的技术实力有自信，基础架构研发实力较强，推荐用 RocketMQ。

RabbitMQ 适用于公司对外提供能力，可能会有很多主题接入的中台业务场景，毕竟它是百万级主题数的。它的时效性是毫秒级的，但实际毫秒级和微秒级在感知上没有什么太大的区别，所以它的这一大优点并不太会作为考量标准。同时，它的功能是比较完善的，开源社区活跃度高，能解决开发中遇到的bug，所以万级别数据量业务场景的小公司可以优先选择功能完善的RabbitMQ。它的缺点就是用 Erlang 语言编写，所以很多开发人员很难去看懂源码并进行二次开发和维护，也就是说对于公司来说可能处于不可控的状态。

ActiveMQ 现在很少有人用，没怎么经过大规模吞吐量场景的考验，社区不怎么活跃，官方社区现在对 ActiveMQ 5.x 维护也越来越少，所以不推荐使用。



**Kafka 核心组件的基础概念：**

1)Producer：即消息生产者，向 Kafka Broker 发消息的客户端。

2)Consumer：即消息消费者，从 Kafka Broker 读消息的客户端。

3)Consumer Group：即消费者组，由多个 Consumer 组成。消费者组内每个消费者负责消费不同分区的数据，以提高消费能力。一个分区只能由组内一个消费者消费，不同消费者组之间互不影响。

4)Broker：一台 Kafka 服务节点就是一个 Broker。一个集群是由1个或者多个 Broker 组成的，且一个 Broker 可以容纳多个 Topic。

5)Topic：一个逻辑上的概念，Topic 将消息分类，生产者和消费者面向的都是同一个 Topic, 同一个 Topic 下的 Partition 的消息内容是不相同的。

6)Partition：为了实现 Topic 扩展性，提高并发能力，一个非常大的 Topic 可以分布到多个 Broker 上，一个 Topic 可以分为多个 Partition 进行存储，且每个 Partition 是消息内容是有序的。

7)Replica：即副本，为实现数据备份的功能，保证集群中的某个节点发生故障时，该节点上的 Partition 数据不丢失，且 Kafka 仍然能够继续工作，为此 Kafka 提供了副本机制，一个 Topic 的每个 Partition 都有若干个副本，一个 Leader 副本和若干个 Follower 副本。

8)Leader：即每个分区多个副本的主副本，生产者发送数据的对象，以及消费者消费数据的对象，都是 Leader。

9)Follower：即每个分区多个副本的从副本，会实时从 Leader 副本中同步数据，并保持和 Leader 数据的同步。Leader 发生故障时，某个 Follower 还会被选举并成为新的 Leader , 且不能跟 Leader 在同一个 Broker 上, 防止崩溃数据可恢复。

10)Offset：消费者消费的位置信息，监控数据消费到什么位置，当消费者挂掉再重新恢复的时候，可以从消费位置继续消费。

![](http://www.img.youngxy.top/Java/fig/kafka1.png)

## 1.数据保存的策略

kafka 有两种数据保存策略:

- 按照过期时间保留
- 按照存储的消息大小保留

Kafka Broker默认的消息保留策略是：要么保留一定时间，要么保留到消息达到一定大小的字节数。

当消息达到设置的条件上限时，旧消息就会过期并被删除，所以，在任何时刻，可用消息的总量都不会超过配置参数所指定的大小。

topic可以配置自己的保留策略，可以将消息保留到不再使用他们为止。

因为在一个大文件里查找和删除消息是很费时的事，也容易出错，所以，分区被划分为若干个片段。默认情况下，每个片段包含1G或者一周的数据，以较小的那个为准。在broker往leader分区写入消息时，如果达到片段上限，就关闭当前文件，并打开一个新文件。当前正在写入数据的片段叫活跃片段。当所有片段都被写满时，会清除下一个分区片段的数据，如果配置的是7个片段，每天打开一个新片段，就会删除一个最老的片段，循环使用所有片段。

**kafka 同时设置了 7 天和 10G 清除数据，到第五天的时候消息达到了 10G，这个时候 kafka 将如何处理？**
这个时候 kafka 会执行数据清除工作，时间和大小不论那个满足条件，都会清空数据。

## 2.分区策略

### 2.1生产者：

**为什么要分区**？

1. 多Partition分布式存储，利于集群数据的均衡。
2. 并发读写，加快读写速度。
3. 加快数据恢复的速率：当某台机器挂了，每个Topic仅需恢复一部分的数据，多机器并发。

**分区的原则**

1. 指明partition的情况下，使用指定的partition；
2. 没有指明partition，但是有key的情况下，将key的hash值与topic的partition数进行取余得到partition值；
3. 既没有指定partition，也没有key的情况下，第一次调用时随机生成一个整数（后面每次调用在这个整数上自增），将这个值与topic可用的partition数取余得到partition值，也就是常说的round-robin算法。

```java
public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
    List<PartitionInfo> partitions = cluster.partitionsForTopic(topic);
    int numPartitions = partitions.size();
    if (keyBytes == null) {
        //key为空时，获取一个自增的计数，然后对分区做取模得到分区编号
        int nextValue = nextValue(topic);
        List<PartitionInfo> availablePartitions = cluster.availablePartitionsForTopic(topic);
        if (availablePartitions.size() > 0) {
            int part = Utils.toPositive(nextValue) % availablePartitions.size();
            return availablePartitions.get(part).partition();
        } else {
            // no partitions are available, give a non-available partition
            return Utils.toPositive(nextValue) % numPartitions;
        }
    } else {
        // hash the keyBytes to choose a partition
        // key不为空时，通过key的hash对分区取模（疑问：为什么这里不像上面那样，使用availablePartitions呢？）
        // 根据《Kafka权威指南》Page45理解：为了保证相同的键，总是能路由到固定的分区，如果使用可用分区，那么因为分区数变化，会导致相同的key，路由到不同分区
        // 所以如果要使用key来映射分区，最好在创建主题的时候就把分区规划好
        return Utils.toPositive(Utils.murmur2(keyBytes)) % numPartitions;
    }
}
 
private int nextValue(String topic) {
    //为每个topic维护了一个AtomicInteger对象，每次获取时+1
    AtomicInteger counter = topicCounterMap.get(topic);
    if (null == counter) {
        counter = new AtomicInteger(ThreadLocalRandom.current().nextInt());
        AtomicInteger currentCounter = topicCounterMap.putIfAbsent(topic, counter);
        if (currentCounter != null) {
            counter = currentCounter;
        }
    }
    return counter.getAndIncrement();
}
```



### 2.2消费者：

**分区分配策略**

一个consumer  group中有多个consumer，一个topic有多个partition，所以必然会涉及到partition的分配问题，即确定哪个partition由哪个consumer来消费。Kafka提供了3种消费者分区分配策略：RangeAssigor、RoundRobinAssignor、StickyAssignor。

 PartitionAssignor接口用于用户定义实现分区分配算法，以实现Consumer之间的分区分配。消费组的成员订阅它们感兴趣的Topic并将这种订阅关系传递给作为订阅组协调者的Broker。协调者选择其中的一个消费者来执行这个消费组的分区分配并将分配结果转发给消费组内所有的消费者。**Kafka默认采用RangeAssignor的分配算法。**

**RangeAssignor**

 RangeAssignor对每个Topic进行独立的分区分配。对于每一个Topic，首先对分区按照分区ID进行排序，然后订阅这个Topic的消费组的消费者再进行排序，之后尽量均衡的将分区分配给消费者。这里只能是尽量均衡，因为分区数可能无法被消费者数量整除，那么有一些消费者就会多分配到一些分区。分配示意图如下：

![](http://www.img.youngxy.top/Java/fig/kafka3.png)

分区分配的算法如下：

```java
@Override
public Map<String, List<TopicPartition>> assign(Map<String, Integer> partitionsPerTopic,
                                                Map<String, Subscription> subscriptions) {
    Map<String, List<String>> consumersPerTopic = consumersPerTopic(subscriptions);
    Map<String, List<TopicPartition>> assignment = new HashMap<>();
    for (String memberId : subscriptions.keySet())
        assignment.put(memberId, new ArrayList<TopicPartition>());
    //for循环对订阅的多个topic分别进行处理
    for (Map.Entry<String, List<String>> topicEntry : consumersPerTopic.entrySet()) {
        String topic = topicEntry.getKey();
        List<String> consumersForTopic = topicEntry.getValue();
 
        Integer numPartitionsForTopic = partitionsPerTopic.get(topic);
        if (numPartitionsForTopic == null)
            continue;
        //对消费者进行排序
        Collections.sort(consumersForTopic);
        //计算平均每个消费者分配的分区数
        int numPartitionsPerConsumer = numPartitionsForTopic / consumersForTopic.size();
        //计算平均分配后多出的分区数
        int consumersWithExtraPartition = numPartitionsForTopic % consumersForTopic.size();
 
        List<TopicPartition> partitions = AbstractPartitionAssignor.partitions(topic, numPartitionsForTopic);
        for (int i = 0, n = consumersForTopic.size(); i < n; i++) {
            //计算第i个消费者，分配分区的起始位置
            int start = numPartitionsPerConsumer * i + Math.min(i, consumersWithExtraPartition);
            //计算第i个消费者，分配到的分区数量
            int length = numPartitionsPerConsumer + (i + 1 > consumersWithExtraPartition ? 0 : 1);
            assignment.get(consumersForTopic.get(i)).addAll(partitions.subList(start, start + length));
        }
    }
    return assignment;
}
```



这种分配方式明显的一个问题是随着消费者订阅的Topic的数量的增加，不均衡的问题会越来越严重，比如上图中4个分区3个消费者的场景，C0会多分配一个分区。如果此时再订阅一个分区数为4的Topic，那么C0又会比C1、C2多分配一个分区，这样C0总共就比C1、C2多分配两个分区了，而且随着Topic的增加，这个情况会越来越严重。分配结果：

![](http://www.img.youngxy.top/Java/fig/kafka4.png)



订阅2个Topic，每个Topic4个分区，共3个Consumer

- **C0：**[T0P0，T0P1，T1P0，T1P1]
- **C1：**[T0P2，T1P2]
- **C2：**[T0P3，T1P3]

**RoundRobinAssignor**

RoundRobinAssignor的分配策略是将消费组内订阅的所有Topic的分区及所有消费者进行排序后尽量均衡的分配（RangeAssignor是针对单个Topic的分区进行排序分配的）。如果消费组内，消费者订阅的Topic列表是相同的（每个消费者都订阅了相同的Topic），那么分配结果是尽量均衡的（消费者之间分配到的分区数的差值不会超过1）。如果订阅的Topic列表是不同的，那么分配结果是不保证“尽量均衡”的，因为某些消费者不参与一些Topic的分配。

![](http://www.img.youngxy.top/Java/fig/kafka5.png)



以上两个topic的情况，相比于之前RangeAssignor的分配策略，可以使分区分配的更均衡。不过考虑这种情况，假设有三个消费者分别为C0、C1、C2，有3个Topic  T0、T1、T2，分别拥有1、2、3个分区，并且C0订阅T0，C1订阅T0和T1，C2订阅T0、T1、T2，那么RoundRobinAssignor的分配结果如下：

![](http://www.img.youngxy.top/Java/fig/kafka6.png)



看上去分配已经尽量的保证均衡了，不过可以发现C2承担了4个分区的消费而C1订阅了T1，是不是把T1的P1交给C1消费能更加的均衡呢？

 **StickyAssignor**

StickyAssignor分区分配算法，目的是在执行一次新的分配时，能在上一次分配的结果的基础上，尽量少的调整分区分配的变动，节省因分区分配变化带来的开销。Sticky是“粘性的”，可以理解为分配结果是带“粘性的”——每一次分配变更相对上一次分配做最少的变动。其目标有两点：

- 分区的分配尽量的均衡。
- 每一次重分配的结果尽量与上一次分配结果保持一致。

当这两个目标发生冲突时，优先保证第一个目标。第一个目标是每个分配算法都尽量尝试去完成的，而第二个目标才真正体现出StickyAssignor特性的。

StickyAssignor算法比较复杂，下面举例来说明分配的效果（对比RoundRobinAssignor），前提条件：

- 有4个Topic：T0、T1、T2、T3，每个Topic有2个分区。
- 有3个Consumer：C0、C1、C2，所有Consumer都订阅了这4个分区。

![](http://www.img.youngxy.top/Java/fig/kafka7.png)



上面红色的箭头代表的是有变动的分区分配，可以看出，StickyAssignor的分配策略，变动较小。



参考：https://blog.csdn.net/easylife206/article/details/124580641?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-4-124580641-blog-124349832.235^v28^pc_relevant_t0_download&spm=1001.2101.3001.4242.3&utm_relevant_index=7



## 3.kafka如何保证消息不被重复消费

### 3.1原因

（1）kafka有个offset的概念，当每个消息被写进去后，都有一个offset，代表他的序号，然后consumer消费该数据之后，隔一段时间，会把自己消费过的消息的offset提交一下，代表我已经消费过了。下次我要是重启，就会继续从上次消费到的offset来继续消费。但是当我们直接kill进程了，再重启。这会导致consumer有些消息处理了，但是没来得及提交offset。等重启之后，少数消息就会再次消费一次
（2）在Kafka中有一个Partition Balance机制，就是把多个Partition均衡的分配给多个消费者。消费端会从分配到的Partition里面去消费消息，如果消费者在默认的5分钟内没有处理完这一批消息。就会触发Kafka的Rebalance机制，从而导致offset自动提交失败。而Rebalance之后，消费者还是会从之前没提交的offset位置开始消费，从而导致消息重复消费。

### 3.2解决方案

- **开启kafka本身存在的幂等性：**

  acks=all和enable.idempotence=true来保证幂等性,这样 Producer 在重试发送消息时,Broker端就可以过滤重复消息。

  注： 添加唯一ID，类似于数据库的主键，用于唯一标记一个消息。

## 4.如何保证消息的顺序性?

### 4.1为什么要保证顺序？

消息队列中的若干消息如果是对同一个数据进行操作, 这些操作具有前后关系, 必须要按前后的顺序执行, 否则就会造成数据异常。

### 4.2出现顺序错乱的场景：

**第一种情况:**
一个queue, 有多个consumer去消费, 这样就会造成顺序的错误, consumer从MQ里面读取数据是有序的, 但是每个consumer的执行时间是不固定的, 无法保证先读到消息的consumer一定先完成操作, 这样就会出现消息并没有按照顺序执行, 造成数据顺序错误。

![](http://www.img.youngxy.top/Java/fig/kafka%E6%B6%88%E6%81%AF1.png)

**第二种情况:**

一个queue对应一个consumer, 但是consumer里面进行了多线程消费, 这样也会造成消息消费顺序错误。

![](http://www.img.youngxy.top/Java/fig/kafka%E6%B6%88%E6%81%AF2.png)

### 4.3如何保证消息的消费顺序？

**第一种方案:**
拆分多个queue, 每一个queue一个consumer

![](http://www.img.youngxy.top/Java/fig/kafka%E6%B6%88%E6%81%AF3.png)



**第二种方案:**
一个queue对应一个consumer

![](http://www.img.youngxy.top/Java/fig/kafka%E6%B6%88%E6%81%AF4.png)



参考：https://blog.csdn.net/qq_44901983/article/details/123416498

## 5.生产者有哪些发消息的模式?

![](http://www.img.youngxy.top/Java/fig/kafka2.png)

**发后即忘发送模式**

发后即忘模式「fire-and-forget」，它只管发送消息，并不需要关心消息是否发送成功。其本质上也是一种异步发送的方式，消息先存储在缓冲区中，达到设定条件后再批量进行发送。这是 kafka 吞吐量最高的方式，但同时也是消息最不可靠的方式，因为对于发送失败的消息并没有做任何处理，某些异常情况下会导致消息丢失。

```java
ProducerRecord<k,v> record = new ProducerRecord<k,v>("this-topic", key, value);
try {
  //fire-and-forget 模式   
  producer.send(record);
} catch (Exception e) {
  e.printStackTrace();
}
```

**同步发送模式**

同步发送模式 「sync」，调用 send() 方法会返回一个 Future 对象，再通过调用 Future 对象的 get() 方法，等待结果返回，根据返回的结果可以判断消息是否发送成功， 由于是同步发送会阻塞，只有当消息通过 get() 返回数据时，才会继续下一条消息的发送。

```java
Properties props = new Properties();
props.put("bootstrap.servers", "broker1:9092,broker2:9092");

Producer<String, String> producer = new KafkaProducer<>(props);

ProducerRecord<String, String> record = 
  new ProducerRecord<>("my-topic", "my-message");

try {
  RecordMetadata metadata = producer.send(record).get(); // 同步发送
  // 收到消息响应后处理结果
  System.out.println(metadata.topic()+":"+metadata.partition()+":"+metadata.offset()); 
} catch (Exception e) {
  // 处理发送失败 
  System.out.println("Error sending message");
}
```

**异步发送模式**

异步发送模式「async」，在调用 send() 方法的时候指定一个 callback 函数，当 Broker 接收到返回的时候，该 callback 函数会被触发执行，通过回调函数能够对异常情况进行处理，当调用了回调函数时，只有回调函数执行完毕生产者才会结束，否则一直会阻塞。

```Java
producer.send(record, new Callback() {
  public void onCompletion(RecordMetadata metadata, Exception exception) {
    if(exception != null) {
      // 消息发送失败处理
    } else {
      // 消息发送成功,在callback中处理
    }
  } 
});

// 发送端不需要等待callback返回
```

参考：https://ost.51cto.com/posts/11148
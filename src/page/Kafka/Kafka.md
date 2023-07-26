---
lang: zh-CN
title: Kafka
order: 1
description: 消息中间件
---

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

![f4108e1816b3087f38b546372e214958.png](https://img-blog.csdnimg.cn/img_convert/f4108e1816b3087f38b546372e214958.png)

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

![eff9adb5a086691e56b5d68bec68ffcf.png](https://img-blog.csdnimg.cn/img_convert/eff9adb5a086691e56b5d68bec68ffcf.png)



订阅2个Topic，每个Topic4个分区，共3个Consumer

- **C0：**[T0P0，T0P1，T1P0，T1P1]
- **C1：**[T0P2，T1P2]
- **C2：**[T0P3，T1P3]

**RoundRobinAssignor**

RoundRobinAssignor的分配策略是将消费组内订阅的所有Topic的分区及所有消费者进行排序后尽量均衡的分配（RangeAssignor是针对单个Topic的分区进行排序分配的）。如果消费组内，消费者订阅的Topic列表是相同的（每个消费者都订阅了相同的Topic），那么分配结果是尽量均衡的（消费者之间分配到的分区数的差值不会超过1）。如果订阅的Topic列表是不同的，那么分配结果是不保证“尽量均衡”的，因为某些消费者不参与一些Topic的分配。

![51b27d00cf50d9aca86e0934ab42a565.png](https://img-blog.csdnimg.cn/img_convert/51b27d00cf50d9aca86e0934ab42a565.png)



以上两个topic的情况，相比于之前RangeAssignor的分配策略，可以使分区分配的更均衡。不过考虑这种情况，假设有三个消费者分别为C0、C1、C2，有3个Topic  T0、T1、T2，分别拥有1、2、3个分区，并且C0订阅T0，C1订阅T0和T1，C2订阅T0、T1、T2，那么RoundRobinAssignor的分配结果如下：

![4e161a06a0afcae8d2c06603d676de4e.png](https://img-blog.csdnimg.cn/img_convert/4e161a06a0afcae8d2c06603d676de4e.png)



看上去分配已经尽量的保证均衡了，不过可以发现C2承担了4个分区的消费而C1订阅了T1，是不是把T1的P1交给C1消费能更加的均衡呢？

 **StickyAssignor**

StickyAssignor分区分配算法，目的是在执行一次新的分配时，能在上一次分配的结果的基础上，尽量少的调整分区分配的变动，节省因分区分配变化带来的开销。Sticky是“粘性的”，可以理解为分配结果是带“粘性的”——每一次分配变更相对上一次分配做最少的变动。其目标有两点：

- 分区的分配尽量的均衡。
- 每一次重分配的结果尽量与上一次分配结果保持一致。

当这两个目标发生冲突时，优先保证第一个目标。第一个目标是每个分配算法都尽量尝试去完成的，而第二个目标才真正体现出StickyAssignor特性的。

StickyAssignor算法比较复杂，下面举例来说明分配的效果（对比RoundRobinAssignor），前提条件：

- 有4个Topic：T0、T1、T2、T3，每个Topic有2个分区。
- 有3个Consumer：C0、C1、C2，所有Consumer都订阅了这4个分区。



![eb5597ed0b81b03c762e54ff3f909492.png](https://img-blog.csdnimg.cn/img_convert/eb5597ed0b81b03c762e54ff3f909492.png)



上面红色的箭头代表的是有变动的分区分配，可以看出，StickyAssignor的分配策略，变动较小。



参考：https://blog.csdn.net/easylife206/article/details/124580641?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-4-124580641-blog-124349832.235^v28^pc_relevant_t0_download&spm=1001.2101.3001.4242.3&utm_relevant_index=7



## 3.kafka如何保证消息不被重复消费

### 3.1原因

（1）kafka有个offset的概念，当每个消息被写进去后，都有一个offset，代表他的序号，然后consumer消费该数据之后，隔一段时间，会把自己消费过的消息的offset提交一下，代表我已经消费过了。下次我要是重启，就会继续从上次消费到的offset来继续消费。但是当我们直接kill进程了，再重启。这会导致consumer有些消息处理了，但是没来得及提交offset。等重启之后，少数消息就会再次消费一次
（2）在Kafka中有一个Partition Balance机制，就是把多个Partition均衡的分配给多个消费者。消费端会从分配到的Partition里面去消费消息，如果消费者在默认的5分钟内没有处理完这一批消息。就会触发Kafka的Rebalance机制，从而导致offset自动提交失败。而Rebalance之后，消费者还是会从之前没提交的offset位置开始消费，从而导致消息重复消费。

### 3.2解决方案

- **开启kafka本身存在的幂等性：**

  acks=all和enable.idempotence=true来保证幂等性,这样 Producer 在重试发送消息时,Broker端就可以过滤重复消息。

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/afb50c35d4dd4b14bd8f30929a494228.png)

  注： 添加唯一ID，类似于数据库的主键，用于唯一标记一个消息。

## 4.如何保证消息的顺序性?

### 4.1为什么要保证顺序？

消息队列中的若干消息如果是对同一个数据进行操作, 这些操作具有前后关系, 必须要按前后的顺序执行, 否则就会造成数据异常。

### 4.2出现顺序错乱的场景：

**第一种情况:**
一个queue, 有多个consumer去消费, 这样就会造成顺序的错误, consumer从MQ里面读取数据是有序的, 但是每个consumer的执行时间是不固定的, 无法保证先读到消息的consumer一定先完成操作, 这样就会出现消息并没有按照顺序执行, 造成数据顺序错误。

![img](https://img-blog.csdnimg.cn/cfe17769c1c949a4b6eced9fe3d68491.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)

**第二种情况:**

一个queue对应一个consumer, 但是consumer里面进行了多线程消费, 这样也会造成消息消费顺序错误。

![img](https://img-blog.csdnimg.cn/3fed5f0626084f83ae5aea89963d5fc6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 如何保证消息的消费顺序？

**第一种方案:**
拆分多个queue, 每一个queue一个consumer

![img](https://img-blog.csdnimg.cn/f1e9445d6c5d411b9b9b385c70797fcc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)



**第二种方案:**
一个queue对应一个consumer

![img](https://img-blog.csdnimg.cn/227a2d3b375e47e0aa171bd184ba7af1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)



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

**异步发送模式**

异步发送模式「async」，在调用 send() 方法的时候指定一个 callback 函数，当 Broker 接收到返回的时候，该 callback 函数会被触发执行，通过回调函数能够对异常情况进行处理，当调用了回调函数时，只有回调函数执行完毕生产者才会结束，否则一直会阻塞。

参考：https://ost.51cto.com/posts/11148
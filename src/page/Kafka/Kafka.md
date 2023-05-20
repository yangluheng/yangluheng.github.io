---
lang: zh-CN
title: Kafka
order: 8
description: 消息中间件
---



### 数据保存的策略

kafka 有两种数据保存策略:

1、按照过期时间保留

2、按照存储的消息大小保留

Kafka Broker默认的消息保留策略是：要么保留一定时间，要么保留到消息达到一定大小的字节数。

当消息达到设置的条件上限时，旧消息就会过期并被删除，所以，在任何时刻，可用消息的总量都不会超过配置参数所指定的大小。

topic可以配置自己的保留策略，可以将消息保留到不再使用他们为止。

因为在一个大文件里查找和删除消息是很费时的事，也容易出错，所以，分区被划分为若干个片段。默认情况下，每个片段包含1G或者一周的数据，以较小的那个为准。在broker往leader分区写入消息时，如果达到片段上限，就关闭当前文件，并打开一个新文件。当前正在写入数据的片段叫活跃片段。当所有片段都被写满时，会清除下一个分区片段的数据，如果配置的是7个片段，每天打开一个新片段，就会删除一个最老的片段，循环使用所有片段。

kafka 同时设置了 7 天和 10G 清除数据，到第五天的时候消息达到了 10G，这个时候 kafka 将如何处理？
这个时候 kafka 会执行数据清除工作，时间和大小不论那个满足条件，都会清空数据。



### 分区策略

##### 生产者：

**为什么要分区**

1. 多Partition分布式存储，利于集群数据的均衡。
2. 并发读写，加快读写速度。
3. 加快数据恢复的速率：当某台机器挂了，每个Topic仅需恢复一部分的数据，多机器并发。

**分区的原则**

1. 指明partition的情况下，使用指定的partition；
2. 没有指明partition，但是有key的情况下，将key的hash值与topic的partition数进行取余得到partition值；
3. 既没有指定partition，也没有key的情况下，第一次调用时随机生成一个整数（后面每次调用在这个整数上自增），将这个值与topic可用的partition数取余得到partition值，也就是常说的round-robin算法。

```
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



##### 消费者：

**分区分配策略**

一个consumer  group中有多个consumer，一个topic有多个partition，所以必然会涉及到partition的分配问题，即确定哪个partition由哪个consumer来消费。Kafka提供了3种消费者分区分配策略：RangeAssigor、RoundRobinAssignor、StickyAssignor。

 PartitionAssignor接口用于用户定义实现分区分配算法，以实现Consumer之间的分区分配。消费组的成员订阅它们感兴趣的Topic并将这种订阅关系传递给作为订阅组协调者的Broker。协调者选择其中的一个消费者来执行这个消费组的分区分配并将分配结果转发给消费组内所有的消费者。**Kafka默认采用RangeAssignor的分配算法。**

**RangeAssignor**

 RangeAssignor对每个Topic进行独立的分区分配。对于每一个Topic，首先对分区按照分区ID进行排序，然后订阅这个Topic的消费组的消费者再进行排序，之后尽量均衡的将分区分配给消费者。这里只能是尽量均衡，因为分区数可能无法被消费者数量整除，那么有一些消费者就会多分配到一些分区。分配示意图如下：

![f4108e1816b3087f38b546372e214958.png](https://img-blog.csdnimg.cn/img_convert/f4108e1816b3087f38b546372e214958.png)

分区分配的算法如下：

```
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



看上去分配已经尽量的保证均衡了，不过可以发现C2承担了4个分区的消费而C1订阅了T1，是不是把T1P1交给C1消费能更加的均衡呢？

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



### kafka如何保证消息不被重复消费

#### 原因

（1）kafka有个offset的概念，当每个消息被写进去后，都有一个offset，代表他的序号，然后consumer消费该数据之后，隔一段时间，会把自己消费过的消息的offset提交一下，代表我已经消费过了。下次我要是重启，就会继续从上次消费到的offset来继续消费。但是当我们直接kill进程了，再重启。这会导致consumer有些消息处理了，但是没来得及提交offset。等重启之后，少数消息就会再次消费一次
（2）在Kafka中有一个Partition Balance机制，就是把多个Partition均衡的分配给多个消费者。消费端会从分配到的Partition里面去消费消息，如果消费者在默认的5分钟内没有处理完这一批消息。就会触发Kafka的Rebalance机制，从而导致offset自动提交失败。而Rebalance之后，消费者还是会从之前没提交的offset位置开始消费，从而导致消息重复消费。

#### 解决方案

- **开启kafka本身存在的幂等性：**

  ![在这里插入图片描述](https://img-blog.csdnimg.cn/afb50c35d4dd4b14bd8f30929a494228.png)

  注： 添加唯一ID，类似于数据库的主键，用于唯一标记一个消息。
   ProducerID：#在每个新的Producer初始化时，会被分配一个唯一的PID
   SequenceNumber：#对于每个PID发送数据的每个Topic都对应一个从0开始单调递增的SN值。

- **将获取的唯一id存表，（利用mySQl的唯一键约束，或者redis天然的set结构）**

参考：https://blog.csdn.net/m0_51167384/article/details/128106266?spm=1001.2101.3001.6650.7&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-128106266-blog-76435385.235%5Ev28%5Epc_relevant_t0_download&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-7-128106266-blog-76435385.235%5Ev28%5Epc_relevant_t0_download&utm_relevant_index=8&ydreferer=aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3UwMTA2Mjc4NDAvYXJ0aWNsZS9kZXRhaWxzLzc2NDM1Mzg1P3NwbT0xMDAxLjIxMDEuMzAwMS42NjUwLjEmdXRtX21lZGl1bT1kaXN0cmlidXRlLnBjX3JlbGV2YW50Lm5vbmUtdGFzay1ibG9nLTIlN0VkZWZhdWx0JTdFQ1RSTElTVCU3RVJhdGUtMS03NjQzNTM4NS1ibG9nLTExNzQxOTA1OC4yMzUlNUV2MjglNUVwY19yZWxldmFudF90MF9kb3dubG9hZCZkZXB0aF8xLXV0bV9zb3VyY2U9ZGlzdHJpYnV0ZS5wY19yZWxldmFudC5ub25lLXRhc2stYmxvZy0yJTdFZGVmYXVsdCU3RUNUUkxJU1QlN0VSYXRlLTEtNzY0MzUzODUtYmxvZy0xMTc0MTkwNTguMjM1JTVFdjI4JTVFcGNfcmVsZXZhbnRfdDBfZG93bmxvYWQmdXRtX3JlbGV2YW50X2luZGV4PTI%3D



### 如何保证消息的顺序性?

#### 为什么要保证顺序？

消息队列中的若干消息如果是对同一个数据进行操作, 这些操作具有前后关系, 必须要按前后的顺序执行, 否则就会造成数据异常.

#### 出现顺序错乱的场景：

    第一种情况:
    一个queue, 有多个consumer去消费, 这样就会造成顺序的错误, consumer从MQ里面读取数据是有序的, 但是每个consumer的执行时间是不固定的, 无法保证先读到消息的consumer一定先完成操作, 这样就会出现消息并没有按照顺序执行, 造成数据顺序错误。

![img](https://img-blog.csdnimg.cn/cfe17769c1c949a4b6eced9fe3d68491.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)


```
第二种情况:

一个queue对应一个consumer, 但是consumer里面进行了多线程消费, 这样也会造成消息消费顺序错误。
```

![img](https://img-blog.csdnimg.cn/3fed5f0626084f83ae5aea89963d5fc6.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)

#### 如何保证消息的消费顺序？

```
第一种方案:

拆分多个queue, 每一个queue一个consumer, 就是多一些queue而已, 确实是麻烦点; 这样也会造成吞吐量下降, 可以在消费者内部采用多线程的方式去消费。
```

![img](https://img-blog.csdnimg.cn/f1e9445d6c5d411b9b9b385c70797fcc.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)



```
第二种方案:

就是一个queue对应一个consumer, 然后这个consumer内部用内存队列做排队, 然后分发给底层不同的worker来处理。
```

![img](https://img-blog.csdnimg.cn/227a2d3b375e47e0aa171bd184ba7af1.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5Y-v54ix6L-35Lq6,size_20,color_FFFFFF,t_70,g_se,x_16)



参考：https://blog.csdn.net/qq_44901983/article/details/123416498


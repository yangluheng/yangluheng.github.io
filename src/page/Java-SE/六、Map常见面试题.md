---
lang: zh-CN
title: 六、Map常见面试题
order: 6
description: Java基础
---



## 1.为什么JDK1.8中HashMap从头插入改成尾插入

原文链接：https://blog.csdn.net/qq_35590459/article/details/108988011

JDK1.7中扩容时，每个元素的rehash之后，都会插入到新数组对应索引的链表头，所以这就导致原链表顺序为A->B->C，扩容之后，rehash之后的链表可能为C->B->A，元素的顺序发生了变化。在并发场景下，扩容时可能会出现循环链表的情况。而JDK1.8从头插入改成尾插入元素的顺序不变，避免出现循环链表的情况。

## 2.为什么JDK1.8采用红黑树存储[Hash](https://so.csdn.net/so/search?q=Hash&spm=1001.2101.3001.7020)冲突的元素？

红黑树本质上是一棵二叉查找树，但它在二叉查找树的基础上增加了着色和相关的性质使得**红黑树相对平衡，从而保证了红黑树的查找、插入、删除的时间复杂度最坏为O(log n)。能够加快检索速率。**



## 3.为什么在长度小于8时使用链表，不一直使用红黑树？

桶中元素的插入只会在hash冲突时发生，而hash冲突发生的概率较小，一直维护一个红黑树比链表耗费资源更多，在桶中元素量较小时没有这个必要。



## 4.为什么要使用红黑树而不使用AVL树？

红黑树与AVLl树，在检索的时候效率差不多，都是通过平衡来二分查找。但红黑树不像avl树一样追求绝对的平衡，红黑树允许局部很少的不完全平衡，这样对于效率影响不大，但省去了很多没有必要的调平衡操作，avl树调平衡有时候代价较大，所以效率不如红黑树。



## 5.为什么数组容量必须是2次幂？

索引计算公式为i = (n - 1) & hash，如果n为2次幂，那么n-1的低位就全是1，哈希值进行与操作时可以保证低位的值不变，从而保证分布均匀，效果等同于hash%n，但是位运算比取余运算要高效的多。



## 6.为什么单链表转为红黑树要求桶内的元素个数大于8？

当hashCode离散性很好的时候，树型bin用到的概率非常小，因为数据均匀分布在每个bin中，几乎不会有bin中链表长度会达到阈值。但是在随机hashCode下，离散性可能会变差，然而JDK又不能阻止用户实现这种不好的hash算法，因此就可能导致不均匀的数据分布。不过理想情况下随机hashCode算法下所有bin中节点的分布频率会遵循泊松分布，而一个bin中链表长度达到8个元素的概率为0.00000006，几乎是不可能事件。

同理，少于8就从红黑树转回单链表是为了节省维护一个树的资源消耗，而选择8作为临界值，是因理想情况下一个bin中元素个数达到6的概率是0.00001316，达到7的概率为0.00000094，二者跨度较大，可以减小树和链表之间频繁转化的可能性。

## 7.HashMap和Hashtable的区别

**共同点:**都是双列集合,底层都是哈希算法

**区别:**

* HashMap是线程不安全的，效率高，JDK1.2版本
* Hashtable是线程安全的，效率低，JDK1.0版本
* HashMap可以存储null键和null值
* Hashtable不可以存储null键和null值
* HashTable是基于陈旧的Dictionary类继承来的。 HashMap继承的抽象类AbstractMap实现了Map接口。
* 默认初始容量和扩容机制： HashTable中的hash数组初始大小是11，增加的方式是 old*2+1。HashMap中hash数组的默认大小是16，而且一定是2的指数。
* 哈希值的使用不同 ： HashTable直接使用对象的hashCode。 HashMap重新计算hash值。
* 遍历方式的内部实现上不同 ： Hashtable、HashMap都使用了 Iterator。而由于历史原因，Hashtable还使用了Enumeration的方式。HashMap 实现 Iterator，支持fast-fail，Hashtable的 Iterator 遍历支持fast-fail，用 Enumeration 不支持 fast-fail

具体地，Hashtable是线程安全的，它的每个方法中都加入了Synchronize方法。在多线程并发的环境下，可以直接使用Hashtable，不需要自己为它的方法实现同步。

HashMap不是线程安全的，在多线程并发的环境下，可能会产生死锁等问题。使用HashMap时就必须要自己增加同步处理。虽然HashMap不是线程安全的，但是它的效率会比Hashtable要好很多。这样设计是合理的。在我们的日常使用当中，大部分时间是单线程操作的。HashMap把这部分操作解放出来了。当需要多线程操作的时候可以使用线程安全的**ConcurrentHashMap**。ConcurrentHashMap虽然也是线程安全的，但是它的效率比Hashtable要高好多倍。因为ConcurrentHashMap使用了分段锁，并不对整个数据进行锁定。

**Hashtable、HashMap都使用了 Iterator。而由于历史原因，Hashtable还使用了Enumeration的方式 。**

HashMap的Iterator是fail-fast迭代器。当有其它线程改变了HashMap的结构（增加，删除，修改元素），将会抛出ConcurrentModificationException。

JDK8之前的版本中，Hashtable是没有fast-fail机制的。在JDK8及以后的版本中 ，HashTable也是使用fast-fail的。

HashMap与Hashtable的区别是面试中经常遇到的一个问题。这个问题看似简单，但如果深究进去，也能了解到不少知识。（原文链接：https://blog.csdn.net/yang13563758128/article/details/86655574?spm=1001.2014.3001.5502）

## 8.HashMap、ConcurrentHashMap区别

ConcurrentHashMap和HashMap的实现方式不一样，虽然都是使用桶数组实现的，但是还是有区别，ConcurrentHashMap对桶数组进行了分段，而HashMap并没有。

ConcurrentHashMap在每一个分段上都用锁进行了保护。HashMap没有锁机制。所以，前者线程安全的，后者不是线程安全的。

**注意**：以上区别基于jdk1.8以前的版本。



## 9.HashMap 的 7 种遍历方式与性能分析

HashMap 遍历从大的方向来说，可分为以下 4 类：

1. 迭代器（Iterator）方式遍历；
2. For Each 方式遍历；
3. Lambda 表达式遍历（JDK 1.8+）;
4. Streams API 遍历（JDK 1.8+）。

但每种类型下又有不同的实现方式，因此具体的遍历方式又可以分为以下 7 种：

1. 使用迭代器（Iterator）EntrySet 的方式进行遍历；
2. 使用迭代器（Iterator）KeySet 的方式进行遍历；
3. 使用 For Each EntrySet 的方式进行遍历；
4. 使用 For Each KeySet 的方式进行遍历；
5. 使用 Lambda 表达式的方式进行遍历；
6. 使用 Streams API 单线程的方式进行遍历；
7. 使用 Streams API 多线程的方式进行遍历。

### 9.1遍历方式

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * HashMap的遍历方式
 */
public class Main {
    public static void main(String[] args) {
        HashMap<Integer, String> hashMap = new HashMap<>();
        hashMap.put(1, "去");
        hashMap.put(2, "有");
        hashMap.put(3, "风");
        hashMap.put(4, "的");
        hashMap.put(5, "地");
        hashMap.put(6, "方");

        entrySet(hashMap);
        keySet(hashMap);
        for_entrySet(hashMap);
        for_key(hashMap);
        lambda(hashMap);
        stream_danxiancheng(hashMap);
        stream_duoxiancheng(hashMap);
    }

    private static void stream_duoxiancheng(HashMap<Integer, String> hashMap) {
        //7.stream多线程
        hashMap.entrySet().parallelStream().forEach((entry) -> {
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
        });
    }

    private static void stream_danxiancheng(HashMap<Integer, String> hashMap) {
        //6.stream单线程
        hashMap.entrySet().stream().forEach((entry) -> {
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
        });
    }

    private static void lambda(HashMap<Integer, String> hashMap) {
        //5.lambda
        hashMap.forEach((key, value) -> {
            System.out.println(key);
            System.out.println(value);
        });
    }

    private static void for_key(HashMap<Integer, String> hashMap) {
        //4.forkeySet
        for (Integer key : hashMap.keySet()) {
            System.out.println(key);
            System.out.println(hashMap.get(key));
        }
    }

    private static void for_entrySet(HashMap<Integer, String> hashMap) {
        //3.forentrySet
        for (Map.Entry<Integer, String> entry : hashMap.entrySet()) {
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
        }
    }

    private static void keySet(HashMap<Integer, String> hashMap) {
        //2.迭代器keySet
        Iterator<Integer> iterator = hashMap.keySet().iterator();
        while (iterator.hasNext()){
            Integer key = iterator.next();
            System.out.println(key);
            System.out.println(hashMap.get(key));
        }
    }

    private static void entrySet(HashMap<Integer, String> hashMap) {
        //1.迭代器entrySet
        Iterator<Map.Entry<Integer, String>> iterator = hashMap.entrySet().iterator();
        while (iterator.hasNext()){
            Map.Entry<Integer, String> entry = iterator.next();
            System.out.println(entry.getKey());
            System.out.println(entry.getValue());
        }
    }
}

```

### 9.2性能分析

`EntrySet` 之所以比 `KeySet` 的性能高是因为，`KeySet` 在循环时使用了 `map.get(key)`，而 `map.get(key)` 相当于又遍历了一遍 Map 集合去查询 `key` 所对应的值。为什么要用“又”这个词？那是因为**在使用迭代器或者 for 循环时，其实已经遍历了一遍 Map 集合了，因此再使用 `map.get(key)` 查询时，相当于遍历了两遍**。

而 `EntrySet` 只遍历了一遍 Map 集合，之后通过代码“Entry<Integer, String> entry = iterator.next()”把对象的 `key` 和 `value` 值都放入到了 `Entry` 对象中，因此再获取 `key` 和 `value` 值时就无需再遍历 Map 集合，只需要从 `Entry` 对象中取值就可以了。

所以，**`EntrySet` 的性能比 `KeySet` 的性能高出了一倍，因为 `KeySet` 相当于循环了两遍 Map 集合，而 `EntrySet` 只循环了一遍**。

这篇文章对于 parallelStream 遍历方式的性能分析有误，先说结论：**存在阻塞时 parallelStream 性能最高, 非阻塞时 parallelStream 性能最低** 。

当遍历不存在阻塞时, parallelStream 的性能是最低的：

```
Benchmark               Mode  Cnt     Score      Error  Units
Test.entrySet           avgt    5   288.651 ±   10.536  ns/op
Test.keySet             avgt    5   584.594 ±   21.431  ns/op
Test.lambda             avgt    5   221.791 ±   10.198  ns/op
Test.parallelStream     avgt    5  6919.163 ± 1116.139  ns/op
```

加入阻塞代码`Thread.sleep(10)`后, parallelStream 的性能才是最高的:

```
Benchmark               Mode  Cnt           Score          Error  Units
Test.entrySet           avgt    5  1554828440.000 ± 23657748.653  ns/op
Test.keySet             avgt    5  1550612500.000 ±  6474562.858  ns/op
Test.lambda             avgt    5  1551065180.000 ± 19164407.426  ns/op
Test.parallelStream     avgt    5   186345456.667 ±  3210435.590  ns/op
```



参考：https://mp.weixin.qq.com/s/zQBN3UvJDhRTKP6SzcZFKw
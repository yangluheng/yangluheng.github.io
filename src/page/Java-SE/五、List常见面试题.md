---
lang: zh-CN
title: 五、List常见面试题
order: 5
description: Java基础
---



## 1.ArrayList和LinkedList和Vector的区别

List主要有ArrayList、LinkedList与Vector几种实现。

这三者都实现了List 接口，使用方式也很相似,主要区别在于因为实现方式的不同,所以对不同的操作具有不同的效率。

- ArrayList 是一个可改变大小的数组.当更多的元素加入到ArrayList中时,其大小将会动态地增长.内部的元素可以直接通过get与set方法进行访问,因为ArrayList本质上就是一个数组。
- LinkedList 是一个双链表,在添加和删除元素时具有比ArrayList更好的性能.但在get与set方面弱于ArrayList。

当然,这些对比都是指数据量很大或者操作很频繁的情况下的对比,如果数据和运算量很小,那么对比将失去意义。

- Vector 和ArrayList类似,但属于强同步类。如果你的程序本身是线程安全的(thread-safe,没有在多个线程之间共享同一个集合/对象),那么使用ArrayList是更好的选择。
- Vector和ArrayList在更多元素添加进来时会请求更大的空间。Vector每次请求其大小的双倍空间，而ArrayList每次对size增长50%。
- 而 LinkedList 还实现了 Queue 接口,该接口比List提供了更多的方法,包括 offer(),peek(),poll()等。

**注意:** 默认情况下ArrayList的初始容量非常小,所以如果可以预估数据量的话,分配一个较大的初始值属于最佳实践,这样可以减少调整大小的开销。

## 2.ArrayList使用了transient关键字进行存储优化，而Vector没有，为什么？

话不多说，上源码：

**ArrayList：**

```java
/** 
     * Save the state of the <tt>ArrayList</tt> instance to a stream (that 
     * is, serialize it). 
     * 
     * @serialData The length of the array backing the <tt>ArrayList</tt> 
     *             instance is emitted (int), followed by all of its elements 
     *             (each an <tt>Object</tt>) in the proper order. 
     */  
    private void writeObject(java.io.ObjectOutputStream s)  
        throws java.io.IOException{  
        // Write out element count, and any hidden stuff  
        int expectedModCount = modCount;  
        s.defaultWriteObject();  

        // Write out array length  
        s.writeInt(elementData.length);  

        // Write out all elements in the proper order.  
        for (int i=0; i<size; i++)  
            s.writeObject(elementData[i]);  

        if (modCount != expectedModCount) {  
            throw new ConcurrentModificationException();  
        }  

    }  
```

ArrayList实现了**writeObject**方法，可以看到只保存了非null的数组位置上的数据。即list的size个数的elementData。需要额外注意的一点是，ArrayList的实现，提供了**fast-fail**机制，可以提供弱一致性。

**Vector：**

```java
/**
     * Save the state of the {@code Vector} instance to a stream (that
     * is, serialize it).
     * This method performs synchronization to ensure the consistency
     * of the serialized data.
     */
    private void writeObject(java.io.ObjectOutputStream s)
            throws java.io.IOException {
        final java.io.ObjectOutputStream.PutField fields = s.putFields();
        final Object[] data;
        synchronized (this) {
            fields.put("capacityIncrement", capacityIncrement);
            fields.put("elementCount", elementCount);
            data = elementData.clone();
        }
        fields.put("elementData", data);
        s.writeFields();
    }
```

Vector也实现了writeObject方法，但方法并没有像ArrayList一样进行优化存储，实现语句是

```java
data = elementData.clone();
```

clone()的时候会把null值也拷贝。所以保存相同内容的Vector与ArrayList，Vector的占用的字节比ArrayList要多。

可以测试一下，序列化存储相同内容的Vector与ArrayList，分别到一个文本文件中去。 Vector需要243字节， ArrayList需要135字节。

**分析：**

ArrayList是非同步实现的一个单线程下较为高效的数据结构（相比Vector来说）。 ArrayList只通过一个修改记录字段提供弱一致性，主要用在迭代器里。没有同步方法。  即上面提到的Fast-fail机制。ArrayList的存储结构定义为transient，重写writeObject来实现自定义的序列化，优化了存储。

Vector是多线程环境下更为可靠的数据结构，所有方法都实现了同步。

区别：

:::info

同步处理：Vector同步，ArrayList非同步 。

Vector缺省情况下增长原来一倍的数组长度，ArrayList是0.5倍。ArrayList: **int newCapacity = oldCapacity + (oldCapacity >> 1)**; ArrayList自动扩大容量为原来的**1.5**倍（实现的时候，方法会传入一个期望的最小容量，若扩容后容量仍然小于最小容量，那么容量就为传入的最小容量。扩容的时候使用的**Arrays.copyOf**方法最终调用native方法进行新数组创建和数据拷贝）。

Vector: **int newCapacity = oldCapacity + ((capacityIncrement > 0) ? capacityIncrement : oldCapacity)**;Vector指定了initialCapacity，capacityIncrement来初始化的时候，每次增长capacityIncrement。

:::

## 3.SynchronizedList和Vector的区别

Vector是java.util包中的一个类。 SynchronizedList是java.util.Collections中的一个静态内部类。

在多线程的场景中可以直接使用Vector类，也可以使用Collections.synchronizedList(List list)方法来返回一个线程安全的List。

**那么，到底SynchronizedList和Vector有没有区别，为什么java api要提供这两种线程安全的List的实现方式呢？**

首先，我们知道Vector和Arraylist都是List的子类，他们底层的实现都是一样的。所以这里比较如下两个`list1`和`list2`的区别：

```java
List<String> list = new ArrayList<String>();
List list2 =  Collections.synchronizedList(list);
Vector<String> list1 = new Vector<String>();
```

### 3.1比较几个重要的方法

####  3.1.1add方法：

**Vector的实现：**

```java
public void add(int index, E element) {
    insertElementAt(element, index);
}

public synchronized void insertElementAt(E obj, int index) {
    modCount++;
    if (index > elementCount) {
        throw new ArrayIndexOutOfBoundsException(index
                                                 + " > " + elementCount);
    }
    ensureCapacityHelper(elementCount + 1);
    System.arraycopy(elementData, index, elementData, index + 1, elementCount - index);
    elementData[index] = obj;
    elementCount++;
}

private void ensureCapacityHelper(int minCapacity) {
    // overflow-conscious code
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```

**synchronizedList的实现：**

```java
public void add(int index, E element) {
   synchronized (mutex) {
       list.add(index, element);
   }
}
```

这里，使用同步代码块的方式调用ArrayList的add()方法。ArrayList的add方法内容如下：

```java
public void add(int index, E element) {
    rangeCheckForAdd(index);
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    System.arraycopy(elementData, index, elementData, index + 1,
                     size - index);
    elementData[index] = element;
    size++;
}
private void rangeCheckForAdd(int index) {
    if (index > size || index < 0)
        throw new IndexOutOfBoundsException(outOfBoundsMsg(index));
}
private void ensureCapacityInternal(int minCapacity) {
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    ensureExplicitCapacity(minCapacity);
}
```

从上面两段代码中发现有两处不同： 

**1.Vector使用同步方法实现，synchronizedList使用同步代码块实现。**

**2.两者的扩充数组容量方式不一样（两者的add方法在扩容方面的差别也就是ArrayList和Vector的差别。）**

#### 3.1.2remove方法

**synchronizedList的实现：**

```java
public E remove(int index) {
    synchronized (mutex) {return list.remove(index);}
}
```

**ArrayList类的remove方法内容如下：**

```java
public E remove(int index) {
    rangeCheck(index);

    modCount++;
    E oldValue = elementData(index);

    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index,
                         numMoved);
    elementData[--size] = null; // clear to let GC do its work

    return oldValue;
}
```

**Vector的实现：**

```java
public synchronized E remove(int index) {
        modCount++;
        if (index >= elementCount)
            throw new ArrayIndexOutOfBoundsException(index);
        E oldValue = elementData(index);

        int numMoved = elementCount - index - 1;
        if (numMoved > 0)
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        elementData[--elementCount] = null; // Let gc do its work

        return oldValue;
    }
```

**从remove方法中我们发现除了一个使用同步方法，一个使用同步代码块之外几乎无任何区别。**

:::info

通过比较其他方法，我们发现，SynchronizedList里面实现的方法几乎都是使用同步代码块包上List的方法。如果该List是ArrayList那么，SynchronizedList和Vector的一个比较明显区别就是一个使用了同步代码块，一个使用了同步方法。

:::

### 3.2区别分析

**数据增长区别**

:::info

从内部实现机制来讲ArrayList和Vector都是使用数组(Array)来控制集合中的对象。当你向这两种类型中增加元素的时候，如果元素的数目超出了内部数组目前的长度它们都需要扩展内部数组的长度，Vector缺省情况下自动增长原来一倍的数组长度，ArrayList是原来的50%,所以最后你获得的这个集合所占的空间总是比你实际需要的要大。所以如果你要在集合中保存大量的数据那么使用Vector有一些优势，因为你可以通过设置集合的初始化大小来避免不必要的资源开销。

:::

**同步代码块和同步方法的区别** 

:::info

- 同步代码块在锁定的范围上可能比同步方法要小，一般来说锁的范围大小和性能是成反比的。 
- 同步块可以更加精确的控制锁的作用域（锁的作用域就是从锁被获取到其被释放的时间），同步方法的锁的作用域就是整个方法。
- 同步代码块可以选择对哪个对象加锁，但是静态方法只能给this对象加锁。

:::

因为SynchronizedList只是使用同步代码块包裹了ArrayList的方法，而ArrayList和Vector中同名方法的方法体内容并无太大差异，所以在锁定范围和锁的作用域上两者并无区别。 

 在锁定的对象区别上，SynchronizedList的同步代码块锁定的是**mutex**对象，Vector锁定的是**this**对象。

**那么mutex对象又是什么呢？**  其实SynchronizedList有一个构造函数可以传入一个Object,如果在调用的时候显示的传入一个对象，那么锁定的就是用户传入的对象。如果没有指定，那么锁定的也是this对象。

但是，凡事都有但是。  SynchronizedList中实现的类并没有都使用synchronized同步代码块。其中有**listIterator**和**listIterator(int index)**并没有做同步处理。但是Vector却对该方法加了方法锁。 所以说，在使用SynchronizedList进行遍历的时候要手动加锁。

但是，但是之后还有但是。

之前的比较都是基于我们将ArrayList转成SynchronizedList。那么如果我们想把LinkedList变成线程安全的，或者说我想要方便在中间插入和删除的同步的链表，那么我可以将已有的LinkedList直接转成  SynchronizedList，而不用改变他的底层数据结构。而这一点是Vector无法做到的，因为他的底层结构就是使用数组实现的，这个是无法更改的。

所以，最后，SynchronizedList和Vector最主要的区别：

-  **SynchronizedList有很好的扩展和兼容功能。他可以将所有的List的子类转成线程安全的类。**
-  **使用SynchronizedList的时候，进行遍历时要手动进行同步处理**。
-  **SynchronizedList可以指定锁定的对象。**
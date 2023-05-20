---
lang: zh-CN
title: Java基础
order: 1
description: Java
---



## 一：Java基础

**HashMap、HashTable**：https://blog.csdn.net/yang13563758128/article/details/86655574?spm=1001.2014.3001.5502

### 异常

#### Java异常类层次结构?

- Throwable是 Java 语言中所有错误与异常的超类。 
  - **Error** 类及其子类：程序中无法处理的错误，表示运行应用程序中出现了严重的错误。
  - **Exception** 程序本身可以捕获并且可以处理的异常。Exception 这种异常又分为两类：运行时异常和编译时异常。
- **运行时异常**

都是RuntimeException类及其子类异常，如NullPointerException(空指针异常)、IndexOutOfBoundsException(下标越界异常)等，这些异常是不检查异常，程序中可以选择捕获处理，也可以不处理。这些异常一般是由程序逻辑错误引起的，程序应该从逻辑角度尽可能避免这类异常的发生。

运行时异常的特点是Java编译器不会检查它，也就是说，当程序中可能出现这类异常，即使没有用try-catch语句捕获它，也没有用throws子句声明抛出它，也会编译通过。

- **非运行时异常** （编译异常）

是RuntimeException以外的异常，类型上都属于Exception类及其子类。从程序语法角度讲是必须进行处理的异常，如果不处理，程序就不能编译通过。如IOException、SQLException等以及用户自定义的Exception异常，一般情况下不自定义检查异常。 

![ ](https://www.pdai.tech/images/java/java-basic-exception-1.png)

#### 可查的异常（checked exceptions）和不可查的异常（unchecked exceptions）区别？

- **可查异常**（编译器要求必须处置的异常）：

正确的程序在运行中，很容易出现的、情理可容的异常状况。可查异常虽然是异常状况，但在一定程度上它的发生是可以预计的，而且一旦发生这种异常状况，就必须采取某种方式进行处理。

除了RuntimeException及其子类以外，其他的Exception类及其子类都属于可查异常。这种异常的特点是Java编译器会检查它，也就是说，当程序中可能出现这类异常，要么用try-catch语句捕获它，要么用throws子句声明抛出它，否则编译不会通过。

- **不可查异常**(编译器不要求强制处置的异常)

包括运行时异常（RuntimeException与其子类）和错误（Error）。

#### throw和throws的区别？

- **异常的申明(throws)**

在Java中，当前执行的语句必属于某个方法，Java解释器调用main方法执行开始执行程序。若方法中存在检查异常，如果不对其捕获，那必须在方法头中显式声明该异常，以便于告知方法调用者此方法有异常，需要进行处理。 在方法中声明一个异常，方法头中使用关键字throws，后面接上要声明的异常。若声明多个异常，则使用逗号分割。如下所示：

```Java
public static void method() throws IOException, FileNotFoundException{
    //something statements
}

```

- **异常的抛出(throw)**

如果代码可能会引发某种错误，可以创建一个合适的异常类实例并抛出它，这就是抛出异常。如下所示：

```Java
public static double method(int value) {
    if(value == 0) {
        throw new ArithmeticException("参数不能为0"); //抛出一个运行时异常
    }
    return 5.0 / value;
}
```

#### Java 7 的 try-with-resource?

如果你的资源实现了 AutoCloseable 接口，你可以使用这个语法。大多数的 Java 标准资源都继承了这个接口。当你在 try 子句中打开资源，资源会在 try 代码块执行后或异常处理后自动关闭。

```Java
public void automaticallyCloseResource() {
    File file = new File("./tmp.txt");
    try (FileInputStream inputStream = new FileInputStream(file);) {
        // use the inputStream to read a file
    } catch (FileNotFoundException e) {
        log.error(e);
    } catch (IOException e) {
        log.error(e);
    }
}
```

#### 异常的底层？

提到JVM处理异常的机制，就需要提及Exception Table，以下称为异常表。我们暂且不急于介绍异常表，先看一个简单的 Java 处理异常的小例子。

```Java
public static void simpleTryCatch() {
   try {
       testNPE();
   } catch (Exception e) {
       e.printStackTrace();
   }
}
```

使用javap来分析这段代码（需要先使用javac编译）：

```Java
//javap -c Main
 public static void simpleTryCatch();
    Code:
       0: invokestatic  #3                  // Method testNPE:()V
       3: goto          11
       6: astore_0
       7: aload_0
       8: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
      11: return
    Exception table:
       from    to  target type
           0     3     6   Class java/lang/Exception
```

看到上面的代码，应该会有会心一笑，因为终于看到了Exception table，也就是我们要研究的异常表。

异常表中包含了一个或多个异常处理者(Exception Handler)的信息，这些信息包含如下

- **from** 可能发生异常的起始点
- **to** 可能发生异常的结束点
- **target** 上述from和to之前发生异常后的异常处理者的位置
- **type** 异常处理者处理的异常的类信息





### 反射

#### 什么是反射机制?

   JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的法的功能称为java语言的反射机制。 

直接new对象就叫正射。

如下:

    Map<String, String> map = new HashMap<>();
    map.put("蔡徐鸡","唱跳rap篮球");

那反射是啥？我先不说反射是啥，概念啥的太虚幻我就不说了，把你绕蒙你这篇文章就白看了，直接举例吧

接着看上面的正射，如果哪天你发现用LinkedHashMap效果更好，然后你修改代码：

    Map<String, String> map = new LinkedHashMap<>();
    map.put("蔡徐鸡","唱跳rap篮球");

改完了编译运行没有bug然而过了两天你发现用LinkedHashMap会有隐患，还是得改回去用HashMap，成年人的崩溃如此简单，但是聪明的你想到可以加个判断，根据传入的条件来决定用HashMap还是LinkedHashMap，于是：

    public Map<String, String> getMap(String param) {
        Map<String, String> map = null;
        if (param.equals("HashMap")) {
            map = new HashMap<>();
        } else if (param.equals("LinkedHashMap")) {
            map = new LinkedHashMap<>();
         }
       return map;
     }

大功告成，这么难的逻辑都被你实现了，然后你得用TreeMap，你又要改代码。

有没有一种办法可以让你不修改代码呢，这时候反射就派上用场了。

**概念：反射是Java的一种机制，让我们可以在运行时获取类的信息**

**作用：通过反射，我们可以在程序运行时动态创建对象，还能获取到类的所有信息，比如它的属性、构造器、方法、注解等；**

直接举例吧：

```java
public Map<String, String> getMap(String className) {
    Class clazz = Class.forName(className);
    Constructor constructor = clazz.getConstructor();
    return (Map<String, String>) constructor.newInstance();
}
```

这时候不管你需要什么Map，只要实现了Map接口，你都能通过getMap获得，只需要传入对应Map的全限定名，例如java.util.HashMap / java.util.LinkedHashMap。

java中反射的用法非常非常多，常见的有以下这几个：

    一、在运行时获取一个类的 Class 对象
    二、在运行时构造一个类的实例化对象
    三、在运行时获取一个类的所有信息：变量、方法、构造器、注解

#### 一、获取class对象

三种方法
1、类名.class：这种获取方式只有在编译前已经声明了该类的类型才能获取到 Class 对象

    Class<HashMap> hashMap= HashMap.class;

2、实例.getClass()：通过实例化对象获取该实例的 Class 对象

    Map<String, String> hashMap = new HashMap<>();
    Class<? extends Map> hashMapClass = hashMap.getClass();

3、Class.forName(“类的全限定名”)：通过类的全限定名获取该类的 Class 对象

    Class<?> hashMap= Class.forName("java.util.HashMap");

拿到 Class对象就可以对它为所欲为了：调用它的方法、获取属性、获取类信息，总之它在你面前就没有隐私了，好羞羞，嘤~。

#### 二、构造类的实例化对象

通过反射构造一个类的实例方式有2种：
1、Class 对象调用newInstance()方法

    Class<?> hashMapClass = Class.forName("java.util.HashMap");
    HashMap hashMapInstance = (HashMap) hashMapClass.newInstance();

注意：即使 HashMap已经显式定义了构造方法，通过 newInstance() 创建的实例中，所有属性值都是对应类型的初始值，因为 newInstance() 构造实例会调用默认无参构造器。

2、Constructor 构造器调用newInstance()方法

    Class<?> hashMapClass = Class.forName("java.util.HashMap");
    Constructor<?> constructor = hashMapClass.getConstructor();
    constructor.setAccessible(true);
    HashMap newInstance = (HashMap) constructor.newInstance();

通过 getConstructor(Object… paramTypes) 方法指定获取指定参数类型的 Constructor， Constructor 调用 newInstance(Object… paramValues) 时传入构造方法参数的值，同样可以构造一个实例，且内部属性已经被赋值。

通过Class对象调用 newInstance() 会走默认无参构造方法，如果想通过显式构造方法构造实例，需要提前从Class中调用getConstructor()方法获取对应的构造器，通过构造器去实例化对象。

#### 三、获取类的所有信息

1、获取类中的变量（Field）

    Field[] getFields()：获取类中所有被public修饰的所有变量 Field getField(String
    name)：根据变量名获取类中的一个变量，该变量必须被public修饰 Field[]
    getDeclaredFields()：获取类中所有的变量，但无法获取继承下来的变量 Field
    getDeclaredField(String name)：根据姓名获取类中的某个变量，无法获取继承下来的变量

2、获取类中的方法（Method）

    Method[] getMethods()：获取类中被public修饰的所有方法
    Method getMethod(String name, Class…<?>
    paramTypes)：根据名字和参数类型获取对应方法，该方法必须被public修饰
    Method[] getDeclaredMethods()：获取所有方法，但无法获取继承下来的方法
    Method getDeclaredMethod(String name, Class…<?>
    paramTypes)：根据名字和参数类型获取对应方法，无法获取继承下来的方法

3、获取类的构造器（Constructor）

    Constuctor[] getConstructors()：获取类中所有被public修饰的构造器 Constructor
    getConstructor(Class…<?> paramTypes)：根据参数类型获取类中某个构造器，该构造器必须被public修饰
    Constructor[] getDeclaredConstructors()：获取类中所有构造器 Constructor
    getDeclaredConstructor(class…<?> paramTypes)：根据参数类型获取对应的构造器

反射的应用场景

    1、Spring 实例化对象：当程序启动时，Spring 会读取配置文件applicationContext.xml并解析出里面所有的标签实例化到IOC容器中。
    2、反射 + 工厂模式：通过反射消除工厂中的多个分支，如果需要生产新的类，无需关注工厂类，工厂类可以应对各种新增的类，反射可以使得程序更加健壮。
    3、JDBC连接数据库：使用JDBC连接数据库时，指定连接数据库的驱动类时用到反射加载驱动类

参考：https://blog.csdn.net/qq_33709582/article/details/113550163









### List







### Set









### Map





#### 为什么JDK1.8中HashMap从头插入改成尾插入

原文链接：https://blog.csdn.net/qq_35590459/article/details/108988011

JDK1.7中扩容时，每个元素的rehash之后，都会插入到新数组对应索引的链表头，所以这就导致原链表顺序为A->B->C，扩容之后，rehash之后的链表可能为C->B->A，元素的顺序发生了变化。在并发场景下，扩容时可能会出现循环链表的情况。而JDK1.8从头插入改成尾插入元素的顺序不变，避免出现循环链表的情况。

#### 为什么JDK1.8采用红黑树存储[Hash](https://so.csdn.net/so/search?q=Hash&spm=1001.2101.3001.7020)冲突的元素？

红黑树本质上是一棵二叉查找树，但它在二叉查找树的基础上增加了着色和相关的性质使得**红黑树相对平衡，从而保证了红黑树的查找、插入、删除的时间复杂度最坏为O(log n)。能够加快检索速率。**



#### 为什么在长度小于8时使用链表，不一直使用红黑树？

桶中元素的插入只会在hash冲突时发生，而hash冲突发生的概率较小，一直维护一个红黑树比链表耗费资源更多，在桶中元素量较小时没有这个必要。



#### 为什么要使用红黑树而不使用AVL树？

红黑树与AVLl树，在检索的时候效率差不多，都是通过平衡来二分查找。但红黑树不像avl树一样追求绝对的平衡，红黑树允许局部很少的不完全平衡，这样对于效率影响不大，但省去了很多没有必要的调平衡操作，avl树调平衡有时候代价较大，所以效率不如红黑树。



#### 为什么数组容量必须是2次幂？

索引计算公式为i = (n - 1) & hash，如果n为2次幂，那么n-1的低位就全是1，哈希值进行与操作时可以保证低位的值不变，从而保证分布均匀，效果等同于hash%n，但是位运算比取余运算要高效的多。



#### 为什么单链表转为红黑树要求桶内的元素个数大于8？

当hashCode离散性很好的时候，树型bin用到的概率非常小，因为数据均匀分布在每个bin中，几乎不会有bin中链表长度会达到阈值。但是在随机hashCode下，离散性可能会变差，然而JDK又不能阻止用户实现这种不好的hash算法，因此就可能导致不均匀的数据分布。不过理想情况下随机hashCode算法下所有bin中节点的分布频率会遵循泊松分布，而一个bin中链表长度达到8个元素的概率为0.00000006，几乎是不可能事件。

同理，少于8就从红黑树转回单链表是为了节省维护一个树的资源消耗，而选择8作为临界值，是因理想情况下一个bin中元素个数达到6的概率是0.00001316，达到7的概率为0.00000094，二者跨度较大，可以减小树和链表之间频繁转化的可能性。




### 数据结构

#### 数组

#### 链表

#### 栈

#### 队列

#### 二叉树

#### 红黑树

##### 1.简介

红黑树是一种自平衡的二叉查找树，是一种高效的查找树。红黑树具有良好的效率，它可在 O(logN) 时间内完成查找、增加、删除等操作。

##### 2.为什么需要红黑树？

对于二叉搜索树，如果插入的数据是随机的，那么它就是接近平衡的二叉树，平衡的二叉树，它的操作效率（查询，插入，删除）效率较高，时间复杂度是O（logN）。但是可能会出现一种极端的情况，那就是插入的数据是有序的（递增或者递减），那么所有的节点都会在根节点的右侧或左侧，此时，二叉搜索树就变为了一个链表，它的操作效率就降低了，时间复杂度为O(N)，所以可以认为二叉搜索树的时间复杂度介于O（logN）和O(N)之间，视情况而定。那么为了应对这种极端情况，红黑树就出现了，它是具备了某些特性的二叉搜索树，能解决非平衡树问题，红黑树是一种接近平衡的二叉树（说它是接近平衡因为它并没有像AVL树的平衡因子的概念，它只是靠着满足红黑节点的5条性质来维持一种接近平衡的结构，进而提升整体的性能，并没有严格的卡定某个平衡因子来维持绝对平衡）。

##### 3.红黑树的特性

首先，红黑树是一个二叉搜索树，它在每个节点增加了一个存储位记录节点的颜色，可以是RED,也可以是BLACK；通过任意一条从根到叶子简单路径上颜色的约束，**红黑树保证最长路径不超过最短路径的二倍，因而近似平衡（最短路径就是全黑节点，最长路径就是一个红节点一个黑节点，当从根节点到叶子节点的路径上黑色节点相同时，最长路径刚好是最短路径的两倍）**。它同时满足以下特性：

- 节点是**红色**或**黑色**

- 根是**黑色**

- 叶子节点（外部节点，空节点）都是**黑色，**这里的叶子节点指的是最底层的空节点（外部节点），下图中的那些null节点才是叶子节点，null节点的父节点在红黑树里不将其看作叶子节点

- 红色节点的子节点都是黑色；

  **红色**节点的父节点都是**黑色**；

  从根节点到叶子节点的所有路径上不能有 2 个连续的**红色**节点

- 从任一节点到叶子节点的所有路径都包含相同数目的**黑色**节点

![img](https://img-blog.csdnimg.cn/14c3c358dc3e4428b59add6dfe85b361.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5bCP5LiDbW9k,size_20,color_FFFFFF,t_70,g_se,x_16)



##### 4.红黑树的效率

红黑树的查找，插入和删除操作，时间复杂度都是O(logN)。

**查找操作时**，它和普通的相对平衡的二叉搜索树的效率相同，都是通过相同的方式来查找的，没有用到红黑树特有的特性。

但如果**插入的时候**是有序数据，那么红黑树的查询效率就比二叉搜索树要高了，因为此时二叉搜索树不是平衡树，它的时间复杂度O(N)。

**插入和删除操作**时，由于红黑树的每次操作平均要旋转一次和变换颜色，所以它比普通的二叉搜索树效率要低一点，不过时间复杂度仍然是O(logN)。总之，红黑树的优点就是对有序数据的查询操作不会慢到O(N)的时间复杂度。

红黑树和AVL树的比较：

- AVL树的时间复杂度虽然优于红黑树，但是对于现在的计算机，cpu太快，可以忽略性能差异
- 红黑树的**插入删除**比AVL树更便于控制操作
- 红黑树整体性能略优于AVL树（红黑树旋转情况少于AVL树）



#### 哈希表结构



### 常见的设计模式

#### 软件设计原则有哪些？

![](http://www.img.youngxy.top/Java/fig/%E8%AE%BE%E8%AE%A1%E5%8E%9F%E5%88%99.PNG)



#### 什么是设计模式？

设计模式（Design pattern）代表了最佳的实践，通常被有经验的⾯向对象的软件开发⼈员所采⽤。设计模式是软件开发⼈员在软件开发过程中⾯临的⼀般问题的解决⽅案。这些解决⽅案是众多软件开发⼈员经过相当⻓的⼀段时间的试验和错误总结出来的。

分为三大类：

**创建型**： 在创建对象的同时隐藏创建逻辑，不使⽤ new 直接实例化对象，程序在判断需要创建哪些对象时更灵活。包括⼯⼚/抽象⼯⼚/单例/建造者/原型模式。
**结构型**： 通过类和接⼝间的继承和引⽤实现创建复杂结构的对象。包括适配器/桥接模式/过滤器/组合/装饰器/外观/享元/代理模式。
**行为型**： 通过类之间不同通信⽅式实现不同⾏为。包括责任链/命名/解释器/迭代器/中介者/备忘录/观察者/状态/策略/模板/访问者模式。

#### 单例模式

单例模式属于创建型模式，⼀个单例类在任何情况下都只存在⼀个实例，构造⽅法必须是私有的、由自己创建⼀个静态变量存储实例，对外提供⼀个静态公有方法获取实例。

**双重检查锁（DCL， 即 double-checked locking）**
实现代码如下：

```Java
public class Singleton {
 
    // 1、私有化构造⽅法

    private Singleton() {

    }

    // 2、定义⼀个静态变量指向⾃⼰类型

    private volatile static Singleton instance;

    // 3、对外提供⼀个公共的⽅法获取实例

    public static Singleton getInstance() {

        // 第⼀重检查是否为 null

        if (instance == null) {

            // 使⽤ synchronized 加锁

            synchronized (Singleton.class) {

                // 第⼆重检查是否为 null
                if (instance == null) {

                    // new 关键字创建对象不是原⼦操作

                    instance = new Singleton();
                 }
             }
          }
            return instance;
        }
}
```

**优点：懒加载，线程安全，效率较⾼**
**缺点：实现较复杂**
这⾥的双重检查是指两次⾮空判断，锁指的是 synchronized 加锁，为什么要进⾏双重判断，其实很简单，第⼀重判断，如果实例已经存在，那么就不再需要进⾏同步操作，⽽是直接返回这个实例，如果没有创建，才会进⼊同步块，同步块的⽬的与之前相同，⽬的是为了防⽌有多个线程同时调⽤时，导致⽣成多个实例，有了同步块，每次只能有⼀个线程调⽤访问同步块内容，当第⼀个抢到锁的调⽤获取了实例之后，这个实例就会被创建，之后的所有调⽤都不会进⼊同步块，直接在第⼀重判断就返回了单例。关于内部的第⼆重空判断的作⽤，当多个线程⼀起到达锁位置时，进⾏锁竞争，其中⼀个线程获取锁，如果是第⼀次进⼊则为 null，会进⾏单例对象的创建，完成后释放锁，其他线程获取锁后就会被空判断拦截，直接返回已创建的单例对象。



#### 工厂模式

##### 说⼀说简单⼯⼚模式：

简单⼯⼚模式指由⼀个⼯⼚对象来创建实例，客户端不需要关注创建逻辑，只需提供传⼊⼯⼚的参数。

适⽤于⼯⼚类负责创建对象较少的情况，缺点是如果要增加新产品，就需要修改⼯⼚类的判断逻辑，违背开闭原则，且产品多的话会使⼯⼚类⽐较复杂。

Spring 中的 BeanFactory 使⽤简单⼯⼚模式，根据传⼊⼀个唯⼀的标识来获得 Bean 对象。



##### ⼯⼚⽅法模式了解吗：

和简单⼯⼚模式中⼯⼚负责⽣产所有产品相⽐，⼯⼚⽅法模式将⽣成具体产品的任务分发给具体的产品⼯⼚。

也就是定义⼀个抽象⼯⼚，其定义了产品的⽣产接⼝，但不负责具体的产品，将⽣产任务交给不同的派⽣类⼯⼚。这样不⽤通过指定类型来创建对象了。

##### 抽象⼯⼚模式了解吗：

简单⼯⼚模式和⼯⼚⽅法模式不管⼯⼚怎么拆分抽象，都只是针对⼀类产品，如果要⽣成另⼀种产品，就⽐较难办了！抽象⼯⼚模式通过在 AbstarctFactory 中增加创建产品的接⼝，并在具体⼦⼯⼚中实现新加产品的创建，当然前提是⼦⼯⼚⽀持⽣产该产品。否则继承的这个接⼝可以什么也不⼲。



#### 装饰器模式





#### 代理模式

##### 什么是代理模式？

代理模式的本质是⼀个中间件，主要⽬的是解耦合服务提供者和使⽤者。使⽤者通过代理间接的访问服务提供者，便于后者的封装和控制，是⼀种结构性模式。

##### 静态代理和动态代理的区别：

1. 灵活性 ：动态代理更加灵活，不需要必须实现接⼝，可以直接代理实现类，并且可以不需要针对每个⽬标类都创建⼀个代理类。另外，静态代理中，接⼝⼀旦新增加⽅法，⽬标对象和代理对象都要进⾏修改，这是⾮常麻烦的！

2. JVM 层⾯ ：静态代理在编译时就将接⼝、实现类、代理类这些都变成了⼀个个实际的 class ⽂件。⽽动态代理是在运⾏时动态⽣成类字节码，并加载到 JVM 中的。

##### 静态代理：

**静态代理中，我们对目标对象的每个方法的增强都是手动完成的（\*后面会具体演示代码\*），非常不灵活（\*比如接口一旦新增加方法，目标对象和代理对象都要进行修改\*）且麻烦(\*需要对每个目标类都单独写一个代理类\*）。** 实际应用场景非常非常少，日常开发几乎看不到使用静态代理的场景。

上面我们是从实现和应用角度来说的静态代理，从 JVM 层面来说， 静态代理在编译时就将接口、实现类、代理类这些都变成了一个个实际的 class 文件。

##### 动态代理：

相比于静态代理来说，动态代理更加灵活。我们不需要针对每个目标类都单独创建一个代理类，并且也不需要我们必须实现接口，我们可以直接代理实现类( *CGLIB 动态代理机制*)。

**从 JVM 角度来说，动态代理是在运行时动态生成类字节码，并加载到 JVM 中的。**

说到动态代理，Spring AOP、RPC 框架应该是两个不得不提的，它们的实现都依赖了动态代理。

**动态代理在我们日常开发中使用的相对较少，但是在框架中的几乎是必用的一门技术。学会了动态代理之后，对于我们理解和学习各种框架的原理也非常有帮助。**

就 Java 来说，动态代理的实现方式有很多种，比如 **JDK 动态代理**、**CGLIB 动态代理**等等。

###### JDK 动态代理机制

**在 Java 动态代理机制中 `InvocationHandler` 接口和 `Proxy` 类是核心。**

`Proxy` 类中使用频率最高的方法是：`newProxyInstance()` ，这个方法主要用来生成一个代理对象。

```
    public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h)
        throws IllegalArgumentException
    {
        ......
    }


这个方法一共有 3 个参数：

    loader :类加载器，用于加载代理对象。
    interfaces : 被代理类实现的一些接口；
    h : 实现了 InvocationHandler 接口的对象；
```

要实现动态代理的话，还必须需要实现`InvocationHandler` 来自定义处理逻辑。 当我们的动态代理对象调用一个方法时，这个方法的调用就会被转发到实现`InvocationHandler` 接口类的 `invoke` 方法来调用。

```
public interface InvocationHandler {

    /**
     * 当你使用代理对象调用方法的时候实际会调用到这个方法
     */
    public Object invoke(Object proxy, Method method, Object[] args)
        throws Throwable;
}

invoke() 方法有下面三个参数：

    proxy :动态生成的代理类
    method : 与代理类对象调用的方法相对应
    args : 当前 method 方法的参数
```

也就是说：**你通过`Proxy` 类的 `newProxyInstance()` 创建的代理对象在调用方法的时候，实际会调用到实现`InvocationHandler` 接口的类的 `invoke()`方法。** 你可以在 `invoke()` 方法中自定义处理逻辑，比如在方法执行前后做什么事情。



###### CGLIB 动态代理机制

**JDK 动态代理有一个最致命的问题是其只能代理实现了接口的类。**

**为了解决这个问题，我们可以用 CGLIB 动态代理机制来避免。**

CGLIB*Code Generation Library*)允许我们在运行时对字节码进行修改和动态生成。CGLIB 通过继承方式实现代理。例如 Spring 中的 AOP 模块中：如果目标对象实现了接口，则默认采用 JDK 动态代理，否则采用 CGLIB 动态代理。

**在 CGLIB 动态代理机制中 `MethodInterceptor` 接口和 `Enhancer` 类是核心。**

你需要自定义 `MethodInterceptor` 并重写 `intercept` 方法，`intercept` 用于拦截增强被代理类的方法。

```
public interface MethodInterceptor
extends Callback{
    // 拦截被代理类中的方法
    public Object intercept(Object obj, java.lang.reflect.Method method, Object[] args,MethodProxy proxy) throws Throwable;
}

    obj : 被代理的对象（需要增强的对象）
    method : 被拦截的方法（需要增强的方法）
    args : 方法入参
    proxy : 用于调用原始方法

```

你可以通过 `Enhancer`类来动态获取被代理类，当代理类调用方法的时候，实际调用的是 `MethodInterceptor` 中的 `intercept` 方法。

###### JDK 动态代理和 CGLIB 动态代理对比：

- **JDK 动态代理只能代理实现了接口的类或者直接代理接口，而 CGLIB 可以代理未实现任何接口的类。** 另外， CGLIB 动态代理是通过生成一个被代理类的子类来拦截被代理类的方法调用，因此不能代理声明为 final 类型的类和方法。
- 就二者的效率来说，大部分情况都是 JDK 动态代理更优秀，随着 JDK 版本的升级，这个优势更加明显。





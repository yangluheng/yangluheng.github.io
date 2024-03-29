---
lang: zh-CN
title: AQS
order: 3
description: Java

---



## 1.什么是AQS

AQS（AbstractQueuedSynchronizer），即队列同步器，它是构建锁或者其他同步组件的基础框架，如ReentrantLock、ReentrantReadWriteLock、Semaphore，CountDownLatch等。
AQS是一个抽象类，主要是通过继承方式使用，本身没有实现任何接口，仅仅是定义了同步状态的获取和释放的方法。AQS解决了实现同步器的大量细节问题，例如获取同步状态，FIFO队列，入队和出队。自定义同步器在实现时候只需要实现共享资源state的获取和释放即可，至于获取资源失败入队/唤醒出队等，AQS在顶层已经定义好了。

## 2.AQS的两种功能

从使用层面来说，AQS功能分为两种：独占和共享

- 独占锁，每次只能一个线程持有锁，比如ReentrantLock就是独占锁
- 共享锁，允许多个线程持有锁，并发访问共享资源，比如ReentrantReadWriteLock
- 共享锁和独占锁的释放有一定区别，前面部分是一致的，先判断头结点是不是signal状态，如果是则唤醒头节点的下一个节点，并将该节点设置为头结点。而共享锁不一样，某个节点被设置为head之后，如果它的后继节点是shared状态，那么会尝试使用doReleaseShared方法尝试唤醒节点，实现共享状态的传播。

## 3.AQS内部实现

AQS是依赖内部的同步队列实现，也就是FIFO双向队列，如果当前线程竞争锁失败，那么AQS会把当前线程以及等待状态封装成一个Node节点加入到同步队列中，同时阻塞该线程，当同步状态释放时，会把首节点唤醒，使其再次尝试获取同步状态。

AQS队列内部维护的是一个双向链表，这种结构每个数据都有两个指针，分别指向直接的的前驱节点和后继节点，当线程抢占锁失败时候，会封装成Node加入到AQS中去。

AQS 核心思想是，如果被请求的共享资源空闲，则将当前请求资源的线程设置为有效的工作线程，并且将共享资源设置为锁定状态。如果被请求的共享资源被占用，那么就需要一套线程阻塞等待以及被唤醒时锁分配的机制，这个机制 AQS 是用 **CLH 队列锁** 实现的，即将暂时获取不到锁的线程加入到队列中。

CLH(Craig,Landin,and Hagersten) 队列是一个虚拟的双向队列（虚拟的双向队列即不存在队列实例，仅存在结点之间的关联关系）。AQS 是将每条请求共享资源的线程封装成一个 CLH 锁队列的一个结点（Node）来实现锁的分配。在 CLH 同步队列中，一个节点表示一个线程，它保存着线程的引用（thread）、 当前节点在队列中的状态（waitStatus）、前驱节点（prev）、后继节点（next）。

CLH 队列结构如下图所示：

![](http://www.img.youngxy.top/Java/fig/AQS1.PNG)

在同步队列中，一个节点表示一个线程，他保存这线程的引用ThreadId，状态（watiStatus）,前驱结点（pre），后继节点（next），其数据结构如下：  

![](http://www.img.youngxy.top/Java/fig/AQS2.webp)

## 4.acquire方法流程总结

- 首先通过子类判断是否获取了锁，如果获取了就什么也不干。tryAcquire
- 如果没有获取锁、通过线程创建节点加入同步队列的队尾。addWaiter
- 当线程在同步队列中不断的通过自旋去获取同步状态，如果获取了锁，就把其设为同步队列中的头节点，否则在同步队列中不停的自旋等待获取同步状态 acquireQueued,shouldParkAfterFailedAcquire(Node pre,Node  node),parkAndCheckInterrupt()
- 如果在获取同步状态的过程中被中断过最后自行调用interrupted方法进行中断操作



## 5.AQS 底层使用了模板方法模式，你能说出几个需要重写的方法吗？

使用者继承 AbstractQueuedSynchronizer 并重写指定的方法。将 AQS 组合在自定义同步组件的实现中，并调用其模板方法，而这些模板方法会调用使用者重写的方法。

1. isHeldExclusively() ：该线程是否正在独占资源。只有用到 condition 才需要去实现它。
2. tryAcquire(int) ：独占方式。尝试获取资源，成功则返回 true，失败则返回 false。
3. tryRelease(int) ：独占方式。尝试释放资源，成功则返回 true，失败则返回 false。
4. tryAcquireShared(int) ：共享方式。尝试获取资源。负数表示失败；0 表示成功，但没有剩余可用资源；正数表示成功，且有剩余资源。
5. tryReleaseShared(int) ：共享方式。尝试释放资源，成功则返回 true，失败则返回 false。



## 6.总结

总结的来说：线程获取锁，如果获取了锁就保存当前获得锁的线程，如果没获取就创造一个节点通过compareAndSetTail(CAS操作)操作的方式将创建的节点加入同步队列的尾部，在同步队列中的节点通过自旋的操作不断去获取同步状态【当然由于FIFO先进先出的特性】等待时间越长就越先被唤醒。当头节点释放同步状态的时候，首先查看是否存在后继节点，如果存在就唤醒自己的后继节点，如果不存在就获取等待时间最长的符合条件的线程。  

参考：https://zhuanlan.zhihu.com/p/543902719
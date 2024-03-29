---
lang: zh-CN
title: Spring
order: 1
description: Java框架
---



## 1.AOP和IOC概念

AOP：AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理。

IOC： 控制反转是一种设计思想，而不是一个具体的技术实现。IoC 的思想就是将原本在程序中手动创建对象的控制权，交由 Spring 框架来管理。不过， IoC 并非 Spring 特有，在其他语言中也有应用。

**为什么叫控制反转？**

- **控制** ：指的是对象创建（实例化、管理）的权力
- **反转** ：控制权交给外部环境（Spring 框架、IoC 容器）

IOC容器的整体功能：

![](http://www.img.youngxy.top/Java/fig/ioc.png)

## 2.Bean的生命周期

Spring 容器可以管理 **singleton** 作用域 Bean 的生命周期，在此作用域下，Spring 能够精确地知道该 Bean 何时被创建，何时初始化完成，以及何时被销毁。

而对于 **prototype** 作用域的 Bean，Spring 只负责创建，当容器创建了 Bean 的实例后，Bean 的实例就交给客户端代码管理，Spring 容器将不再跟踪其生命周期。每次客户端请求 prototype 作用域的 Bean 时，Spring 容器都会创建一个新的实例，并且不会管那些被配置成 prototype 作用域的 Bean 的生命周期。

了解 Spring 生命周期的意义就在于，**可以利用 Bean 在其存活期间的指定时刻完成一些相关操作**。这种时刻可能有很多，但一般情况下，会在 Bean 被初始化后和被销毁前执行一些相关操作。

**Spring 容器中 Bean 的生命周期流程：**

![](http://www.img.youngxy.top/Java/fig/bean.png)

- 如果 BeanFactoryPostProcessor和Bean关联, 则调用postProcessBeanFactory方法。(即首**先尝试从Bean工厂中获取Bean**)

- 如果 InstantiationAwareBeanPostProcessor和Bean关联，则调用postProcessBeforeInstantiation方法。

- 根据配置情况调用 Bean 构造方法**实例化 Bean**。

- 利用依赖注入完成 Bean 中所有**属性值的配置注入**。

- 如果 InstantiationAwareBeanPostProcessor和Bean关联，则调用postProcessAfterInstantiation方法和postProcessProperties。

- **调用xxxAware接口** (上图只是给了几个例子) 

  **第一类Aware接口**

  （1）如果 Bean 实现了 BeanNameAware 接口，则 Spring 调用 Bean 的 setBeanName() 方法传入当前 Bean 的 id 值。

  （2）如果 Bean 实现了 BeanClassLoaderAware 接口，则 Spring 调用 setBeanClassLoader() 方法传入classLoader的引用。

  （3）如果 Bean 实现了 BeanFactoryAware 接口，则 Spring 调用 setBeanFactory() 方法传入当前工厂实例的引用。

  **第二类Aware接口**

  （1）如果 Bean 实现了 EnvironmentAware 接口，则 Spring 调用 setEnvironment() 方法传入当前 Environment 实例的引用。

  （2）如果 Bean 实现了 EmbeddedValueResolverAware 接口，则 Spring 调用 setEmbeddedValueResolver() 方法传入当前 StringValueResolver 实例的引用。

  （3）如果 Bean 实现了 ApplicationContextAware 接口，则 Spring 调用 setApplicationContext() 方法传入当前 ApplicationContext 实例的引用。

- 如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用该接口的预初始化方法 。**postProcessBeforeInitialzation() 对 Bean 进行加工操作，此处非常重要，Spring 的 AOP 就是利用它实现的。**
- 如果 Bean 实现了 InitializingBean 接口，则 Spring 将调用 afterPropertiesSet() 方法。(或者有执行@PostConstruct注解的方法)。
- 如果在配置文件中通过 **init-method** 属性指定了初始化方法，则调用该初始化方法。
- 如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用该接口的初始化方法 postProcessAfterInitialization()。此时，Bean 已经可以被应用系统使用了。
- 如果在 `<bean>` 中指定了该 Bean 的作用范围为 scope="singleton"，则将该 Bean 放入 Spring IoC 的缓存池中，将触发 Spring 对该 Bean 的生命周期管理；如果在 `<bean>` 中指定了该 Bean 的作用范围为 scope="prototype"，则将该 Bean 交给调用者，调用者管理该 Bean 的生命周期，Spring 不再管理该 Bean。
- 如果 Bean 实现了 DisposableBean 接口，则 Spring 会调用 destory() 方法将 Spring 中的 Bean 销毁；(或者有执行@PreDestroy注解的方法)。
- 如果在配置文件中通过 **destory-method** 属性指定了 Bean 的销毁方法，则 Spring 将调用该方法对 Bean 进行销毁。

**简化版：**

![](http://www.img.youngxy.top/Java/fig/bean%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F.webp)

参考：https://zhuanlan.zhihu.com/p/562198754



## 3.MVC的基本流程

简单来说：

客户端发送请求-> 前端控制器 DispatcherServlet 接受客户端请求 -> 找到处理器映射  HandlerMapping 解析请求对应的 Handler -> HandlerAdapter 会根据 Handler  来调用真正的处理器来处理请求，并处理相应的业务逻辑 -> 处理器返回一个模型视图 ModelAndView -> 视图解析器进行解析 -> 返回一个视图对象 -> 前端控制器 DispatcherServlet 渲染数据（Model）->  将得到视图对象返回给用户。

![image-20210608002334025](https://image.iamshuaidi.com/picture/image-20210608002334025.png)



上图用于辅助理解，面试时可用下列 8 步描述 SpringMVC 运行流程：

1. 用户向服务器发送请求，请求被 Spring 前端DispatcherServlet 捕获；
2. DispatcherServlet 对请求 URL 进行解析，得到请求资源标识符（URI）。然后根据该 URI，调用  HandlerMapping 获得该 Handler 配置的所有相关的对象（包括 Handler 对象以及 Handler  对象对应的拦截器），最后以 HandlerExecutionChain 对象的形式返回；
3. DispatcherServlet 根据获得的 Handler，选择一个合适的HandlerAdapter；（附注：如果成功获得 HandlerAdapter 后，此时将开始执行拦截器的 preHandler(…)方法）
4. 提取 Request 中的模型数据，填充 Handler 入参，开始执行Handler（Controller)。在填充 Handler 的入参过程中，根据你的配置，Spring 将帮你做一些额外的工作：

（1）HttpMessageConveter：将请求消息（如：Json、xml 等数据）转换成一个对象，将对象转换为指定的响应信息；

（2）数据转换：对请求消息进行数据转换。如：String 转换成 Integer、Double 等；

（3）数据格式化：对请求消息进行数据格式化。如：将字符串转换成格式化数字或格式化日期等；

（4）数据验证：验证数据的有效性（长度、格式等），验证结果存储到 BindingResult 或 Error 中;

5.Handler 执行完成后，向 DispatcherServlet 返回一个 ModelAndView 对象；

6.根据返回的 ModelAndView，选择一个适合的 ViewResolver（必须是已经注册到 Spring 容器中的 ViewResolver)返回给DispatcherServlet；

7.ViewResolver 结合 Model 和 View，来渲染视图；

8.将渲染结果返回给客户端。



## 4.Spring的设计模式

1. 工厂设计模式 : Spring 使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象；
2. 代理设计模式 : Spring AOP 功能的实现；
3. 单例设计模式 : Spring 中的 Bean 默认都是单例的；
4. 模板方法模式 : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式；
5. 包装器设计模式 : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源；
6. 观察者模式：Spring 事件驱动模型就是观察者模式很经典的一个应用；
7. 适配器模式：Spring AOP 的增强或通知(Advice)使用到了适配器模式、SpringMVC 中也是用到了适配器模式适配 Controller。



## 5.Spring事务机制

### 5.1谈谈你对 Spring 中的事务的理解？

事务是逻辑上的一组操作，要么都执行，要么都不执行。

**事务特性**

原子性：事务是最小的执行单位，不允许分割。事务的原子性确保动作要么全部完成，要么完全不起作用；

一致性：执行事务前后，数据保持一致；

隔离性：并发访问数据库时，一个用户的事物不被其他事物所干扰，各并发事务之间数据库是独立的；

持久性: 一个事务被提交之后。它对数据库中数据的改变是持久的，即使数据库发生故障也不应该对其有任何影响。

**Spring 事务管理接口**

1. PlatformTransactionManager：（平台）事务管理器；
2. TransactionDefinition：事务定义信息（事务隔离级别、传播行为、超时、只读、回滚规则）；
3. TransactionStatus：事务运行状态；

所谓事务管理，其实就是“按照给定的事务规则来执行提交或者回滚操作”。



### 5.2Spring 中的事务隔离级别？

TransactionDefinition 接口中定义了五个表示隔离级别的常量：

TransactionDefinition.ISOLATION_DEFAULT：使用后端数据库默认的隔离级别，MySQL 默认采用的 REPEATABLE_READ 隔离级别 Oracle 默认采用的 READ_COMMITTED 隔离级别；

TransactionDefinition.ISOLATION_READ_UNCOMMITTED：最低的隔离级别，允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读；

TransactionDefinition.ISOLATION_READ_COMMITTED：允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生；

TransactionDefinition.ISOLATION_REPEATABLE_READ：对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生；

TransactionDefinition.ISOLATION_SERIALIZABLE：最高的隔离级别，完全服从 ACID  的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。但是这将严重影响程序的性能。通常情况下也不会用到该级别。



### 5.3Spring 中的事物传播行为？

事务传播行为是为了解决业务层方法之间互相调用的事务问题。当事务方法被另一个事务方法调用时，必须指定事务应该如何传播。例如：方法可能继续在现有事务中运行，也可能开启一个新事务，并在自己的事务中运行。在 TransactionDefinition 定义中包括了如下几个表示传播行为的常量：

- **支持当前事务的情况：**

TransactionDefinition.PROPAGATION_REQUIRED：如果当前存在事务，则加入该事务；如果当前没有事务，则创建一个新的事务；

TransactionDefinition.PROPAGATION_SUPPORTS：如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行；

TransactionDefinition.PROPAGATION_MANDATORY：如果当前存在事务，则加入该事务；如果当前没有事务，则抛出异常。

- **不支持当前事务的情况：**

TransactionDefinition.PROPAGATION_REQUIRES_NEW：创建一个新的事务，如果当前存在事务，则把当前事务挂起；

TransactionDefinition.PROPAGATION_NOT_SUPPORTED：以非事务方式运行，如果当前存在事务，则把当前事务挂起。

TransactionDefinition.PROPAGATION_NEVER：以非事务方式运行，如果当前存在事务，则抛出异常。

- **其他情况：**

TransactionDefinition.PROPAGATION_NESTED：如果当前存在事务，则创建一个事务作为当前事务的嵌套事务来运行；如果当前没有事务，则该取值等价于 TransactionDefinition.PROPAGATION_REQUIRED。



## 6.Spring如何解决循环依赖问题？

了解问题的本质再分析问题，往往更利于对问题有更深入的了解和研究。**所以我们在分析 Spring 关于循环依赖的源码之前，先要了解下什么是循环依赖。**

### 6.1循环依赖的概念

![img](https://image.iamshuaidi.com/picture/v2-dcc3be57d2f88cc011165231c40122d8_720w.jpg)



- 循环依赖分为三种，自身依赖于自身、互相循环依赖、多组循环依赖。
- 但无论循环依赖的数量有多少，循环依赖的本质是一样的。就是你的完整创建依赖于我，而我的完整创建也依赖于你，但我们互相没法解耦，最终导致依赖创建失败。
- 所以 Spring 提供了除了构造函数注入和原型注入外的，setter循环依赖注入解决方案。那么我们也可以先来尝试下这样的依赖，如果是我们自己处理的话该怎么解决。

### 6.2问题体现

```java
public class ABTest {
    public static void main(String[] args) {
        new ClazzA();
    }
}

class ClazzA {
    private ClazzB b = new ClazzB();
}

class ClazzB {
    private ClazzA a = new ClazzA();
}


```

### 6.3解决方案

整个解决循环依赖的核心内容，A 创建后填充属性时依赖 B，那么就去创建 B，在创建 B 开始填充时发现依赖于 A，但此时 A 这个半成品对象已经存放在缓存到`singletonObjects` 中了，所以 B 可以正常创建，在通过递归把 A 也创建完整了。

### 6.4Spring解决

#### 6.4.1setter注入的方式

- Spring默认是通过setter注入的方式来注入bean的依赖属性的。
- 在实例化一个bean时,Spring会先创建这个bean的实例,然后再通过set方法为其设置属性。
- 如果此时有循环依赖,例如A依赖B,B依赖A。Spring会先完成A和B两个bean的实例化,使其处于“半初始化”状态。
- 然后Spring会调用A的set方法设置其依赖的B的属性,此时B已实例化,可以被注入。
- 同样地,Spring又会调用B的set方法设置其依赖的A的属性,此时A也已实例化,可以被注入。
- 通过这种“提前实例化,推迟设置属性”的方式,Spring使得两个有循环依赖的bean都先实例化,然后再相互设置对方的属性,这样就巧妙地避免了循环依赖的问题。
- 所以Spring的setter注入方式可以很好的解决循环依赖,这也是Spring默认选择的注入方式。

所以,简单来说,Spring通过先实例化,再通过set方法设置属性的setter注入方式,实现了在实例化阶段就将bean初始化,而将属性填充推迟到后面,这样就可以顺利解决循环依赖的问题。这是Spring容器很关键的一个设计。

#### 6.4.2三级缓存的方式

（1）一级缓存能解决吗？

![img](https://image.iamshuaidi.com/picture/v2-ccb36cabfd45ce428bd64416d0b82752_720w.jpg)



- 其实只有一级缓存并不是不能解决循环依赖，就像我们自己做的例子一样。
- 但是在 Spring 中如果像我们例子里那么处理，就会变得非常麻烦，而且也可能会出现 NPE 问题。
- 所以如图按照 Spring 中代码处理的流程，我们去分析一级缓存这样存放成品 Bean 的流程中，是不能解决循环依赖的问题的。因为 A 的成品创建依赖于 B，B的成品创建又依赖于 A，当需要补全B的属性时 A 还是没有创建完，所以会出现死循环。



（2） 二级缓存能解决吗？

![img](https://image.iamshuaidi.com/picture/v2-a05bd6e83c73b2b082a5c8916064a00c_720w.jpg)



- 有了二级缓存其实这个事处理起来就容易了，一个缓存用于存放成品对象，另外一个缓存用于存放半成品对象。
- A 在创建半成品对象后存放到缓存中，接下来补充 A 对象中依赖 B 的属性。
- B 继续创建，创建的半成品同样放到缓存中，在补充对象的 A 属性时，可以从半成品缓存中获取，现在 B 就是一个完整对象了，而接下来像是递归操作一样 A 也是一个完整对象了。



（3） 三级缓存解决什么？

![img](https://image.iamshuaidi.com/picture/v2-f71dd02ea011bdf372636af76b7c5b8a_720w.jpg)



有了二级缓存都能解决 Spring 依赖了，怎么要有三级缓存呢。其实我们在前面分析源码时也提到过，三级缓存主要是解决 Spring AOP 的特性。AOP 本身就是对方法的增强，是 `ObjectFactory<?>` 类型的 lambda 表达式，而 Spring 的原则又不希望将此类类型的 Bean 前置创建，所以要存放到三级缓存中处理。

其实整体处理过程类似，唯独是 B 在填充属性 A 时，先查询成品缓存、再查半成品缓存，最后在看看有没有单例工程类在三级缓存中。最终获取到以后调用 getObject 方法返回代理引用或者原始引用。

至此也就解决了 Spring AOP 所带来的三级缓存问题。*本章节涉及到的 AOP 依赖有源码例子，可以进行调试*。

（4）总结

- 回顾本文基本以实际操作的例子开始，引导大家对循环依赖有一个整体的认识，也对它的解决方案可以上手的例子，这样对后续的关于 Spring 对循环依赖的解决也就不会那么陌生了。
- 通篇全文下来大家也可以看到，三级缓存并不是非必须不可，只不过在满足 Spring 自身创建的原则下，是必须的。如果你可以下载 Spring 源码对这部分代码进行改动下，提前创建 AOP 对象保存到缓存中，那么二级缓存一样可以解决循环依赖问题。


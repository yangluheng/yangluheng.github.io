---
lang: zh-CN
title: 框架
order: 4
description: Java框架
---



## 四：Java高级：Spring、SpringMVC、Spring Boot、MyBatis

### AOP和IOC概念

AOP：AOP(Aspect-Oriented Programming:面向切面编程)能够将那些与业务无关，却为业务模块所共同调用的逻辑或责任（例如事务处理、日志管理、权限控制等）封装起来，便于减少系统的重复代码，降低模块间的耦合度，并有利于未来的可拓展性和可维护性。

Spring AOP 就是基于动态代理的，如果要代理的对象，实现了某个接口，那么 Spring AOP 会使用 **JDK Proxy**，去创建代理对象，而对于没有实现接口的对象，就无法使用 JDK Proxy 去进行代理了，这时候 Spring AOP 会使用 **Cglib** 生成一个被代理对象的子类来作为代理。

IOC： 是一种设计思想，而不是一个具体的技术实现。IoC 的思想就是将原本在程序中手动创建对象的控制权，交由 Spring 框架来管理。不过， IoC 并非 Spring 特有，在其他语言中也有应用。

**为什么叫控制反转？**

- **控制** ：指的是对象创建（实例化、管理）的权力
- **反转** ：控制权交给外部环境（Spring 框架、IoC 容器）



### Bean的生命周期





### MVC的基本流程

简单来说：客户端发送请求-> 前端控制器 DispatcherServlet 接受客户端请求 -> 找到处理器映射  HandlerMapping 解析请求对应的 Handler -> HandlerAdapter 会根据 Handler  来调用真正的处理器来处理请求，并处理相应的业务逻辑 -> 处理器返回一个模型视图 ModelAndView -> 视图解析器进行解析 -> 返回一个视图对象 -> 前端控制器 DispatcherServlet 渲染数据（Model）->  将得到视图对象返回给用户。

![image-20210608002334025](https://image.iamshuaidi.com/picture/image-20210608002334025.png)



上图用于辅助理解，面试时可用下列 8 步描述 SpringMVC 运行流程：

1. 用户向服务器发送请求，请求被 Spring 前端控制Servelt DispatcherServlet 捕获；
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



### Spring的设计模式

1. 工厂设计模式 : Spring 使用工厂模式通过 BeanFactory、ApplicationContext 创建 bean 对象；
2. 代理设计模式 : Spring AOP 功能的实现；
3. 单例设计模式 : Spring 中的 Bean 默认都是单例的；
4. 模板方法模式 : Spring 中 jdbcTemplate、hibernateTemplate 等以 Template 结尾的对数据库操作的类，它们就使用到了模板模式；
5. 包装器设计模式 : 我们的项目需要连接多个数据库，而且不同的客户在每次访问中根据需要会去访问不同的数据库。这种模式让我们可以根据客户的需求能够动态切换不同的数据源；
6. 观察者模式：Spring 事件驱动模型就是观察者模式很经典的一个应用；
7. 适配器模式：Spring AOP 的增强或通知(Advice)使用到了适配器模式、SpringMVC 中也是用到了适配器模式适配 Controller。



### Spring事务机制

#### 谈谈你对 Spring 中的事务的理解？

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



#### Spring 中的事务隔离级别？

TransactionDefinition 接口中定义了五个表示隔离级别的常量：

TransactionDefinition.ISOLATION_DEFAULT：使用后端数据库默认的隔离级别，MySQL 默认采用的 REPEATABLE_READ 隔离级别 Oracle 默认采用的 READ_COMMITTED 隔离级别；

TransactionDefinition.ISOLATION_READ_UNCOMMITTED：最低的隔离级别，允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读；

TransactionDefinition.ISOLATION_READ_COMMITTED：允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生；

TransactionDefinition.ISOLATION_REPEATABLE_READ：对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生；

TransactionDefinition.ISOLATION_SERIALIZABLE：最高的隔离级别，完全服从 ACID  的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。但是这将严重影响程序的性能。通常情况下也不会用到该级别。



#### Spring 中的事物传播行为？

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



### Spring如何解决循环依赖问题？

了解问题的本质再分析问题，往往更利于对问题有更深入的了解和研究。**所以我们在分析 Spring 关于循环依赖的源码之前，先要了解下什么是循环依赖。**

**1. 循环依赖的概念**

![img](https://image.iamshuaidi.com/picture/v2-dcc3be57d2f88cc011165231c40122d8_720w.jpg)



- 循环依赖分为三种，自身依赖于自身、互相循环依赖、多组循环依赖。
- 但无论循环依赖的数量有多少，循环依赖的本质是一样的。就是你的完整创建依赖于我，而我的完整创建也依赖于你，但我们互相没法解耦，最终导致依赖创建失败。
- 所以 Spring 提供了除了构造函数注入和原型注入外的，setter循环依赖注入解决方案。那么我们也可以先来尝试下这样的依赖，如果是我们自己处理的话该怎么解决。

**2. 问题体现**

```
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

**3.解决方案**

整个解决循环依赖的核心内容，A 创建后填充属性时依赖 B，那么就去创建 B，在创建 B 开始填充时发现依赖于 A，但此时 A 这个半成品对象已经存放在缓存到`singletonObjects` 中了，所以 B 可以正常创建，在通过递归把 A 也创建完整了。

**4.Spring解决**

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

至此也就解决了 Spring AOP 所带来的三级缓存问题。*本章节涉及到的 AOP 依赖有源码例子，可以进行调试*

（4）总结

- 回顾本文基本以实际操作的例子开始，引导大家对循环依赖有一个整体的认识，也对它的解决方案可以上手的例子，这样对后续的关于 Spring 对循环依赖的解决也就不会那么陌生了。
- 通篇全文下来大家也可以看到，三级缓存并不是非必须不可，只不过在满足 Spring 自身创建的原则下，是必须的。如果你可以下载 Spring 源码对这部分代码进行改动下，提前创建 AOP 对象保存到缓存中，那么二级缓存一样可以解决循环依赖问题。



### Spring Boot自动配置原理

在Spring程序main方法中，添加@SpringBootApplication或者@EnableAutoConfiguration会自动去maven中读取每个starter中的spring.factories文件，该文件里配置了所有需要被创建的Spring容器中的bean。Spring Boot 通过`@EnableAutoConfiguration`开启自动装配，通过 SpringFactoriesLoader 最终加载`META-INF/spring.factories`中的自动配置类实现自动装配，自动配置类其实就是通过`@Conditional`按需加载的配置类，想要其生效必须引入`spring-boot-starter-xxx`包实现起步依赖。

```
第 1 步:
判断自动装配开关是否打开。默认spring.boot.enableautoconfiguration=true，可在 application.properties 或 application.yml 中设置
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77aa6a3727ea4392870f5cccd09844ab~tplv-k3u1fbpfcp-watermark.image)



```
第 2 步 ：
用于获取EnableAutoConfiguration注解中的 exclude 和 excludeName。
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d6ec93bbda1453aa08c52b49516c05a~tplv-k3u1fbpfcp-zoom-1.image)



```
第 3 步：
获取需要自动装配的所有配置类，读取META-INF/spring.factories：

spring-boot/spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring.factories
```

![img](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/58c51920efea4757aa1ec29c6d5f9e36~tplv-k3u1fbpfcp-watermark.image)



```
从下图可以看到这个文件的配置内容都被我们读取到了。XXXAutoConfiguration的作用就是按需加载组件。
不光是这个依赖下的META-INF/spring.factories被读取到，所有 Spring Boot Starter 下的META-INF/spring.factories都会被读取到。
```

![img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94d6e1a060ac41db97043e1758789026~tplv-k3u1fbpfcp-watermark.image)

参考：https://javaguide.cn/system-design/framework/spring/spring-boot-auto-assembly-principles.html#autoconfigurationimportselector-%E5%8A%A0%E8%BD%BD%E8%87%AA%E5%8A%A8%E8%A3%85%E9%85%8D%E7%B1%BB





### Spring Boot 加载配置文件的优先级了解么？

项目启动后扫描顺序：

1）先去项目根目录找config文件夹下找配置文件件
 2）再去根目录下找配置文件
 3）去resources下找cofnig文件夹下找配置文件
 4）去resources下找配置文件



![在这里插入图片描述](https://img-blog.csdnimg.cn/bdd2d57bf7ca4c0f90d5fbb9b8add8f9.png?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,shadow_50,text_Q1NETiBA5ZC56ICB5biI,size_20,color_FFFFFF,t_70,g_se,x_16)



### 如何使用 Spring Boot 实现全局异常处理？

https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485568&idx=2&sn=c5ba880fd0c5d82e39531fa42cb036ac&chksm=cea2474bf9d5ce5dcbc6a5f6580198fdce4bc92ef577579183a729cb5d1430e4994720d59b34&token=1729829670&lang=zh_CN#rd



- 使用 `@ControllerAdvice` 和 `@ExceptionHandler` 处理全局异常
- `@ExceptionHandler` 处理 Controller 级别的异常

例子：

```
CustomException：

public class CustomException extends RuntimeException {

    private AppHttpCodeEnum appHttpCodeEnum;

    public CustomException(AppHttpCodeEnum appHttpCodeEnum){
        this.appHttpCodeEnum = appHttpCodeEnum;
    }

    public AppHttpCodeEnum getAppHttpCodeEnum() {
        return appHttpCodeEnum;
    }
}

```

```
ExceptionCatch：



@ControllerAdvice  //控制器增强类
@Slf4j
public class ExceptionCatch {

    /**
     * 处理不可控异常
     * @param e
     * @return
     */
    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseResult exception(Exception e){
        e.printStackTrace();
        log.error("catch exception:{}",e.getMessage());

        return ResponseResult.errorResult(AppHttpCodeEnum.SERVER_ERROR);
    }

    /**
     * 处理可控异常  自定义异常
     * @param e
     * @return
     */
    @ExceptionHandler(CustomException.class)
    @ResponseBody
    public ResponseResult exception(CustomException e){
        log.error("catch exception:{}",e);
        return ResponseResult.errorResult(e.getAppHttpCodeEnum());
    }
}

```



### 核心配置文件

SpringBoot的核心配置文件是application和bootstrap配置文件。

application配置文件这个容易理解，主要用于Spring Boot项目的自动化配置。

bootstrap配置文件有以下几个应用场景：

- 使用Spring Cloud Config配置中心时，这时需要在bootstrap配置文件中添加连接到配置中心的配置属性来加载外部配置中心的配置信息；
- 一些固定的不能被覆盖的属性；
- 一些加密/解密的场景；





### 实现热部署的方式

这可以使用 DEV 工具来实现。通过这种依赖关系，您可以节省任何更改，嵌入式tomcat 将重新启动。Spring Boot  有一个开发工具（DevTools）模块，它有助于提高开发人员的生产力。Java  开发人员面临的一个主要挑战是将文件更改自动部署到服务器并自动重启服务器。开发人员可以重新加载 Spring Boot  上的更改，而无需重新启动服务器。这将消除每次手动部署更改的需要。Spring Boot  在发布它的第一个版本时没有这个功能。这是开发人员最需要的功能。DevTools 模块完全满足开发人员的需求。该模块将在生产环境中被禁用。它还提供 H2 数据库控制台以更好地测试应用程序。

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```



### 监视器和监听器

#### 监听器

监听器也叫listener，是servlet的监听器，可以用于监听web应用程序中某些对象的创建、销毁、增加、修改、删除等动作的发生，然后做出相应的响应处理。当范围对象的状态发生变化时，服务器自动调用监听器对象中的方法，常用于系统加载时进行信息初始化，统计在线人数和在线用户，统计网站的访问量。 配置监听器的方法：

- 　　通过@Component把监听器加入Spring容器中管理;
- 　　在application.properties中添加context.listener.classes配置;
- 　　在方法上加@EventListener注解;

#### 监控器

**actuator**

```
 这是springboot程序的监控系统，可以实现健康检查，info信息等。在使用之前需要引入`spring-boot-starter-actuator`，并做简单的配置即可。
 引入依赖并编写好配置之后，启动项目，访问http://localhost:8080/actuator
```

Spring Boot自带监控组件—Actuator，它可以帮助实现对程序内部运行情况的监控。Actuator轻松实现应用程序的监控治理，比如健康状况、审计、统计和HTTP追踪、Bean加载情况、环境变量、日志信息、线程信息等。
Actuator的核心是端点（Endpoint），它用来监视、提供应用程序的信息，Spring Boot提供的spring-boot-actuator组件中已经内置了非常多的Endpoint（health、info、beans、metrics、httptrace、shutdown等），每个端点都可以启用和禁用。



### 什么是Spring Boot Starter？有哪些常用的？

和自动配置一样，Spring Boot Starter的目的也是简化配置，而Spring Boot Starter解决的是依赖管理配置复杂的问题，有了它，当我需要构建一个Web应用程序时，不必再遍历所有的依赖包，一个一个地添加到项目的依赖管理中，而是只需要一个配置spring-boot-starter-web。

常用的：

- spring-boot-starter-web - Web 和 RESTful 应用程序
- spring-boot-starter-test - 单元测试和集成测试

**spring-boot-starter-parent有什么作用？**

我们知道，新建一个SpringBoot项目，默认都是有parent的，这个parent就是spring-boot-starter-parent，spring-boot-starter-parent主要有如下作用：

- 定义了Java编译版本
- 使用UTF-8格式编码
- 继承自spring-boor-dependencies，这里面定义了依赖的版本，也正是因为继承了这个依赖，所以我们在写依赖时才不需要写版本号
- 执行打包操作的配置
- 自动化的资源过滤
- 自动化的插件配置



### Spring Boot四大核心组件

四大组件分别是：starter， autoconfigure, CLI 以及actuator。

autoconfigure在我们的开发中并不会被感知，因为它是存在与我们的starter中的。所以我们的每个starter都是依赖autoconfigure的。

Spring Boot CLI是一个命令行使用Spring Boot的客户端工具；主要功能如下：

- 运行groovy脚本 => `官网2.1`
- 打包groovy文件到jar => `官网2.3`
- 初始化Spring Boot项目 => `官网2.4`
- 其他

actuator是Spring Boot的监控插件，本身提供了很多接口可以获取当前项目的各项运行状态指标。



### MyBatis Dao接口原理



### MyBatis分页原理 

![img](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9waWM0LnpoaW1nLmNvbS84MC92Mi01ZWY4YzU3ZDFiYjI5YTk4Yzc3MTc1YmU2MzI3MDJjMl83MjB3LmpwZw?x-oss-process=image/format,png)

**总结一下：**

- 通过page对象作为分页依据
- 通过count来进行查询总条数的限制
- 对原sql通过limit来进行分页的效果

参考：https://blog.csdn.net/xiaolegeaizy/article/details/108461284

#### MyBatis 是如何进行分页的？分页插件的原理是什么？

答：

**(1)** MyBatis 使用 RowBounds 对象进行分页，它是针对 ResultSet 结果集执行的内存分页，而非物理分页；

**(2)** 可以在 sql 内直接书写带有物理分页的参数来完成物理分页功能；

**(3)** 也可以使用分页插件来完成物理分页。

分页插件的基本原理是使用 MyBatis 提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行的 sql，然后重写 sql，根据 dialect 方言，添加对应的物理分页语句和物理分页参数。

```
举例： select _ from student ，拦截 sql 后重写为： select t._ from （select \* from student）t limit 0，10
```

MyBatis 使用 JDK 的动态代理，为需要拦截的接口生成代理对象以实现接口方法拦截功能，每当执行接口对象的方法时，就会进入拦截方法，具体就是 `InvocationHandler` 的 `invoke()` 方法，当然，只会拦截那些指定需要拦截的方法。

实现 MyBatis 的 `Interceptor` 接口并复写 `intercept()` 方法，然后在给插件编写注解，指定要拦截哪一个接口的哪些方法即可，在配置文件中配置编写的插件。





### MyBatis缓存机制(一级缓存、二级缓存、三级缓存)

##### 一级缓存：

作用域是同一个 SqlSession，在同一个 sqlSession 中两次执行相同的 sql 语句，
第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从缓存中获取,从而提高查询效率。当一个 sqlSession 结束后该 sqlSession 中的 一级缓存也就不存在了。**Mybatis 默认开启一级缓存。**
一级缓存内部存储使用一个 HashMap，key 为 hashCode+sqlId+Sql 语句。value 为 从查询出来映射生成的 java 对象 sqlSession 执行 insert、update、delete 等操作 commit 提交后会清空缓存区域。

##### 二级缓存：

是多个 SqlSession 共享的，其作用域是 mapper 的同一个 namespace，不同 的 sqlSession 两次执行相同 namespace 下的 sql 语句且向 sql 中传递参数也相同即最终执行 相同的 sql 语句，第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从 缓存中获取数据将不再从数据库查询，从而提高查询效率。Mybatis 默认没有开启二级缓存 需要在 setting 全局参数中配置开启二级缓存。

在yml中添加以下代码：

![在这里插入图片描述](https://img-blog.csdnimg.cn/5462527f7131484994305ba0c63c4d78.png)

然后在对应的mapper.xml里面加入配置：

![在这里插入图片描述](https://img-blog.csdnimg.cn/832a865ca52f4283a0a2c81919cf1665.png)

注意：开启二级缓存后，对应的pojo一定要实现Serializable，否则在序列化的时候会报错。
readOnly：是否只读 。 值为true时，mybatis认为所有从缓存中获取数据的操作都是只读操作，不会修改数据。mybatis为了加快获取速度，直接会将数据在缓存中的引用交给用户，不安全，但速度快。
值为false时，mybatis觉得获取的数据可能会被修改，mybatis会利用序列化&反序列化的技术克隆一份新的数据给你，安全，但速度慢。

##### 三级缓存：

Mybatis 的一级缓存与二级缓存 只适用于单体项目，在分布式服务或者微服务架构下 都会出现数据不一致问题。所以Mybatis 为我们提供了自定义缓存 我们可以集成很多三方中间件来做缓存 这里就那Redis来说一下。

![在这里插入图片描述](https://img-blog.csdnimg.cn/3556c96846f04ee1aede9f1b22644b70.png)

##### 总结：

- 一级缓存的作用域是一个sqlsession内；二级缓存作用域是针对mapper进行缓存；
- 一级缓存是默认开启的；二级缓存需要手动配置；
- 一级缓存sqlSession 执行 insert、update、delete 等操作 commit 提交后会清空缓存区域。sqlSession.close()后一级缓存也没有了。但是销毁sqlSession后会将里面的缓存存到二级缓存中；
- 二级缓存cache中readonly属性如果为false 那么相应的pojo类必须实现Serializable接口 并且其缓存查询到的对象都是通过序列化或者反序列化克隆的，所以对象之间两两不相等；
- 二级缓存的生命周期和应用同步，它是用来解决一级缓存不能跨会话共享数据的问题，范围是namespace级别的，可以被多个会话共享(只要是同一个接口的相同方法，都可以进行共享)。
- 只要没有显式地设置cacheEnabled为false，都会使用CachingExector装饰基本的执行器(SIMPLE、REUSE、BATCH)。 二级缓存总是默认开启的，但是每个Mapper的二级开关是默认关闭的。
- 二级缓存进行增删改操作也会刷新二级缓存，导致二级缓存失效；

二级缓存的执行流程：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fc440551003f479f93f8c1d43f99470b.png)

参考：https://blog.csdn.net/weixin_45161172/article/details/129526131
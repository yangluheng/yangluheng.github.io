---
lang: zh-CN
title: SpringBoot
order: 2
description: Java框架
---

## 1.Spring Boot自动配置原理

在Spring程序main方法中，添加**@SpringBootApplication**或者**@EnableAutoConfiguration**会自动去maven中读取每个starter中的**spring.factories**文件，该文件里配置了所有需要被创建的Spring容器中的bean。Spring Boot 通过**@EnableAutoConfiguration**开启自动装配，通过 **SpringFactoriesLoader** 最终加载**META-INF/spring.factories**中的自动配置类实现自动装配，自动配置类其实就是通过**@Conditional**按需加载的配置类，想要其生效必须引入**spring-boot-starter-xxx**包实现起步依赖。

**第 1 步:**
判断自动装配开关是否打开。默认spring.boot.enableautoconfiguration=true，可在 application.properties 或 application.yml 中设置。

![](http://www.img.youngxy.top/Java/fig/springboot1.png)

**第 2 步 ：**
用于获取**EnableAutoConfiguration**注解中的 **exclude** 和 **excludeName**。

![](http://www.img.youngxy.top/Java/fig/springboot2.png)

**第 3 步：**
获取需要自动装配的所有配置类，读取**META-INF/spring.factories**：

spring-boot/spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring.factories

![](http://www.img.youngxy.top/Java/fig/springboot3.png)

从下图可以看到这个文件的配置内容都被我们读取到了。XXXAutoConfiguration的作用就是按需加载组件。
不光是这个依赖下的META-INF/spring.factories被读取到，所有 Spring Boot Starter 下的META-INF/spring.factories都会被读取到。

![](http://www.img.youngxy.top/Java/fig/springboot4.png)



**自动配置作为Spring Boot的核心功能之一,其原理主要包含以下四点:**

- @SpringBootApplication注解

这个注解包含了@ComponentScan、@Configuration和@EnableAutoConfiguration,其中最关键的就是@EnableAutoConfiguration注解,它会根据classpath中的jar依赖为项目进行自动配置。

- @EnableAutoConfiguration注解

该注解通过SpringFactoriesLoader会加载classpath下META-INF/spring.factories文件中配置的自动配置类。这些自动配置类可以帮助Spring Boot项目进行自动化设置。

- 启动引导程序Bootstrap Application

Spring Boot在启动时会通过一个引导程序进行项目初始化。该引导程序会先加载自动配置类和其它一些关键类,实现自动配置的预处理工作。

- 条件注解@Conditional

Spring Boot提供了各种条件注解如@ConditionalOnClass、@ConditionalOnMissingBean等,自动配置类可以通过这些注解来对配置进行定制化。只有满足条件的自动配置才会生效。



**总体流程：**

1、引入Starter组件

2、@EnableAutoConfiguration注解通过@Import注解导入AutoConfigurationImportSelector类（@Import注解可以导入配置类或者Bean到当前类中）。

3、SpringBoot基于约定去Starter组件的路径下（META-INF/spring.factories）去找配置类

4、SpringBoot使用AutoConfigurationImportSelector类中getCandidateConfigurations去导入这些配置类，并根据@Conditional动态加载配置类里面的Bean到容器

参考：https://javaguide.cn/system-design/framework/spring/spring-boot-auto-assembly-principles.html#autoconfigurationimportselector-%E5%8A%A0%E8%BD%BD%E8%87%AA%E5%8A%A8%E8%A3%85%E9%85%8D%E7%B1%BB



## 2.Spring Boot 加载配置文件的优先级了解么？

项目启动后扫描顺序：

1）先去项目根目录找config文件夹下找配置文件件
 2）再去根目录下找配置文件
 3）去resources下找cofnig文件夹下找配置文件
 4）去resources下找配置文件

![](http://www.img.youngxy.top/Java/fig/springboot5.png)



## 3.如何使用 Spring Boot 实现全局异常处理？

- 创建一个全局异常处理类,实现HandlerExceptionResolver接口。
- @ControllerAdvice注解标注该类是一个全局异常处理类。
- @ExceptionHandler注解用来定义该方法处理的异常类型。
- 在处理方法中添加Exception类型的参数,可以获取异常对象信息。
- 处理方法中根据异常类型进行相应处理,比如返回指定的错误信息。
- 创建ResponseEntity对象封装返回的错误信息,设置状态码等信息。
- 在Spring Boot主类中使用@Bean注解注册全局异常处理类。
- 当 controller 抛出异常时,会被全局异常处理类自动捕获,并进行相应的处理,返回给用户统一的错误响应。

例子：

创建全局异常处理类:

```java
@ControllerAdvice
public class GlobalExceptionHandler implements HandlerExceptionResolver {

    @ExceptionHandler(Exception.class) 
    @ResponseBody
    public ResponseEntity<String> handleException(Exception ex) {
        return new ResponseEntity<String>("服务器内部错误", HttpStatus.INTERNAL_SERVER_ERROR); 
    }

    @ExceptionHandler(BusinessException.class)
    @ResponseBody 
    public ResponseEntity<String> handleBusinessException(BusinessException ex) {
        return new ResponseEntity<String>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

在Spring Boot启动类中注册:

```java
@Bean
public GlobalExceptionHandler getGlobalExceptionHandler() {
    return new GlobalExceptionHandler();
}
```

在Controller中抛出异常:

```Java
@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        throw new BusinessException("业务异常");
    }
}
```

访问/test接口会进入全局异常处理,返回业务异常信息。

## 4.核心配置文件

SpringBoot的核心配置文件是**application**和**bootstrap**配置文件。

application配置文件这个容易理解，主要用于Spring Boot项目的自动化配置。

bootstrap配置文件，该文件用于关联配置中心的配置,也可以配置一些初始化参数,会更早地加载。使用Spring Cloud Config配置中心时，这时需要在bootstrap配置文件中添加连接到配置中心的配置属性来加载外部配置中心的配置信息；



## 5.实现热部署的方式

这可以使用 DEV 工具来实现。通过这种依赖关系，您可以节省任何更改，嵌入式tomcat 将重新启动。Spring Boot  有一个开发工具（DevTools）模块，它有助于提高开发人员的生产力。Java  开发人员面临的一个主要挑战是将文件更改自动部署到服务器并自动重启服务器。开发人员可以重新加载 Spring Boot  上的更改，而无需重新启动服务器。这将消除每次手动部署更改的需要。Spring Boot  在发布它的第一个版本时没有这个功能。这是开发人员最需要的功能。DevTools 模块完全满足开发人员的需求。该模块将在生产环境中被禁用。它还提供 H2 数据库控制台以更好地测试应用程序。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
</dependency>
```



## 6.监视器和监听器

### 6.1监听器

监听器也叫listener，是servlet的监听器，可以用于监听web应用程序中某些对象的创建、销毁、增加、修改、删除等动作的发生，然后做出相应的响应处理。当范围对象的状态发生变化时，服务器自动调用监听器对象中的方法，常用于系统加载时进行信息初始化，统计在线人数和在线用户，统计网站的访问量。 配置监听器的方法：

- 　　通过@Component把监听器加入Spring容器中管理;
- 　　在application.properties中添加context.listener.classes配置;
- 　　在方法上加@EventListener注解;

### 6.2监控器

 **actuator**：这是springboot程序的监控系统，可以实现健康检查，info信息等。在使用之前需要引入`spring-boot-starter-actuator`，并做简单的配置即可。
 引入依赖并编写好配置之后，启动项目，访问http://localhost:8080/actuator

Spring Boot自带监控组件—Actuator，它可以帮助实现对程序内部运行情况的监控。Actuator轻松实现应用程序的监控治理，比如健康状况、审计、统计和HTTP追踪、Bean加载情况、环境变量、日志信息、线程信息等。
Actuator的核心是端点（Endpoint），它用来监视、提供应用程序的信息，Spring Boot提供的spring-boot-actuator组件中已经内置了非常多的Endpoint（health、info、beans、metrics、httptrace、shutdown等），每个端点都可以启用和禁用。



## 7.什么是Spring Boot Starter？有哪些常用的？

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



## 8.Spring Boot四大核心组件

四大组件分别是：starter， autoconfigure, CLI 以及actuator。

autoconfigure在我们的开发中并不会被感知，因为它是存在于我们的starter中的，所以我们的每个starter都是依赖autoconfigure的。

Spring Boot CLI是一个命令行使用Spring Boot的客户端工具；主要功能如下：

- 运行groovy脚本 => `官网2.1`
- 打包groovy文件到jar => `官网2.3`
- 初始化Spring Boot项目 => `官网2.4`

actuator是Spring Boot的监控插件，本身提供了很多接口可以获取当前项目的各项运行状态指标。

参考：https://mp.weixin.qq.com/s?__biz=Mzg2OTA0Njk0OA==&mid=2247485568&idx=2&sn=c5ba880fd0c5d82e39531fa42cb036ac&chksm=cea2474bf9d5ce5dcbc6a5f6580198fdce4bc92ef577579183a729cb5d1430e4994720d59b34&token=1729829670&lang=zh_CN#rd





## 9.常用注解

![](http://www.img.youngxy.top/Java/fig/%E5%B8%B8%E7%94%A8%E6%B3%A8%E8%A7%A3.png)



#### @Async 注解

对于异步方法调用，从Spring3开始提供了@Async注解，该注解可以被标注在方法上，以便异步地调用该方法。调用者将在调用时立即返回，方法的实际执行将提交给Spring TaskExecutor的任务中，由指定的线程池中的线程执行。

**同步**：同步就是整个处理过程顺序执行，当各个过程都执行完毕，并返回结果。

**异步**：异步调用则是只是发送了调用的指令，调用者无需等待被调用的方法完全执行完毕；而是继续执行下面的流程。例如， 在某个调用中，需要顺序调用 A, B, C三个过程方法；如他们都是同步调用，则需要将他们都顺序执行完毕之后，方算作过程执行完毕；如B为一个异步的调用方法，则在执行完A之后，调用B，并不等待B完成，而是执行开始调用C，待C执行完毕之后，就意味着这个过程执行完毕了。在Java中，一般在处理类似的场景之时，都是基于创建独立的线程去完成相应的异步调用逻辑，通过主线程和不同的业务子线程之间的执行流程，从而在启动独立的线程之后，主线程继续执行而不会产生停滞等待的情况。

**异步的方法有：**

1、 最简单的异步调用，返回值为void
 2、 带参数的异步调用，异步方法可以传入参数
 3、 存在返回值，常调用返回Future

##### @Async应用默认线程池

Spring应用默认的线程池，指在@Async注解在使用时，不指定线程池的名称。查看源码，@Async的默认线程池为**SimpleAsyncTaskExecutor**。

##### @Async应用自定义线程池

自定义线程池，可对系统中线程池更加细粒度的控制，方便调整线程池大小配置，线程执行异常控制和处理。

```java
@Configuration
@EnableAsync
public class ThreadPoolConfig {

    @Bean("taskExecutor")
    public ThreadPoolTaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // 设置核心线程数
        executor.setCorePoolSize(10);
        // 设置最大线程数
        executor.setMaxPoolSize(20);
        // 设置队列容量
        executor.setQueueCapacity(100);
        // 设置线程名前缀
        executor.setThreadNamePrefix("CrawlTaskExecutor-");
        executor.initialize();
        return executor;
    }
}

@Component
@Slf4j
public class CrawlTaskConsumer {
    @Autowired
    private ThreadPoolCrawler threadPoolCrawler;

    @Async("taskExecutor")
    @KafkaListener(topics = KAFKA_CONSTANTS.KAKFA_CONSTANTS_TOPIC, groupId = KAFKA_CONSTANTS.KAKFA_CONSTANTS_GROUP)
    public CompletableFuture<CrawlTask> consumeCrawlTask(ConsumerRecord<String, String> record, Consumer consumer) {
        CrawlTask crawlTask = JSON.parseObject(record.value(), CrawlTask.class);
        System.out.println("Received crawl task: " + crawlTask.toString());
        threadPoolCrawler.crawl(crawlTask);
        //手动提交偏移量
        consumer.commitAsync();
        return CompletableFuture.completedFuture(crawlTask);
    }
}
```





## 10.SpringBoot的启动流程是怎样的？

1. 从`spring.factories`配置文件中**加载**`**EventPublishingRunListener**`**对象**，该对象拥有`SimpleApplicationEventMulticaster`属性，即在SpringBoot启动过程的不同阶段用来发射内置的生命周期事件;
2. **准备环境变量**，包括系统变量，环境变量，命令行参数，默认变量，`servlet`相关配置变量，随机值以及配置文件（比如`application.properties`）等;
3. 控制台**打印SpringBoot的**`**bannner**`**标志**；
4. **根据不同类型环境创建不同类型的**`**applicationcontext**`**容器**，因为这里是`servlet`环境，所以创建的是`AnnotationConfigServletWebServerApplicationContext`容器对象；
5. 从`spring.factories`配置文件中**加载**`**FailureAnalyzers**`**对象**,用来报告SpringBoot启动过程中的异常；
6. **为刚创建的容器对象做一些初始化工作**，准备一些容器属性值等，对`ApplicationContext`应用一些相关的后置处理和调用各个`ApplicationContextInitializer`的初始化方法来执行一些初始化逻辑等；
7. **刷新容器**，这一步至关重要。比如调用`bean factory`的后置处理器，注册`BeanPostProcessor`后置处理器，初始化事件广播器且广播事件，初始化剩下的单例`bean`和SpringBoot创建内嵌的`Tomcat`服务器等等重要且复杂的逻辑都在这里实现，主要步骤可见代码的注释，关于这里的逻辑会在以后的spring源码分析专题详细分析；
8. **执行刷新容器后的后置处理逻辑**，注意这里为空方法；
9. **调用**`**ApplicationRunner**`**和**`**CommandLineRunner**`**的run方法**，我们实现这两个接口可以在spring容器启动后需要的一些东西比如加载一些业务数据等;
10. **报告启动异常**，即若启动过程中抛出异常，此时用`FailureAnalyzers`来报告异常;
11. 最终**返回容器对象**，这里调用方法没有声明对象来接收。

参考：https://blog.csdn.net/yuechuzhixing/article/details/124775218

## 11.WebMvcConfigurer

WebMvcConfigurer配置类其实是`Spring`内部的一种配置方式，采用`JavaBean`的形式来代替传统的`xml`配置文件形式进行针对框架个性化定制，可以自定义一些Handler，Interceptor，ViewResolver，MessageConverter。基于java-based方式的spring mvc配置，需要创建一个**配置**类并实现**`WebMvcConfigurer`** 接口；

在Spring Boot 1.5版本都是靠重写**WebMvcConfigurerAdapter**的方法来添加自定义拦截器，消息转换器等。SpringBoot 2.0 后，该类被标记为@Deprecated（弃用）。官方推荐直接实现WebMvcConfigurer或者直接继承WebMvcConfigurationSupport，方式一实现WebMvcConfigurer接口（推荐），方式二继承WebMvcConfigurationSupport类。

### **常用的方法：**

```java
 /* 拦截器配置 */
void addInterceptors(InterceptorRegistry var1);
/* 视图跳转控制器 */
void addViewControllers(ViewControllerRegistry registry);
/**
     *静态资源处理
**/
void addResourceHandlers(ResourceHandlerRegistry registry);
/* 默认静态资源处理器 */
void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer);
/**
     * 这里配置视图解析器
 **/
void configureViewResolvers(ViewResolverRegistry registry);
/* 配置内容裁决的一些选项*/
void configureContentNegotiation(ContentNegotiationConfigurer configurer);
/** 解决跨域问题 **/
public void addCorsMappings(CorsRegistry registry) ;
```

### addInterceptors：拦截器

- addInterceptor：需要一个实现HandlerInterceptor接口的拦截器实例
- addPathPatterns：用于设置拦截器的过滤路径规则；`addPathPatterns("/**")`对所有请求都拦截
- excludePathPatterns：用于设置不需要拦截的过滤规则
- 拦截器主要用途：进行用户登录状态的拦截，日志的拦截等。
---
lang: zh-CN
title: Spring Cloud
order: 2
description: 微服务和分布式
---

## 1.什么是Spring Cloud？

Spring Cloud是一系列框架的有序集合。它利用Spring Boot的开发便利性巧妙地简化了分布式系统基础设施的开发，如服务发现注册、配置中心、智能路由、消息总线、负载均衡、断路器、数据监控等，都可以用Spring Boot的开发风格做到一键启动和部署。Spring Cloud并没有重复制造轮子，它只是将各家公司开发的比较成熟、经得起实际考验的服务框架组合起来，通过Spring Boot风格进行再封装屏蔽掉了复杂的配置和实现原理，最终给开发者留出了一套简单易懂、易部署和易维护的分布式系统开发工具包。

![](http://www.img.youngxy.top/Java/fig/springcloud1.png)

## 2.微服务的概念

分布式，多个模块，每一个模块都是一个单独的系统。

以前所有的代码都放在同一个工程中、部署在同一个服务器、同一项目的不同模块不同功能互相抢占资源，微服务就是将工程根据不同的业务规则拆分成微服务，部署在不同的服务器上，服务之间相互调用，java中有的微服务有dubbo(只能用来做微服务)、springcloud( 提供了服务的发现、断路器等)。

- **微服务的特点**：

1. 按业务划分为一个独立运行的程序，即服务单元
2. 服务之间通过HTTP协议相互通信
3. 自动化部署
4. 可以用不同的编程语言
5. 可以用不同的存储技术
6. 服务集中化管理
7. 微服务是一个分布式系统

- **微服务的优势**

1. 将一个复杂的业务拆分为若干小的业务，将复杂的业务简单化，新人只需要了解他所接管的服务的代码，减少了新人的学习成本。
2. 由于微服务是分布式服务，服务与服务之间没有任何耦合。微服务系统的微服务单元具有很强的横向拓展能力。
3. 服务与服务之间采用HTTP网络通信协议来通信，单个服务内部高度耦合，服务与服务之间完全独立，无耦合。这使得微服务可以采用任何的开发语言和技术来实现，提高开发效率、降低开发成本。
4. 微服务是按照业务进行拆分的，并有坚实的服务边界，若要重写某一业务代码，不需了解所有业务，重写简单。
5. 微服务的每个服务单元是独立部署的，即独立运行在某个进程中，微服务的修改和部署对其他服务没有影响。
6. 微服务在CAP理论中采用的AP架构，具有高可用分区容错特点。高可用主要体现在系统7x24不间断服务，他要求系统有大量的服务器集群，从而提高系统的负载能力。分区容错也使得系统更加健壮。

- **微服务的不足**

1. 微服务的复杂度：构建一个微服务比较复杂，服务与服务之间通过HTTP协议或其他消息传递机制通信，开发者要选出最佳的通信机制，并解决网络服务差时带来的风险。
2. 分布式事物：将事物分成多阶段提交，如果一阶段某一节点失败仍会导致数据不正确。如果事物涉及的节点很多，某一节点的网络出现异常会导致整个事务处于阻塞状态，大大降低数据库的性能。
3. 服务划分：将一个完整的系统拆分成很多个服务，是一件非常困难的事，因为这涉及了具体的业务场景
4. 服务部署：最佳部署容器Docker





## 3.Spring Cloud的优缺点以及组件

**设计目标**

协调各个微服务，简化分布式系统开发。

**优缺点**

微服务的框架那么多比如：dubbo、Kubernetes，为什么就要使用Spring Cloud的呢？

**优点：**

- 产出于Spring大家族，Spring在企业级开发框架中无人能敌，来头很大，可以保证后续的更新、完善
- 组件丰富，功能齐全。Spring Cloud 为微服务架构提供了非常完整的支持。例如、配置管理、服务发现、断路器、微服务网关等；、
- Spring Cloud 社区活跃度很高，教程很丰富，遇到问题很容易找到解决方案
- 服务拆分粒度更细，耦合度比较低，有利于资源重复利用，有利于提高开发效率
- 可以更精准的制定优化服务方案，提高系统的可维护性
- 减轻团队的成本，可以并行开发，不用关注其他人怎么开发，先关注自己的开发
- 微服务可以是跨平台的，可以用任何一种语言开发
- 适于互联网时代，产品迭代周期更短

**缺点：**

- 微服务过多，治理成本高，不利于维护系统
- 分布式系统开发的成本高（容错，分布式事务等）对团队挑战大

**springcloud中的组件有那些？**

- Spring Cloud Eureka,服务注册中心,特性有失效剔除、服务保护
- Spring Cloud Zuul,API服务网关,功能有路由分发和过滤
- Spring Cloud Config,分布式配置中心，支持本地仓库、SVN、Git、Jar包内配置等模式
- Spring Cloud Ribbon,客户端负载均衡,特性有区域亲和,重试机制
- Spring Cloud Hystrix,客户端容错保护,特性有服务降级、服务熔断、请求缓存、请求合并、依赖隔离
- Spring Cloud Feign,声明式服务调用本质上就是Ribbon+Hystrix
- Spring Cloud Stream,消息驱动,有Sink、Source、Processor三种通道,特性有订阅发布、消费组、消息分区
- Spring Cloud Bus,消息总线,配合Config仓库修改的一种Stream实现，
- Spring Cloud Sleuth,分布式服务追踪,需要搞清楚TraceID和SpanID以及抽样,如何与ELK整合

**Spring Cloud项目部署架构？**

![img](https://www.pdai.tech/images/spring/spring-cloud-1.jpeg)



**网关与过滤器有什么区别？**

网关是对所有服务的请求进行分析过滤，过滤器是对单个服务而言。



**什么是断路器**？

当一个服务调用另一个服务由于网络原因或自身原因出现问题，调用者就会等待被调用者的响应 当更多的服务请求到这些资源导致更多的请求等待，发生连锁效应（雪崩效应）

断路器有三种状态：

- 打开状态：一段时间内达到一定的次数无法调用并且多次监测没有恢复的迹象断路器完全打开那么下次请求就不会请求到该服务
- 半开状态：短时间内有恢复迹象断路器会将部分请求发给该服务，正常调用时断路器关闭
- 关闭状态：当服务一直处于正常状态能正常调用



**什么是 Hystrix？**

在分布式系统，我们一定会依赖各种服务，那么这些个服务一定会出现失败的情况，就会导致雪崩，Hystrix就是这样的一个工具，防雪崩利器，它具有服务降级，服务熔断，服务隔离，监控等一些防止雪崩的技术。

Hystrix有四种防雪崩方式：

- 服务降级：接口调用失败就调用本地的方法返回一个空
- 服务熔断：接口调用失败就会进入调用接口提前定义好的一个熔断的方法，返回错误信息
- 服务隔离：隔离服务之间相互影响
- 服务监控：在服务发生调用时,会将每秒请求数、成功请求数等运行指标记录下来。



**什么是Feign？**

Feign 是一个声明REST服务客户端，这使得编写web服务客户端更容易。它将我们需要调用的服务方法定义成抽象方法保存在本地就可以了，不需要自己构建Http请求了，直接调用接口就行了，不过要注意，调用方法要和本地抽象方法的签名完全一致。

**什么是OpenFeign？**

OpenFeign 是 Spring Cloud 对 Feign 的二次封装，它具有 Feign 的所有功能，并在 Feign 的基础上增加了对 Spring MVC 注解的支持，例如 @RequestMapping、@GetMapping 和 @PostMapping 等。



## 4.OpenFeign远程调用的基本流程

OpenFeign远程调用，核心就是通过一系列的封装和处理，将以JAVA注解的方式定义的远程调用API接口，最终转换成HTTP的请求形式，然后将HTTP的请求的响应结果，解码成JAVA Bean，放回给调用者。Feign远程调用的基本流程，大致如下图所示。

![](http://www.img.youngxy.top/Java/fig/springcloud2.png)



从上图可以看到，Feign通过处理注解，将请求模板化，当实际调用的时候，传入参数，根据参数再应用到请求上，进而转化成真正的 Request  请求。通过Feign以及JAVA的动态代理机制，使得Java  开发人员，可以不用通过HTTP框架去封装HTTP请求报文的方式，完成远程服务的HTTP调用。

**过程：**

在微服务启动时，Feign会进行包扫描，对加@FeignClient注解的接口，按照注解的规则，创建远程接口的本地JDK  Proxy代理实例。然后，将这些本地Proxy代理实例，注入到Spring  IOC容器中。当远程接口的方法被调用，由Proxy代理实例去完成真正的远程访问，并且返回结果。

### 4.1Feign与OpenFeign的区别

- Feign是Spring  Cloud组件中一个轻量级RESTful的HTTP服务客户端，Feign内置了Ribbon，用来做客户端负载均衡，去调用服务注册中心的服务。Feign的使用方式是：使用Feign的注解定义接口，调用接口，就可以调用服务注册中心的服务。
- OpenFeign是Spring  Cloud在Feign的基础上支持了SpringMVC的注解，如@RequestMapping等等。OpenFeign的@FeignClient可以解析SpringMVC的@RequestMapping注解下的接口，并通过动态代理的方式产生实现类。

### 4.2Spring Cloud OpenFeign使用教程

OpenFeignClient的pom依赖如下：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

启动类上增加**@EnableFeignClients**注解，告诉框架扫描所有使用注解**@FeignClient**定义的feign客户端，并把feign客户端注册到IOC容器中。

需要使用@FeignClient来注解一个interface，如下所示：

```Java
@FeignClient(value = "leadnews-article",fallback = IArticleClientFallback.class)
public interface IArticleClient {
    @PostMapping("/api/v1/article/save")
    public ResponseResult saveArticle(@RequestBody ArticleDto articleDto);;
}
```

其中@FeignClient中的value是要调用的服务的注册名。



## 5.什么是 Nacos？

一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台。

整体架构分为用户层、业务层、内核层和插件，用户层主要解决用户使用的易用性问题，业务层主要解决服务发现和配置管理的功能问题，内核层解决分布式系统⼀致性、存储、高可用等核心问题，插件解决扩展性问题。

![](http://www.img.youngxy.top/Java/fig/nacos2.png)

**服务 (Service)**

服务是指一个或一组软件功能（例如特定信息的检索或一组操作的执行），其目的是不同的客户端可以为不同的目的重用（例如通过跨进程的网络调用）。Nacos 支持主流的服务生态，如 Kubernetes Service、gRPC|Dubbo RPC Service 或者 Spring Cloud  RESTful Service。

**服务注册中心 (Service Registry)**

服务注册中心，它是服务，其实例及元数据的数据库。服务实例在启动时注册到服务注册表，并在关闭时注销。服务和路由器的客户端查询服务注册表以查找服务的可用实例。服务注册中心可能会调用服务实例的健康检查 API 来验证它是否能够处理请求。




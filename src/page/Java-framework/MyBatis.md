---
lang: zh-CN
title: MyBatis
order: 3
description: Java框架
---

## 1.MyBatis Dao接口原理

MyBatis中的Dao接口,是对数据访问逻辑的抽象。Dao接口中定义了对数据库的抽象访问方法,而不包含任何实现逻辑。

MyBatis通过动态代理机制,实现了Dao接口的动态实现。MyBatis会为每个Dao接口生成一个代理对象,这个代理对象实现了Dao接口,并包含了SqlSession的引用。当调用Dao接口方法时,实际会调用SqlSession对应的方法,从而实现对数据库的访问。

例如,对于一个UserDao接口：

```java
public interface UserDao {
  User getUser(int id);
}
```

MyBatis会动态生成其实现类:

```java
public class UserDaoImpl implements UserDao {

  private SqlSession sqlSession;

  public User getUser(int id) {
    return sqlSession.selectOne("namespace.getUser", id);
  }
}
```

这样在代码中注入UserDao接口,实际执行的就是SqlSession中对应的SQL映射逻辑。

总结一下,MyBatis Dao接口实现原理主要包括:

- Dao接口仅定义抽象数据访问方法,不包含实现逻辑
- MyBatis利用JDK动态代理,为每个Dao接口生成代理对象
- 代理对象内部包含SqlSession引用,实际执行SqlSession的数据库访问方法
- 这样做的好处是 hiding-entirely separating DAO implementation and data access logic

## 2.MyBatis分页原理 

首先,MyBatis实现分页主要有两种机制:物理分页和逻辑分页。

物理分页是真正的数据库分页,它是通过数据库本身提供的分页功能来实现的,比如MySQL的LIMIT语句,Oracle的ROWNUM等。这种分页方式能够真正减少返回的数据量,速度较快。

MyBatis通过拦截器Interceptor来实现物理分页。拦截器会在SQL执行前动态修改SQL,加上分页语句,然后包装执行结果,返回容易处理的分页对象。

一个典型的物理分页拦截器流程是:

1. 拦截待执行SQL
2. 检查数据库类型,添加对应分页语法
3. 执行修改后的SQL
4. 封装结果到分页对象

而逻辑分页方式是通过在SQL中添加条件来实现的,这对数据库影响较小,但需要多次查询,效率低下。

总之,MyBatis分页实现的核心就在于这个动态SQL拦截机制。拦截器可以灵活适配不同数据库的分页语法,将SQL处理成数据库能识别的分页查询,这是非常巧妙的设计。

![](http://www.img.youngxy.top/Java/fig/mybatis1.png)

**总结一下：**

- 通过page对象作为分页依据
- 通过count来进行查询总条数的限制
- 对原sql通过limit来进行分页的效果

参考：https://blog.csdn.net/xiaolegeaizy/article/details/108461284

### MyBatis 是如何进行分页的？分页插件的原理是什么？

答：

**(1)** MyBatis 使用 RowBounds 对象进行分页，它是针对 ResultSet 结果集执行的内存分页，而非物理分页；

**(2)** 可以在 sql 内直接书写带有物理分页的参数来完成物理分页功能；

**(3)** 也可以使用分页插件来完成物理分页。

分页插件的基本原理是使用 MyBatis 提供的插件接口，实现自定义插件，在插件的拦截方法内拦截待执行的 sql，然后重写 sql，根据 dialect 方言，添加对应的物理分页语句和物理分页参数。

举例： 

```sql
select _ from student 
拦截 sql 后重写为：
select t._ from （select \* from student）t limit 0，10
```

MyBatis 使用 JDK 的动态代理，为需要拦截的接口生成代理对象以实现接口方法拦截功能，每当执行接口对象的方法时，就会进入拦截方法，具体就是 `InvocationHandler` 的 `invoke()` 方法，当然，只会拦截那些指定需要拦截的方法。

实现 MyBatis 的 `Interceptor` 接口并复写 `intercept()` 方法，然后在给插件编写注解，指定要拦截哪一个接口的哪些方法即可，在配置文件中配置编写的插件。

### MybatisPlus

```java
@Bean
public MybatisPlusInterceptor mybatisPlusInterceptor() {
	MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
  // 配置分页插件
  interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
  return interceptor;
}
```



## 3.MyBatis缓存机制(一级缓存、二级缓存、三级缓存)

### 3.1一级缓存：

作用域是同一个 SqlSession，在同一个sqlSession中两次执行相同的sql语句，第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从缓存中获取,从而提高查询效率。当一个sqlSession 结束后该 sqlSession中的一级缓存也就不存在了。**Mybatis 默认开启一级缓存。**
一级缓存内部存储使用一个 HashMap，key 为 hashCode+sqlId+Sql 语句。value为从查询出来映射生成的 java 对象 。sqlSession执行insert、update、delete 等操作 commit 提交后会清空缓存区域。

### 3.2二级缓存：

是多个 SqlSession 共享的，其作用域是 mapper 的同一个 namespace，不同的sqlSession 两次执行相同 namespace 下的 sql 语句且向 sql 中传递参数也相同即最终执行 相同的 sql 语句，第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从 缓存中获取数据将不再从数据库查询，从而提高查询效率。Mybatis 默认没有开启二级缓存 需要在 setting 全局参数中配置开启二级缓存。

在yml中添加以下代码：

```yml
mybatis:
	configuration:
		cache-enabled: true
```

然后在对应的mapper.xml里面加入配置：

```xml
<cache eviction = "FIFO" flushInterval = "6000" readOnly = "false" size = "50"></cache>
```

注意：开启二级缓存后，对应的pojo一定要实现Serializable，否则在序列化的时候会报错。
readOnly：是否只读 。 值为true时，mybatis认为所有从缓存中获取数据的操作都是只读操作，不会修改数据。mybatis为了加快获取速度，直接会将数据在缓存中的引用交给用户，不安全，但速度快。
值为false时，mybatis觉得获取的数据可能会被修改，mybatis会利用序列化&反序列化的技术克隆一份新的数据给你，安全，但速度慢。

### 3.3三级缓存：

Mybatis 的一级缓存与二级缓存只适用于单体项目，在分布式服务或者微服务架构下都会出现数据不一致问题。所以Mybatis为我们提供了自定义缓存。我们可以集成很多三方中间件来做缓存。这里就Redis来说一下。

![](http://www.img.youngxy.top/Java/fig/mybatis2.png)

### 3.4总结：

- 一级缓存的作用域是一个sqlsession内；二级缓存作用域是针对mapper进行缓存；
- 一级缓存是默认开启的；二级缓存需要手动配置；
- 一级缓存sqlSession 执行 insert、update、delete 等操作 commit 提交后会清空缓存区域。sqlSession.close()后一级缓存也没有了。但是销毁sqlSession后会将里面的缓存存到二级缓存中；
- 二级缓存cache中readonly属性如果为false 那么相应的pojo类必须实现Serializable接口 并且其缓存查询到的对象都是通过序列化或者反序列化克隆的，所以对象之间两两不相等；
- 二级缓存的生命周期和应用同步，它是用来解决一级缓存不能跨会话共享数据的问题，范围是namespace级别的，可以被多个会话共享(只要是同一个接口的相同方法，都可以进行共享)。
- 只要没有显式地设置cacheEnabled为false，都会使用CachingExector装饰基本的执行器(SIMPLE、REUSE、BATCH)。 二级缓存总是默认开启的，但是每个Mapper的二级开关是默认关闭的。
- 二级缓存进行增删改操作也会刷新二级缓存，导致二级缓存失效；

**二级缓存的执行流程：**

![](http://www.img.youngxy.top/Java/fig/mybatis3.png)

参考：https://blog.csdn.net/weixin_45161172/article/details/129526131
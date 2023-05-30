import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as n,c as i,f as d}from"./app-9ea20e45.js";const a={},s=d(`<h2 id="_4-1软件设计原则有哪些" tabindex="-1"><a class="header-anchor" href="#_4-1软件设计原则有哪些" aria-hidden="true">#</a> 4.1软件设计原则有哪些？</h2><figure><img src="http://www.img.youngxy.top/Java/fig/设计原则.PNG" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_4-2什么是设计模式" tabindex="-1"><a class="header-anchor" href="#_4-2什么是设计模式" aria-hidden="true">#</a> 4.2什么是设计模式？</h2><p>设计模式（Design pattern）代表了最佳的实践，通常被有经验的⾯向对象的软件开发⼈员所采⽤。设计模式是软件开发⼈员在软件开发过程中⾯临的⼀般问题的解决⽅案。这些解决⽅案是众多软件开发⼈员经过相当⻓的⼀段时间的试验和错误总结出来的。</p><p>分为三大类：</p><p><strong>创建型</strong>： 在创建对象的同时隐藏创建逻辑，不使⽤ new 直接实例化对象，程序在判断需要创建哪些对象时更灵活。包括⼯⼚/抽象⼯⼚/单例/建造者/原型模式。 <strong>结构型</strong>： 通过类和接⼝间的继承和引⽤实现创建复杂结构的对象。包括适配器/桥接模式/过滤器/组合/装饰器/外观/享元/代理模式。 <strong>行为型</strong>： 通过类之间不同通信⽅式实现不同⾏为。包括责任链/命名/解释器/迭代器/中介者/备忘录/观察者/状态/策略/模板/访问者模式。</p><h2 id="_4-3单例模式" tabindex="-1"><a class="header-anchor" href="#_4-3单例模式" aria-hidden="true">#</a> 4.3单例模式</h2><p>单例模式属于创建型模式，⼀个单例类在任何情况下都只存在⼀个实例，构造⽅法必须是私有的、由自己创建⼀个静态变量存储实例，对外提供⼀个静态公有方法获取实例。</p><p><strong>双重检查锁（DCL， 即 double-checked locking）</strong> 实现代码如下：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public class Singleton {
 
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>优点：懒加载，线程安全，效率较⾼</strong><strong>缺点：实现较复杂</strong> 这⾥的双重检查是指两次⾮空判断，锁指的是 synchronized 加锁，为什么要进⾏双重判断，其实很简单，第⼀重判断，如果实例已经存在，那么就不再需要进⾏同步操作，⽽是直接返回这个实例，如果没有创建，才会进⼊同步块，同步块的⽬的与之前相同，⽬的是为了防⽌有多个线程同时调⽤时，导致⽣成多个实例，有了同步块，每次只能有⼀个线程调⽤访问同步块内容，当第⼀个抢到锁的调⽤获取了实例之后，这个实例就会被创建，之后的所有调⽤都不会进⼊同步块，直接在第⼀重判断就返回了单例。关于内部的第⼆重空判断的作⽤，当多个线程⼀起到达锁位置时，进⾏锁竞争，其中⼀个线程获取锁，如果是第⼀次进⼊则为 null，会进⾏单例对象的创建，完成后释放锁，其他线程获取锁后就会被空判断拦截，直接返回已创建的单例对象。</p><h2 id="_4-4工厂模式" tabindex="-1"><a class="header-anchor" href="#_4-4工厂模式" aria-hidden="true">#</a> 4.4工厂模式</h2><h3 id="_4-4-1说一说简单工厂模式" tabindex="-1"><a class="header-anchor" href="#_4-4-1说一说简单工厂模式" aria-hidden="true">#</a> 4.4.1说⼀说简单⼯⼚模式：</h3><p>简单⼯⼚模式指由⼀个⼯⼚对象来创建实例，客户端不需要关注创建逻辑，只需提供传⼊⼯⼚的参数。</p><p>适⽤于⼯⼚类负责创建对象较少的情况，缺点是如果要增加新产品，就需要修改⼯⼚类的判断逻辑，违背开闭原则，且产品多的话会使⼯⼚类⽐较复杂。</p><p>Spring 中的 BeanFactory 使⽤简单⼯⼚模式，根据传⼊⼀个唯⼀的标识来获得 Bean 对象。</p><h3 id="_4-4-2工厂方法模式了解吗" tabindex="-1"><a class="header-anchor" href="#_4-4-2工厂方法模式了解吗" aria-hidden="true">#</a> 4.4.2⼯⼚⽅法模式了解吗：</h3><p>和简单⼯⼚模式中⼯⼚负责⽣产所有产品相⽐，⼯⼚⽅法模式将⽣成具体产品的任务分发给具体的产品⼯⼚。</p><p>也就是定义⼀个抽象⼯⼚，其定义了产品的⽣产接⼝，但不负责具体的产品，将⽣产任务交给不同的派⽣类⼯⼚。这样不⽤通过指定类型来创建对象了。</p><h3 id="_4-4-3抽象工厂模式了解吗" tabindex="-1"><a class="header-anchor" href="#_4-4-3抽象工厂模式了解吗" aria-hidden="true">#</a> 4.4.3抽象⼯⼚模式了解吗：</h3><p>简单⼯⼚模式和⼯⼚⽅法模式不管⼯⼚怎么拆分抽象，都只是针对⼀类产品，如果要⽣成另⼀种产品，就⽐较难办了！抽象⼯⼚模式通过在 AbstarctFactory 中增加创建产品的接⼝，并在具体⼦⼯⼚中实现新加产品的创建，当然前提是⼦⼯⼚⽀持⽣产该产品。否则继承的这个接⼝可以什么也不⼲。</p><h2 id="_4-5装饰器模式" tabindex="-1"><a class="header-anchor" href="#_4-5装饰器模式" aria-hidden="true">#</a> 4.5装饰器模式</h2><h2 id="_4-6代理模式" tabindex="-1"><a class="header-anchor" href="#_4-6代理模式" aria-hidden="true">#</a> 4.6代理模式</h2><h3 id="_4-6-1什么是代理模式" tabindex="-1"><a class="header-anchor" href="#_4-6-1什么是代理模式" aria-hidden="true">#</a> 4.6.1什么是代理模式？</h3><p>代理模式的本质是⼀个中间件，主要⽬的是解耦合服务提供者和使⽤者。使⽤者通过代理间接的访问服务提供者，便于后者的封装和控制，是⼀种结构性模式。</p><h3 id="_4-6-2静态代理和动态代理的区别" tabindex="-1"><a class="header-anchor" href="#_4-6-2静态代理和动态代理的区别" aria-hidden="true">#</a> 4.6.2静态代理和动态代理的区别：</h3><ol><li><p>灵活性 ：动态代理更加灵活，不需要必须实现接⼝，可以直接代理实现类，并且可以不需要针对每个⽬标类都创建⼀个代理类。另外，静态代理中，接⼝⼀旦新增加⽅法，⽬标对象和代理对象都要进⾏修改，这是⾮常麻烦的！</p></li><li><p>JVM 层⾯ ：静态代理在编译时就将接⼝、实现类、代理类这些都变成了⼀个个实际的 class ⽂件。⽽动态代理是在运⾏时动态⽣成类字节码，并加载到 JVM 中的。</p></li></ol><h3 id="_4-6-3静态代理" tabindex="-1"><a class="header-anchor" href="#_4-6-3静态代理" aria-hidden="true">#</a> 4.6.3静态代理：</h3><p><strong>静态代理中，我们对目标对象的每个方法的增强都是手动完成的（*后面会具体演示代码*），非常不灵活（*比如接口一旦新增加方法，目标对象和代理对象都要进行修改*）且麻烦(*需要对每个目标类都单独写一个代理类*）。</strong> 实际应用场景非常非常少，日常开发几乎看不到使用静态代理的场景。</p><p>上面我们是从实现和应用角度来说的静态代理，从 JVM 层面来说， 静态代理在编译时就将接口、实现类、代理类这些都变成了一个个实际的 class 文件。</p><h3 id="_4-6-4动态代理" tabindex="-1"><a class="header-anchor" href="#_4-6-4动态代理" aria-hidden="true">#</a> 4.6.4动态代理：</h3><p>相比于静态代理来说，动态代理更加灵活。我们不需要针对每个目标类都单独创建一个代理类，并且也不需要我们必须实现接口，我们可以直接代理实现类( <em>CGLIB 动态代理机制</em>)。</p><p><strong>从 JVM 角度来说，动态代理是在运行时动态生成类字节码，并加载到 JVM 中的。</strong></p><p>说到动态代理，Spring AOP、RPC 框架应该是两个不得不提的，它们的实现都依赖了动态代理。</p><p><strong>动态代理在我们日常开发中使用的相对较少，但是在框架中的几乎是必用的一门技术。学会了动态代理之后，对于我们理解和学习各种框架的原理也非常有帮助。</strong></p><p>就 Java 来说，动态代理的实现方式有很多种，比如 <strong>JDK 动态代理</strong>、<strong>CGLIB 动态代理</strong>等等。</p><h4 id="jdk-动态代理机制" tabindex="-1"><a class="header-anchor" href="#jdk-动态代理机制" aria-hidden="true">#</a> JDK 动态代理机制</h4><p><strong>在 Java 动态代理机制中 <code>InvocationHandler</code> 接口和 <code>Proxy</code> 类是核心。</strong></p><p><code>Proxy</code> 类中使用频率最高的方法是：<code>newProxyInstance()</code> ，这个方法主要用来生成一个代理对象。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    public static Object newProxyInstance(ClassLoader loader,
                                          Class&lt;?&gt;[] interfaces,
                                          InvocationHandler h)
        throws IllegalArgumentException
    {
        ......
    }


这个方法一共有 3 个参数：

    loader :类加载器，用于加载代理对象。
    interfaces : 被代理类实现的一些接口；
    h : 实现了 InvocationHandler 接口的对象；
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>要实现动态代理的话，还必须需要实现<code>InvocationHandler</code> 来自定义处理逻辑。 当我们的动态代理对象调用一个方法时，这个方法的调用就会被转发到实现<code>InvocationHandler</code> 接口类的 <code>invoke</code> 方法来调用。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public interface InvocationHandler {

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也就是说：<strong>你通过<code>Proxy</code> 类的 <code>newProxyInstance()</code> 创建的代理对象在调用方法的时候，实际会调用到实现<code>InvocationHandler</code> 接口的类的 <code>invoke()</code>方法。</strong> 你可以在 <code>invoke()</code> 方法中自定义处理逻辑，比如在方法执行前后做什么事情。</p><h4 id="cglib-动态代理机制" tabindex="-1"><a class="header-anchor" href="#cglib-动态代理机制" aria-hidden="true">#</a> CGLIB 动态代理机制</h4><p><strong>JDK 动态代理有一个最致命的问题是其只能代理实现了接口的类。</strong></p><p><strong>为了解决这个问题，我们可以用 CGLIB 动态代理机制来避免。</strong></p><p>CGLIB<em>Code Generation Library</em>)允许我们在运行时对字节码进行修改和动态生成。CGLIB 通过继承方式实现代理。例如 Spring 中的 AOP 模块中：如果目标对象实现了接口，则默认采用 JDK 动态代理，否则采用 CGLIB 动态代理。</p><p><strong>在 CGLIB 动态代理机制中 <code>MethodInterceptor</code> 接口和 <code>Enhancer</code> 类是核心。</strong></p><p>你需要自定义 <code>MethodInterceptor</code> 并重写 <code>intercept</code> 方法，<code>intercept</code> 用于拦截增强被代理类的方法。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public interface MethodInterceptor
extends Callback{
    // 拦截被代理类中的方法
    public Object intercept(Object obj, java.lang.reflect.Method method, Object[] args,MethodProxy proxy) throws Throwable;
}

    obj : 被代理的对象（需要增强的对象）
    method : 被拦截的方法（需要增强的方法）
    args : 方法入参
    proxy : 用于调用原始方法

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>你可以通过 <code>Enhancer</code>类来动态获取被代理类，当代理类调用方法的时候，实际调用的是 <code>MethodInterceptor</code> 中的 <code>intercept</code> 方法。</p><h4 id="jdk-动态代理和-cglib-动态代理对比" tabindex="-1"><a class="header-anchor" href="#jdk-动态代理和-cglib-动态代理对比" aria-hidden="true">#</a> JDK 动态代理和 CGLIB 动态代理对比：</h4><ul><li><strong>JDK 动态代理只能代理实现了接口的类或者直接代理接口，而 CGLIB 可以代理未实现任何接口的类。</strong> 另外， CGLIB 动态代理是通过生成一个被代理类的子类来拦截被代理类的方法调用，因此不能代理声明为 final 类型的类和方法。</li><li>就二者的效率来说，大部分情况都是 JDK 动态代理更优秀，随着 JDK 版本的升级，这个优势更加明显。</li></ul>`,53),r=[s];function l(c,t){return n(),i("div",null,r)}const u=e(a,[["render",l],["__file","4.常见的设计模式.html.vue"]]);export{u as default};

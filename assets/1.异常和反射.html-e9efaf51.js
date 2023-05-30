import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as p,c,d as n,e as a,b as o,f as i}from"./app-afa6d82a.js";const l={},u=i(`<h2 id="_1-1异常" tabindex="-1"><a class="header-anchor" href="#_1-1异常" aria-hidden="true">#</a> 1.1异常</h2><h3 id="_1-1-1java异常类层次结构" tabindex="-1"><a class="header-anchor" href="#_1-1-1java异常类层次结构" aria-hidden="true">#</a> 1.1.1Java异常类层次结构?</h3><ul><li>Throwable是 Java 语言中所有错误与异常的超类。 <ul><li><strong>Error</strong> 类及其子类：程序中无法处理的错误，表示运行应用程序中出现了严重的错误。</li><li><strong>Exception</strong> 程序本身可以捕获并且可以处理的异常。Exception 这种异常又分为两类：运行时异常和编译时异常。</li></ul></li><li><strong>运行时异常</strong></li></ul><p>都是RuntimeException类及其子类异常，如NullPointerException(空指针异常)、IndexOutOfBoundsException(下标越界异常)等，这些异常是不检查异常，程序中可以选择捕获处理，也可以不处理。这些异常一般是由程序逻辑错误引起的，程序应该从逻辑角度尽可能避免这类异常的发生。</p><p>运行时异常的特点是Java编译器不会检查它，也就是说，当程序中可能出现这类异常，即使没有用try-catch语句捕获它，也没有用throws子句声明抛出它，也会编译通过。</p><ul><li><strong>非运行时异常</strong> （编译异常）</li></ul><p>是RuntimeException以外的异常，类型上都属于Exception类及其子类。从程序语法角度讲是必须进行处理的异常，如果不处理，程序就不能编译通过。如IOException、SQLException等以及用户自定义的Exception异常，一般情况下不自定义检查异常。</p><figure><img src="https://www.pdai.tech/images/java/java-basic-exception-1.png" alt=" " tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_1-1-2可查的异常-checked-exceptions-和不可查的异常-unchecked-exceptions-区别" tabindex="-1"><a class="header-anchor" href="#_1-1-2可查的异常-checked-exceptions-和不可查的异常-unchecked-exceptions-区别" aria-hidden="true">#</a> 1.1.2可查的异常（checked exceptions）和不可查的异常（unchecked exceptions）区别？</h3><ul><li><strong>可查异常</strong>（编译器要求必须处置的异常）：</li></ul><p>正确的程序在运行中，很容易出现的、情理可容的异常状况。可查异常虽然是异常状况，但在一定程度上它的发生是可以预计的，而且一旦发生这种异常状况，就必须采取某种方式进行处理。</p><p>除了RuntimeException及其子类以外，其他的Exception类及其子类都属于可查异常。这种异常的特点是Java编译器会检查它，也就是说，当程序中可能出现这类异常，要么用try-catch语句捕获它，要么用throws子句声明抛出它，否则编译不会通过。</p><ul><li><strong>不可查异常</strong>(编译器不要求强制处置的异常)</li></ul><p>包括运行时异常（RuntimeException与其子类）和错误（Error）。</p><h3 id="_1-1-3throw和throws的区别" tabindex="-1"><a class="header-anchor" href="#_1-1-3throw和throws的区别" aria-hidden="true">#</a> 1.1.3throw和throws的区别？</h3><ul><li><strong>异常的申明(throws)</strong></li></ul><p>在Java中，当前执行的语句必属于某个方法，Java解释器调用main方法执行开始执行程序。若方法中存在检查异常，如果不对其捕获，那必须在方法头中显式声明该异常，以便于告知方法调用者此方法有异常，需要进行处理。 在方法中声明一个异常，方法头中使用关键字throws，后面接上要声明的异常。若声明多个异常，则使用逗号分割。如下所示：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public static void method() throws IOException, FileNotFoundException{
    //something statements
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>异常的抛出(throw)</strong></li></ul><p>如果代码可能会引发某种错误，可以创建一个合适的异常类实例并抛出它，这就是抛出异常。如下所示：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public static double method(int value) {
    if(value == 0) {
        throw new ArithmeticException(&quot;参数不能为0&quot;); //抛出一个运行时异常
    }
    return 5.0 / value;
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-1-4java-7-的-try-with-resource" tabindex="-1"><a class="header-anchor" href="#_1-1-4java-7-的-try-with-resource" aria-hidden="true">#</a> 1.1.4Java 7 的 try-with-resource?</h3><p>如果你的资源实现了 AutoCloseable 接口，你可以使用这个语法。大多数的 Java 标准资源都继承了这个接口。当你在 try 子句中打开资源，资源会在 try 代码块执行后或异常处理后自动关闭。</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public void automaticallyCloseResource() {
    File file = new File(&quot;./tmp.txt&quot;);
    try (FileInputStream inputStream = new FileInputStream(file);) {
        // use the inputStream to read a file
    } catch (FileNotFoundException e) {
        log.error(e);
    } catch (IOException e) {
        log.error(e);
    }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看下它的背后：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">transient</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span> args<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
        <span class="token class-name">BufferedReader</span> br<span class="token punctuation">;</span>
        <span class="token class-name">Throwable</span> throwable<span class="token punctuation">;</span>
        br <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BufferedReader</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">FileReader</span><span class="token punctuation">(</span><span class="token string">&quot;d:\\\\ hollischuang.xml&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        throwable <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token class-name">String</span> line<span class="token punctuation">;</span>
        <span class="token keyword">try</span>
        <span class="token punctuation">{</span>
            <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token punctuation">(</span>line <span class="token operator">=</span> br<span class="token punctuation">.</span><span class="token function">readLine</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>line<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token class-name">Throwable</span> throwable2<span class="token punctuation">)</span>
        <span class="token punctuation">{</span>
            throwable <span class="token operator">=</span> throwable2<span class="token punctuation">;</span>
            <span class="token keyword">throw</span> throwable2<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span><span class="token punctuation">(</span>br <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>throwable <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
                <span class="token keyword">try</span>
                <span class="token punctuation">{</span>
                    br<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token class-name">Throwable</span> throwable1<span class="token punctuation">)</span>
                <span class="token punctuation">{</span>
                    throwable<span class="token punctuation">.</span><span class="token function">addSuppressed</span><span class="token punctuation">(</span>throwable1<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token keyword">else</span>
                br<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">break</span> <span class="token constant">MISSING_BLOCK_LABEL_113</span><span class="token punctuation">;</span>
            <span class="token class-name">Exception</span> exception<span class="token punctuation">;</span>
            exception<span class="token punctuation">;</span>
            <span class="token keyword">if</span><span class="token punctuation">(</span>br <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
                <span class="token keyword">if</span><span class="token punctuation">(</span>throwable <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
                    <span class="token keyword">try</span>
                    <span class="token punctuation">{</span>
                        br<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                    <span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token class-name">Throwable</span> throwable3<span class="token punctuation">)</span>
                      <span class="token punctuation">{</span>
                        throwable<span class="token punctuation">.</span><span class="token function">addSuppressed</span><span class="token punctuation">(</span>throwable3<span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token keyword">else</span>
                    br<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">throw</span> exception<span class="token punctuation">;</span>
        <span class="token class-name">IOException</span> ioexception<span class="token punctuation">;</span>
        ioexception<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实背后的原理也很简单，那些我们没有做的关闭资源的操作，编译器都帮我们做了。所以，再次印证了，语法糖的作用就是方便程序员的使用，但最终还是要转成编译器认识的语言。</p><h3 id="_1-1-5finally和return的执行顺序" tabindex="-1"><a class="header-anchor" href="#_1-1-5finally和return的执行顺序" aria-hidden="true">#</a> 1.1.5finally和return的执行顺序</h3><p><code>try()</code> ⾥⾯有⼀个<code>return</code>语句， 那么后⾯的<code>finally{}</code>⾥⾯的code会不会被执⾏， 什么时候执⾏， 是在<code>return</code>前还是<code>return</code>后?</p><p>如果try中有return语句， 那么finally中的代码还是会执⾏。因为return表⽰的是要整个⽅法体返回， 所以，finally中的语句会在return之前执⾏。</p><p>但是return前执行的finally块内，对数据的修改效果对于引用类型和值类型会不同：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">// 测试 修改值类型</span>
<span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">f</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> ret <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> ret<span class="token punctuation">;</span>  <span class="token comment">// 返回 0，finally内的修改效果不起作用</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
        ret<span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;finally执行&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 测试 修改引用类型</span>
<span class="token keyword">static</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">f2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> ret <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token number">0</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> ret<span class="token punctuation">;</span>  <span class="token comment">// 返回 [1]，finally内的修改效果起了作用</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
        ret<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;finally执行&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-1-6异常的底层" tabindex="-1"><a class="header-anchor" href="#_1-1-6异常的底层" aria-hidden="true">#</a> 1.1.6异常的底层？</h3><p>提到JVM处理异常的机制，就需要提及Exception Table，以下称为异常表。我们暂且不急于介绍异常表，先看一个简单的 Java 处理异常的小例子。</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>public static void simpleTryCatch() {
   try {
       testNPE();
   } catch (Exception e) {
       e.printStackTrace();
   }
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用javap来分析这段代码（需要先使用javac编译）：</p><div class="language-Java line-numbers-mode" data-ext="Java"><pre class="language-Java"><code>//javap -c Main
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看到上面的代码，应该会有会心一笑，因为终于看到了Exception table，也就是我们要研究的异常表。</p><p>异常表中包含了一个或多个异常处理者(Exception Handler)的信息，这些信息包含如下</p><ul><li><strong>from</strong> 可能发生异常的起始点</li><li><strong>to</strong> 可能发生异常的结束点</li><li><strong>target</strong> 上述from和to之前发生异常后的异常处理者的位置</li><li><strong>type</strong> 异常处理者处理的异常的类信息</li></ul><h2 id="_1-2反射" tabindex="-1"><a class="header-anchor" href="#_1-2反射" aria-hidden="true">#</a> 1.2反射</h2><h3 id="_1-2-1什么是反射机制" tabindex="-1"><a class="header-anchor" href="#_1-2-1什么是反射机制" aria-hidden="true">#</a> 1.2.1什么是反射机制?</h3><p>JAVA反射机制是在运行状态中，对于任意一个类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意一个方法和属性；这种动态获取的信息以及动态调用对象的法的功能称为java语言的反射机制。</p><p>直接new对象就叫正射。</p><p>如下:</p><pre><code>Map&lt;String, String&gt; map = new HashMap&lt;&gt;();
map.put(&quot;蔡徐鸡&quot;,&quot;唱跳rap篮球&quot;);
</code></pre><p>那反射是啥？我先不说反射是啥，概念啥的太虚幻我就不说了，把你绕蒙你这篇文章就白看了，直接举例吧</p><p>接着看上面的正射，如果哪天你发现用LinkedHashMap效果更好，然后你修改代码：</p><pre><code>Map&lt;String, String&gt; map = new LinkedHashMap&lt;&gt;();
map.put(&quot;蔡徐鸡&quot;,&quot;唱跳rap篮球&quot;);
</code></pre><p>改完了编译运行没有bug然而过了两天你发现用LinkedHashMap会有隐患，还是得改回去用HashMap，成年人的崩溃如此简单，但是聪明的你想到可以加个判断，根据传入的条件来决定用HashMap还是LinkedHashMap，于是：</p><pre><code>public Map&lt;String, String&gt; getMap(String param) {
    Map&lt;String, String&gt; map = null;
    if (param.equals(&quot;HashMap&quot;)) {
        map = new HashMap&lt;&gt;();
    } else if (param.equals(&quot;LinkedHashMap&quot;)) {
        map = new LinkedHashMap&lt;&gt;();
     }
   return map;
 }
</code></pre><p>大功告成，这么难的逻辑都被你实现了，然后你得用TreeMap，你又要改代码。</p><p>有没有一种办法可以让你不修改代码呢，这时候反射就派上用场了。</p><p><strong>概念：反射是Java的一种机制，让我们可以在运行时获取类的信息</strong></p><p><strong>作用：通过反射，我们可以在程序运行时动态创建对象，还能获取到类的所有信息，比如它的属性、构造器、方法、注解等；</strong></p><p>直接举例吧：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token function">getMap</span><span class="token punctuation">(</span><span class="token class-name">String</span> className<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Class</span> clazz <span class="token operator">=</span> <span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span>className<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Constructor</span> constructor <span class="token operator">=</span> clazz<span class="token punctuation">.</span><span class="token function">getConstructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span> constructor<span class="token punctuation">.</span><span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时候不管你需要什么Map，只要实现了Map接口，你都能通过getMap获得，只需要传入对应Map的全限定名，例如java.util.HashMap / java.util.LinkedHashMap。</p><p>java中反射的用法非常非常多，常见的有以下这几个：</p><pre><code>一、在运行时获取一个类的 Class 对象
二、在运行时构造一个类的实例化对象
三、在运行时获取一个类的所有信息：变量、方法、构造器、注解
</code></pre><h3 id="_1-2-2获取class对象" tabindex="-1"><a class="header-anchor" href="#_1-2-2获取class对象" aria-hidden="true">#</a> 1.2.2获取class对象</h3><p>三种方法 1、类名.class：这种获取方式只有在编译前已经声明了该类的类型才能获取到 Class 对象</p><pre><code>Class&lt;HashMap&gt; hashMap= HashMap.class;
</code></pre><p>2、实例.getClass()：通过实例化对象获取该实例的 Class 对象</p><pre><code>Map&lt;String, String&gt; hashMap = new HashMap&lt;&gt;();
Class&lt;? extends Map&gt; hashMapClass = hashMap.getClass();
</code></pre><p>3、Class.forName(“类的全限定名”)：通过类的全限定名获取该类的 Class 对象</p><pre><code>Class&lt;?&gt; hashMap= Class.forName(&quot;java.util.HashMap&quot;);
</code></pre><p>拿到 Class对象就可以对它为所欲为了：调用它的方法、获取属性、获取类信息，总之它在你面前就没有隐私了，好羞羞，嘤~。</p><h3 id="_1-2-3构造类的实例化对象" tabindex="-1"><a class="header-anchor" href="#_1-2-3构造类的实例化对象" aria-hidden="true">#</a> 1.2.3构造类的实例化对象</h3><p>通过反射构造一个类的实例方式有2种： 1、Class 对象调用newInstance()方法</p><pre><code>Class&lt;?&gt; hashMapClass = Class.forName(&quot;java.util.HashMap&quot;);
HashMap hashMapInstance = (HashMap) hashMapClass.newInstance();
</code></pre><p>注意：即使 HashMap已经显式定义了构造方法，通过 newInstance() 创建的实例中，所有属性值都是对应类型的初始值，因为 newInstance() 构造实例会调用默认无参构造器。</p><p>2、Constructor 构造器调用newInstance()方法</p><pre><code>Class&lt;?&gt; hashMapClass = Class.forName(&quot;java.util.HashMap&quot;);
Constructor&lt;?&gt; constructor = hashMapClass.getConstructor();
constructor.setAccessible(true);
HashMap newInstance = (HashMap) constructor.newInstance();
</code></pre><p>通过 getConstructor(Object… paramTypes) 方法指定获取指定参数类型的 Constructor， Constructor 调用 newInstance(Object… paramValues) 时传入构造方法参数的值，同样可以构造一个实例，且内部属性已经被赋值。</p><p>通过Class对象调用 newInstance() 会走默认无参构造方法，如果想通过显式构造方法构造实例，需要提前从Class中调用getConstructor()方法获取对应的构造器，通过构造器去实例化对象。</p><h3 id="_1-2-4获取类的所有信息" tabindex="-1"><a class="header-anchor" href="#_1-2-4获取类的所有信息" aria-hidden="true">#</a> 1.2.4获取类的所有信息</h3><p>1、获取类中的变量（Field）</p><pre><code>Field[] getFields()：获取类中所有被public修饰的所有变量 Field getField(String
name)：根据变量名获取类中的一个变量，该变量必须被public修饰 Field[]
getDeclaredFields()：获取类中所有的变量，但无法获取继承下来的变量 Field
getDeclaredField(String name)：根据姓名获取类中的某个变量，无法获取继承下来的变量
</code></pre><p>2、获取类中的方法（Method）</p><pre><code>Method[] getMethods()：获取类中被public修饰的所有方法
Method getMethod(String name, Class…&lt;?&gt;
paramTypes)：根据名字和参数类型获取对应方法，该方法必须被public修饰
Method[] getDeclaredMethods()：获取所有方法，但无法获取继承下来的方法
Method getDeclaredMethod(String name, Class…&lt;?&gt;
paramTypes)：根据名字和参数类型获取对应方法，无法获取继承下来的方法
</code></pre><p>3、获取类的构造器（Constructor）</p><pre><code>Constuctor[] getConstructors()：获取类中所有被public修饰的构造器 Constructor
getConstructor(Class…&lt;?&gt; paramTypes)：根据参数类型获取类中某个构造器，该构造器必须被public修饰
Constructor[] getDeclaredConstructors()：获取类中所有构造器 Constructor
getDeclaredConstructor(class…&lt;?&gt; paramTypes)：根据参数类型获取对应的构造器
</code></pre><p>反射的应用场景</p><pre><code>1、Spring 实例化对象：当程序启动时，Spring 会读取配置文件applicationContext.xml并解析出里面所有的标签实例化到IOC容器中。
2、反射 + 工厂模式：通过反射消除工厂中的多个分支，如果需要生产新的类，无需关注工厂类，工厂类可以应对各种新增的类，反射可以使得程序更加健壮。
3、JDBC连接数据库：使用JDBC连接数据库时，指定连接数据库的驱动类时用到反射加载驱动类
</code></pre>`,85),r={href:"https://blog.csdn.net/qq_33709582/article/details/113550163",target:"_blank",rel:"noopener noreferrer"};function d(k,v){const s=t("ExternalLinkIcon");return p(),c("div",null,[u,n("p",null,[a("参考："),n("a",r,[a("https://blog.csdn.net/qq_33709582/article/details/113550163"),o(s)])])])}const b=e(l,[["render",d],["__file","1.异常和反射.html.vue"]]);export{b as default};

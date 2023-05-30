import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as n,c as r,d as e,e as i,b as o,f as s}from"./app-afa6d82a.js";const d={},c=s('<div class="hint-container info"><p class="hint-container-title">相关信息</p><p>Collection 是一个集合接口。 它提供了对集合对象进行基本操作的通用接口方法。Collection接口在Java 类库中有很多具体的实现。是list，set等的父接口。</p></div><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>Collections 是一个包装类。 它包含有各种有关集合操作的静态多态方法。此类不能实例化，就像一个工具类，服务于Java的Collection框架。</p></div><figure><img src="http://www.img.youngxy.top/Java/fig/java-collection-map.webp" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_1-arraylist" tabindex="-1"><a class="header-anchor" href="#_1-arraylist" aria-hidden="true">#</a> 1.ArrayList</h2><p>对于ArrayList，它的特点是内部采用动态数组实现，这决定了以下几点。</p><ul><li>可以随机访问，按照索引位置进行访问效率很高，用算法描述中的术语，效率是O(1)，简单说就是可以一步到位。</li><li>除非数组已排序，否则按照内容查找元素效率比较低，具体是O(N), N为数组内容长度，也就是说，性能与数组长度成正比。</li><li>添加元素的效率还可以，重新分配和复制数组的开销被平摊了，具体来说，添加N个元素的效率为O(N)。</li><li>插入和删除元素的效率比较低，因为需要移动元素，具体为O(N)。</li></ul><h2 id="_2-linkedlist" tabindex="-1"><a class="header-anchor" href="#_2-linkedlist" aria-hidden="true">#</a> 2.LinkedList</h2><p>用法上，LinkedList是一个List，但也实现了Deque接口，可以作为队列、栈和双端队列使用。实现原理上，LinkedList内部是一个双向链表，并维护了长度、头节点和尾节点，这决定了它有如下特点。</p><ul><li>按需分配空间，不需要预先分配很多空间。</li><li>不可以随机访问，按照索引位置访问效率比较低，必须从头或尾顺着链接找，效率为O(N/2)。</li><li>不管列表是否已排序，只要是按照内容查找元素，效率都比较低，必须逐个比较，效率为O(N)。</li><li>在两端添加、删除元素的效率很高，为O(1)。</li><li>在中间插入、删除元素，要先定位，效率比较低，为O(N)，但修改本身的效率很高，效率为O(1)。</li></ul><p>理解了LinkedList和ArrayList的特点，就能比较容易地进行选择了：</p><p><strong>如果列表长度未知，添加、删除操作比较多，尤其经常从两端进行操作，而按照索引位置访问相对比较少，则LinkedList是比较理想的选择。</strong></p><h2 id="_3-arraydeque" tabindex="-1"><a class="header-anchor" href="#_3-arraydeque" aria-hidden="true">#</a> 3.ArrayDeque</h2><p>ArrayDeque实现了双端队列，内部使用循环数组实现，这决定了它有如下特点。</p><ul><li>在两端添加、删除元素的效率很高，动态扩展需要的内存分配以及数组复制开销可以被平摊，具体来说，添加N个元素的效率为O(N)。</li><li>根据元素内容查找和删除的效率比较低，为O(N)。</li><li>与ArrayList和LinkedList不同，没有索引位置的概念，不能根据索引位置进行操作。</li></ul>',14),u={href:"https://www.youngxy.top/page/Java-SE/3.%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84.html#java%E5%AE%98%E6%96%B9%E6%8E%A8%E8%8D%90%E7%9A%84%E5%AE%9E%E7%8E%B0%E6%96%B9%E5%BC%8F-deque%EF%BC%89",target:"_blank",rel:"noopener noreferrer"},p=e("p",null,[e("strong",null,"如果只需要Deque接口，从两端进行操作，一般而言，ArrayDeque效率更高一些，应该被优先使用；如果同时需要根据索引位置进行操作，或者经常需要在中间进行插入和删除，则应该选LinkedList。")],-1),h=e("h2",{id:"_4-priorityqueue",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#_4-priorityqueue","aria-hidden":"true"},"#"),i(" 4.PriorityQueue")],-1),_=e("p",null,"PriorityQueue实现了队列接口Queue，但按优先级出队，内部是用堆实现的，有如下特点：",-1),E=e("ul",null,[e("li",null,"实现了优先级队列，最先出队的总是优先级最高的，即排序中的第一个。"),e("li",null,"优先级可以有相同的，内部元素不是完全有序的，如果遍历输出，除了第一个，其他没有特定顺序。"),e("li",null,"查看头部元素的效率很高，为O(1)，入队、出队效率比较高，为O(log2(N))，构建堆heapify的效率为O(N)。"),e("li",null,"根据值查找和删除元素的效率比较低，为O(N)。")],-1);function L(y,f){const t=l("ExternalLinkIcon");return n(),r("div",null,[c,e("p",null,[i("ArrayDeque和LinkedList都实现了Deque接口，应该用哪一个呢？（详见："),e("a",u,[i("https://www.youngxy.top/page/Java-SE/3.数据结构.html#java官方推荐的实现方式-deque）"),o(t)])]),p,h,_,E])}const k=a(d,[["render",L],["__file","2.List.html.vue"]]);export{k as default};

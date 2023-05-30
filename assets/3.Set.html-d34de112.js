import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as t,c as a,f as r}from"./app-afa6d82a.js";const s={},h=r(`<h2 id="_1-hashset" tabindex="-1"><a class="header-anchor" href="#_1-hashset" aria-hidden="true">#</a> 1.HashSet</h2><p>HashSet实现了Set接口，内部实现利用了HashMap，有如下特点：</p><pre><code>1）没有重复元素；
2）可以高效地添加、删除元素、判断元素是否存在，效率都为O(1)；
3）没有顺序。
</code></pre><p>HashSet可以方便高效地实现去重、集合运算等功能。如果要保持添加的顺序，可以使用HashSet的一个子类LinkedHashSet。Set还有一个重要的实现类TreeSet，它可以排序。</p><h2 id="_2-treeset" tabindex="-1"><a class="header-anchor" href="#_2-treeset" aria-hidden="true">#</a> 2.TreeSet</h2><p>TreeSet实现了Set接口，但有序。在内部实现上，它基于TreeMap实现，而TreeMap基于大致平衡的排序二叉树：红黑树，这决定了它有如下特点。</p><pre><code>1）没有重复元素。
2）添加、删除元素、判断元素是否存在，效率比较高，为O(log2(N)), N为元素个数。
3）有序，TreeSet同样实现了SortedSet和NavigatableSet接口，可以方便地根据顺序进行查找和操作，如第一个、最后一个、某一取值范围、某一值的邻近元素等。
4）为了有序，TreeSet要求元素实现Comparable接口或通过构造方法提供一个Com-parator对象。
</code></pre><h2 id="_3-linkedhashset" tabindex="-1"><a class="header-anchor" href="#_3-linkedhashset" aria-hidden="true">#</a> 3.LinkedHashSet</h2><p>之前介绍的Map接口的实现类都有一个对应的Set接口的实现类，比如HashMap有HashSet,TreeMap有TreeSet, LinkedHashMap也不例外，它也有一个对应的Set接口的实现类LinkedHashSet。LinkedHashSet是HashSet的子类，它内部的Map的实现类是<strong>LinkedHashMap</strong>，所以它也可以保持插入顺序。</p><h2 id="_4-set和list区别" tabindex="-1"><a class="header-anchor" href="#_4-set和list区别" aria-hidden="true">#</a> 4.Set和List区别？</h2><p><strong>List,Set都是继承自Collection接口。都是用来存储一组相同类型的元素的。</strong></p><p><strong>List特点</strong>：元素有放入顺序，元素可重复 。</p><p>有顺序，即先放入的元素排在前面。</p><p><strong>Set特点</strong>：元素无放入顺序，元素不可重复。</p><p>无顺序，即先放入的元素不一定排在前面。 不可重复，即相同元素在set中只会保留一份。所以，有些场景下，set可以用来去重。 不过需要注意的是，set在元素插入时是要有一定的方法来判断元素是否重复的。这个方法很重要，决定了set中可以保存哪些元素。</p><h2 id="_5-set如何保证元素不重复" tabindex="-1"><a class="header-anchor" href="#_5-set如何保证元素不重复" aria-hidden="true">#</a> 5.Set如何保证元素不重复?</h2><p>在Java的Set体系中，根据实现方式不同主要分为两大类。HashSet和TreeSet。</p><p><strong>1、TreeSet 是二叉树实现的，TreeSet中的数据是自动排好序的，不允许放入 null值</strong></p><p><strong>2、HashSet 是哈希表实现的，HashSet中的数据是无序的，可以放入 null值，但只能放入一个null，两者中的值都不能重复，就如数据库中的唯一约束</strong></p><p>在HashSet中，基本的操作都是由<strong>HashMap</strong>底层实现的，因为HashSet底层是用HashMap存储数据的。当向HashSet中添加元素的时候，首先计算元素的hashCode值，然后通过扰动计算和按位与的方式计算出这个元素的存储位置，如果这个位置为空，就将元素添加进去；如果不为空，则用equals方法比较元素是否相等，相等就不添加，否则找一个空位添加。</p><p>TreeSet的底层是<strong>TreeMap</strong>的keySet()，而<strong>TreeMap</strong>是基于红黑树实现的，红黑树是一种平衡二叉查找树，它能保证任何一个节点的左右子树的高度差不会超过较矮的那棵的一倍。</p><p>TreeMap是按key排序的，元素在插入TreeSet时compareTo()方法要被调用，所以TreeSet中的元素要实现Comparable接口。TreeSet作为一种Set，它不允许出现重复元素。TreeSet是用compareTo()来判断重复元素的。</p>`,22),n=[h];function o(p,S){return t(),a("div",null,n)}const c=e(s,[["render",o],["__file","3.Set.html.vue"]]);export{c as default};

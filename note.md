核心需求：

1. 选取3-5个代表性的新闻网站（比如新浪新闻、网易新闻等，或者某个垂直领域权威性的网站比如经济领域的雪球财经、东方财富等，或者体育领域的腾讯体育、虎扑体育等等）建立爬虫，针对不同网站的新闻页面进行分析，爬取出编码、标题、作者、时间、关键词、摘要、内容、来源等结构化信息，存储在数据库中。
2. 建立网站提供对爬取内容的分项全文搜索，给出所查关键词的时间热度分析。

技术要求：

1. 必须采用Node.JS实现网络爬虫

2. 必须采用Node.JS实现查询网站后端，HTML+JS实现前端（尽量不要使用任何前后端框架）

 代码仓库: https://github.com/ya-hong/crawler

# 开发过程

~~其实主要还是抄代码~~

列一下遇到的坑或者感觉重要的部分。

## js 的异步特性

js代码不是顺序执行的算是我遇到的第一个坑了。之前只会写c++，感觉程序顺序执行是天经地义的事情。调试的时候我发现有点不对劲，怎么程序输出顺序是反着的🤮。

然后我了解了一下异步机制：https://blog.csdn.net/qq_22855325/article/details/72958345

>  异步运行机制大致如下
>
> 1. 所有同步任务都在主线程上执行，形成一个执行栈
> 2. 主线程之外，还存在一个"任务队列"。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件
> 3. 一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。
> 4. 主线程不断重复上面的第三步。

举个例子：

```javascript
console.log("start");
for (i = 1; i <= 10; ++i) {
    setTimeout(function() {
        console.log("sleep " + i);
    }, 1000);
}
setTimeout(function(){
    console.log("sleep1000");
},1000);
console.log("end");

```

输出：

```
start
end
(这里-1s)
sleep 11
sleep 11
sleep 11
sleep 11
sleep 11
sleep 11
sleep 11
sleep 11
sleep 11
sleep 11
sleep1000
```

我的理解是，先执行了`console.log("start")`。然后执行十次`setTimeout`函数，把`callback`丢进队列并开始计时。再执行一次`setTimeout`函数，把`callback`丢进队列并开始计时。执行`console.log("end")`。然后等待1s所有计时全部结束，且此时i=11, 执行所有的`console.log`函数。整个过程用时大概1s。

这里就体现了javascript的优势，虽然他只有一个线程执行代码，但是它还有其他线程来执行其他任务，用异步的方式可以在进行耗时任务时执行其他代码。如果这段代码用c++写就肯定要等上11s了。

## 回调函数

JS的函数貌似和其他数据类型没有区别，也可以作为参数传递。用回调函数的方式可以使部分的异步函数按顺序执行。 

## eval() 函数

一个很强大的函数，`eval(s)` 可以把s当作代码执行。虽然它好像有效率低，不安全的缺点，但是在爬虫实验里我觉得这个函数使封装代码变得很方便。

## request 的使用

用来拿到网页源码。

## cheerio 的使用

用cheerio加载网站种子页面，可以方便的搜索出新闻链接。加载新闻页面也可以方便我们查找其中的各种元素。

一些用法：

+   加载网页

    ```javascript
    var $ = myCheerio.load(html, { decodeEntities: true });
    ```

+   查找标签（例如meta标签）

    ```javascript
    $('meta');
    ```

+   查找某个属性的标签

    ```javascript
    $('meta[name="keyword"]');
    ```

+   查找标签下的标签（例如div标签下的a标签）

    ```javascript
    $('div a');
    ```

    查找div下为a的子标签

    ```javascript
    $('div>a');
    ```

+   查找某属性值（例如name属性为keywords的meta标签的content属性的属性值）

    ```javascript
    $('meta[name="keywords"]').eq(0).attr("content");
    ```

+   整合文本信息

    ```javascript
    $('div[class="article"]').text();
    ```



## mysql 数据库的使用

其实我第一天就爬了一些数据了，但是不知道怎么搜索。查到elasticsearch可以实现搜索但是一直没搞明白怎么用，就一直搁置了。



## 正则表达式



## express 框架



# 代码实现&成果展示



# 学习体会




# DOM事件


## DOM事件的级别

### DOM0 
`element.onclick = function(){}`

DOM0级事件具有极好的跨浏览器优势，会以最快的速度绑定。
为某一个元素的同一个行为绑定不同的方法在行内会分别执行。
```js
<div id="box" onclick="fun1();fun2()">点我</div>
<script>
	// 某一个元素的同一个行为绑定不同的方法在行内会分别执行
	function fun1() {
		console.log('方法1');
	}
	function fun2() {
		console.log('方法2');
	}
	// 执行 方法1		// 执行方法2
</script>
```
为某一个元素的同一个行为绑定不同的方法在script标签中后面的方法会覆盖前面的方法。
```js
<div id="box">点我</div>
<script>
	// 某一个元素的同一个行为绑定不同的方法在script标签中后面的方法会覆盖前面的方法
	var box = document.getElementById('box');
	box.onclick = fun1;
	box.onclick = fun2;
	function fun1() {
		console.log('方法1');
	}
	function fun2() {
		console.log('方法2');
	}
	// 执行方法2；方法2覆盖方法1，所有方法1不执行
</script>
```

解绑事件:btn.onclick = null; 将对应事件属性设为null

### DOM2级事件
`EventTarget.addEventListener(type, listener, options)`

DOM2级事件在DOM0级事件的基础上弥补了一个处理程序无法同时绑定多个处理函数的缺点，允许给一个处理程序添加多个处理函数。
```js
<div id="box">点我</div>
<script>
 	var box = document.getElementById('box');
	box.addEventListener('click', fun1,false);
	box.addEventListener('click', fun2,false);
	function fun1() {
		console.log('方法1');
	}
	function fun2() {
		console.log('方法2');
	}
	// 执行方法1		// 执行方法2
</script>
```
DOM2级事件定义了addEventListener和removeEventListener两个方法，分别用来绑定和解绑事件，addEventListener方法中包含3个参数


addEventListener(type, listener);
addEventListener(type, listener, options);
addEventListener(type, listener, useCapture);

- type 表示监听事件类型的大小写敏感的字符串。事件名称。
- listener 当所监听的事件类型触发时，会接收到一个事件通知（实现了 [Event](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 接口的对象）对象。listener 必须是一个实现了 EventListener 接口的对象，或者是一个函数。
- useCapture 可选 一个布尔值，表示在 DOM 树中注册了 listener 的元素，是否要先于它下面的 EventTarget 调用该 listener。当 useCapture（设为 true）时，沿着 DOM 树向上冒泡的事件不会触发 listener。当一个元素嵌套了另一个元素，并且两个元素都对同一事件注册了一个处理函数时，所发生的事件冒泡和事件捕获是两种不同的事件传播方式。事件传播模式决定了元素以哪个顺序接收事件。如果没有指定，useCapture 默认为 false。
    > 是否在捕获时执行事件处理函数，默认为false，在事件冒泡阶段处理事件。
- options 可选 一个指定有关 listener 属性的可选参数对象。可用的选项如下：
    - capture 可选 一个布尔值，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
    - once 可选 一个布尔值，表示 listener 在添加之后最多只调用一次。如果为 true，listener 会在其被调用之后自动移除。
    - passive 可选 一个布尔值，设置为 true 时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。
    - signal 可选 [AbortSignal](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortSignal)，该 AbortSignal 的 abort() 方法被调用时，监听器会被移除。

删除DOM 2事件处理程序，通过removeEventListener

```js
box.removeEventListener('click', fun2,false);
```

### DOM3

>DOM3 较 DOM2 多了很多事件类型
DOM3级事件在DOM2级事件的基础上添加了更多的事件类型，全部类型如下：

- UI事件，当用户与页面上的元素交互时触发，如：load、scroll
- 焦点事件，当元素获得或失去焦点时触发，如：blur、focus
- 鼠标事件，当用户通过鼠标在页面执行操作时触发如：dbclick、mouseup
- 滚轮事件，当使用鼠标滚轮或类似设备时触发，如：mousewheel
- 文本事件，当在文档中输入文本时触发，如：textInput
- 键盘事件，当用户通过键盘在页面上执行操作时触发，如：keydown、keypress
- 合成事件，当为IME（输入法编辑器）输入字符时触发，如：compositionstart
- 变动事件，当底层DOM结构发生变化时触发，如：DOMsubtreeModified
- 同时DOM3级事件也允许使用者自定义一些事件。

## DOM事件流

DOM (文档对象模型)结构是一个树型结构，当一个 HTML元素 产生一个事件时，该事件会在元素节点与根结点之间的路径传播，路径所经过的结点都会收到该事件，这个传播过程可称为DOM事件流，完整的事件流分三个阶段，捕获、目标阶段、冒泡；

### DOM事件流的三个阶段
即一个事件触发后，会在子元素和父元素之间传播，这个传播分三个阶段，DOM2级事件规定的事件流包括三个阶段：

- 事件捕获阶段
从window对象依次向下传播，到达目标节点，即为捕获阶段。即: window -> document -> html -> body -> … -> 某个具体的元素

- 处于目标阶段
在目标节点触发事件，即为目标阶段

- 事件冒泡阶段
从目标节点依次向上传播，到达window对象，某个具体的元素 -> … -> body -> html -> document -> window，即为冒泡阶段。

注：默认addEventListener()使用冒泡型事件流。

![event.png](//static.jmni.cn/blog/img/416ef840eb7c4ca282277a7046738d3b.png)
### 事件冒泡举例

```html
<div id="a" style="width: 300px; height: 300px;background-color: antiquewhite;">
	a
	<div id="b" style="width: 300px; height: 200px;background-color: burlywood;">
		b
		<div id="c" style="width: 300px; height: 100px;background-color: cornflowerblue;">
			c
		</div>
	</div>
</div>
<script>
	var a = document.getElementById('a')
	var b = document.getElementById('b')
	var c = document.getElementById('c')
  //注册冒泡事件监听器
	a.addEventListener('click', () => {console.log("冒泡a")})
	b.addEventListener('click', () => {console.log('冒泡b')})
	c.addEventListener('click', () => {console.log("冒泡c")})

</script>
```
当我们点击c时，执行结果如下：

![dom.png](//static.jmni.cn/blog/img/fa24f6661bfe4a5da1937879700ef76c.png)


### 事件捕获举例

```html
<div id="a" style="width: 300px; height: 300px;background-color: antiquewhite;">
	a
	<div id="b" style="width: 300px; height: 200px;background-color: burlywood;">
		b
		<div id="c" style="width: 300px; height: 100px;background-color: cornflowerblue;">
			c
		</div>
	</div>
</div>
<script>
	var a = document.getElementById('a')
	var b = document.getElementById('b')
	var c = document.getElementById('c')
  //注册冒泡事件监听器
	
    a.addEventListener('click', () => {console.log("捕获a")}, true)
    b.addEventListener('click', () => {console.log('捕获b')}, true)
    c.addEventListener('click', () => {console.log("捕获c")}, true)

</script>
```
当我们点击c时，执行结果如下：

![dom2.png](//static.jmni.cn/blog/img/dc3fccc10ee54429934266236ec0fe38.png)

## 事件代理（事件委托）

**事件代理就是利用事件冒泡或事件捕获的机制把一系列的内层元素事件绑定到外层元素**

```html
<ul id="item-list">
	<li>item1</li>
	<li>item2</li>
	<li>item3</li>
	<li>item4</li>
</ul>
```

上述的列表元素，我们希望将用户点击了哪个item打印出来，通常我们可以给每个item注册点击事件监听器，但是需要对每个元素进行事件监听器的注册；但是通过事件代理，我们可以将多个事件监听器减少为一个，这样就减少代码的重复编写，

当然也有一个很重要的场景，**当你不知道你要点击的元素什么时候在DOM中渲染时，事件委托无疑是一个很好的解决办法**

```js
var items = document.getElementById('item-list');
//事件捕获实现事件代理
items.addEventListener('click', (e) => {console.log('捕获：click ',e.target.innerHTML)}, true);
//事件冒泡实现事件代理
items.addEventListener('click', (e) => {console.log('冒泡：click ',e.target.innerHTML)}, false);
```

事件代理既可以通过事件冒泡来实现，也可以通过事件捕获来实现。


## Event 对象的常见应用

- event.preventDefault()
  >阻止默认事件，比如阻止a标签跳转
- event.stopPropagation()
  >阻止冒泡行为
- event.target
  >当多个子元素 都要绑定一个行为，为了优化，我们利用事件委托，可以在其父元素上绑定该行为，并通过event.target寻找触发事件的父元素的子元素
- event.stoplmmediatePropagation()
  >若一个dom元素绑定了两个点击事件a、b，若点击该元素，只想执行其中一个事件a，而阻止事件b，在a中的函数添加该行代码即可，属于事件响应的优先级
 


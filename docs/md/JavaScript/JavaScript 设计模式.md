# JavaScript 设计模式

## SOLID设计原则
- 单一功能原则（Single Responsibility Principle）
- 开放封闭原则（Opened Closed Principle）
- 里式替换原则（Liskov Substitution Principle）
- 接口隔离原则（Interface Segregation Principle）
- 依赖反转原则（Dependency Inversion Principle）

前端常用的设计模式其实只有7种：

## 工厂模式
- jQuery $ 
- Vue _createElementVNode 
- React createElement

## 单例模式
> 保证一个类仅有一个实例，并提供一个访问它的全局访问点，这样的模式就叫做单例模式
- 登录框
- Vuex store

## 观察者模式	
- DOM时间
- React Vue组件生命周期
- Vue watch
- Vue组件更新过程
- MutationObserver
- 自定义事件EventBus
- postMessage



## 原型模式

> ES6中类的底层实现是原型继承

```js
class Dog {
  constructor(name ,age) {
   this.name = name
   this.age = age
  }
  
  eat() {
    console.log('eat')
  }
}
```

等价于

```js
function Dog(name, age) {
  this.name = name
  this.age = age
}
Dog.prototype.eat = function() {
  console.log('eat')
}
```

- JS原型和原型链
- Object.create
- 对象属性描述符

## 装饰器模式
>装饰器的最基本操作——定义装饰器函数，将被装饰者“交给”装饰器。这也正是装饰器语法糖首先帮我们做掉的工作 —— 函数传参&调用。

- Decorator语法
- AOP面向切面编程
- HOC (Higher Order Component) 高阶组件

来看一个体现了装饰器模式的例子
在不改变原对象的基础上，通过对其进行包装拓展，使原有对象可以满足用户的更复杂需求，即“只添加，不修改”。
>不想去关心它现有的业务逻辑是啥样的,只对它已有的功能做个拓展，只关心拓展出来的那部分新功能如何实现

```js
// 定义打开按钮
class OpenButton {
    // 点击后展示弹窗（旧逻辑）
    onClick() {
        const modal = new Modal();
        modal.style.display = 'block';
    }
}

// 定义按钮对应的装饰器
class Decorator {
    // 将按钮实例传入
    constructor(open_button) {
        this.open_button = open_button;
    }

    onClick() {
        this.open_button.onClick();
        // “包装”了一层新逻辑
        this.changeButtonStatus();
    }

    changeButtonStatus() {
        this.changeButtonText();
        this.disableButton();
    }

    disableButton() {
        const btn = document.getElementById('open');
        btn.setAttribute('disabled', true);
    }

    changeButtonText() {
        const btn = document.getElementById('open');
        btn.innerText = '快去登录';
    }
}

const openButton = new OpenButton();
const decorator = new Decorator(openButton);

document.getElementById('open').addEventListener('click', function () {
    // openButton.onClick()
    // 此处可以分别尝试两个实例的onClick方法，验证装饰器是否生效
    decorator.onClick();
});
```

ES7 中的装饰器，通过一个@语法糖轻松地给一个类装上装饰器
浏览器和 Node 目前都不支持装饰器语法，需要安装 Babel 当然也可以使用TS去用 `tsc`，`tsup`编译：
```
npm install babel-cli -g
npm install babel-preset-env babel-plugin-transform-decorators-legacy --save-dev
```
编写配置文件.babelrc：
```json
{
  "presets": ["env"],
  "plugins": ["transform-decorators-legacy"]
}
```
对目标文件进行转码，比如说你的目标文件叫做 test.js，想要把它转码后的结果输出到 babel_test.js，就可以这么写:
```
babel test.js --out-file babel_test.js
```
就可以看到你的装饰器是否生效

装饰器函数装饰类，它只有一个参数是目标类

```ts
// 装饰器函数，它只有一个参数是目标类
function classDecorator(target) {
    target.hasDecorator = true
  	return target
}

// 将装饰器“安装”到Button类上
@classDecorator
class Button {
    // Button类的相关逻辑
}

// 验证装饰器是否生效
console.log('Button 是否被装饰了：', Button.hasDecorator)
```

也可以用同样的语法糖去装饰类里面的方法
去装饰类里面的方法时，有三个参数

>数据描述符：包括 value（存放属性值，默认为默认为 undefined）、writable（表示属性值是否可改变，默认为true）、enumerable（表示属性是否可枚举，默认为 true）、configurable（属性是否可配置，默认为true）
>存取描述符：包括 get 方法（访问属性时调用的方法，默认为 undefined），set（设置属性时调用的方法，默认为 undefined ）
```js
/**
 * 
 * @param target 目标类
 * @param name 修饰的目标属性属性名
 * @param descriptor 属性描述对象”（attributes object）这些描述符又分为数据描述符和存取描述符
 * @returns 
 */
function funcDecorator(target, name, descriptor) {
    let originalMethod = descriptor.value
    descriptor.value = function() {
    console.log('我是Func的装饰器逻辑')
    return originalMethod.apply(this, arguments)
  }
  return descriptor
}

class Button {
    @funcDecorator
    onClick() { 
        console.log('我是Func的原有逻辑')
    }
}

// 验证装饰器是否生效
const button = new Button()
button.onClick()
```



高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件。HOC高阶组件,它是装饰器模式在 React 中的实践

```jsx
import React, { Component } from 'react'

const BorderHoc = WrappedComponent => class extends Component {
  render() {
    return <div style={{ border: 'solid 1px red' }}>
      <WrappedComponent />
    </div>
  }
}
export default borderHoc
```

用它来装饰目标组件

```jsx
import React, { Component } from 'react'
import BorderHoc from './BorderHoc'

// 用BorderHoc装饰目标组件
@BorderHoc 
class TargetComponent extends React.Component {
  render() {
    // 目标组件具体的业务逻辑
  }
}

// export出去的其实是一个被包裹后的组件
export default TargetComponent
```


## 代理模式
>在某些情况下，出于种种考虑/限制，一个对象不能直接访问另一个对象，需要一个第三者（代理）牵线搭桥从而间接达到访问目的，这样的模式就是代理模式。

事件代理

```js
// 获取父元素
const father = document.getElementById('father')

// 给父元素安装一次监听函数
father.addEventListener('click', function(e) {
    // 识别是否是目标子元素
    if(e.target.tagName === 'A') {
        // 以下是监听函数的函数体
        e.preventDefault()
        alert(`我是${e.target.innerText}`)
    }
} )
```

虚拟代理  -  图片预加载

```js
class PreLoadImage {
    constructor(imgNode) {
        // 获取真实的DOM节点
        this.imgNode = imgNode
    }
     
    // 操作img节点的src属性
    setSrc(imgUrl) {
        this.imgNode.src = imgUrl
    }
}

class ProxyImage {
    // 占位图的url地址
    static LOADING_URL = 'xxxxxx'

    constructor(targetImage) {
        // 目标Image，即PreLoadImage实例
        this.targetImage = targetImage
    }
    
    // 该方法主要操作虚拟Image，完成加载
    setSrc(targetUrl) {
       // 真实img节点初始化时展示的是一个占位图
        this.targetImage.setSrc(ProxyImage.LOADING_URL)
        // 创建一个帮我们加载图片的虚拟Image实例
        const virtualImage = new Image()
        // 监听目标图片加载的情况，完成时再将DOM上的真实img节点的src属性设置为目标图片的url
        virtualImage.onload = () => {
            this.targetImage.setSrc(targetUrl)
        }
        // 设置src属性，虚拟Image实例开始加载图片
        virtualImage.src = targetUrl
    }
}
```
缓存代理

```js
// addAll方法会对你传入的所有参数做求和操作
const addAll = function() {
    console.log('进行了一次新计算')
    let result = 0
    const len = arguments.length
    for(let i = 0; i < len; i++) {
        result += arguments[i]
    }
    return result
}

// 为求和方法创建代理
const proxyAddAll = (function(){
    // 求和结果的缓存池
    const resultCache = {}
    return function() {
        // 将入参转化为一个唯一的入参字符串
        const args = Array.prototype.join.call(arguments, ',')
        
        // 检查本次入参是否有对应的计算结果
        if(args in resultCache) {
            // 如果有，则返回缓存池里现成的结果
            return resultCache[args]
        }
        return resultCache[args] = addAll(...arguments)
    }
})()
```

- DOM事件代理
- Webpack devServer
- nginx反向代理
- Proxy和Reflect

## 迭代器模式	
- Symbol.iterator
- for...of...
- Generator和yield

>ES6约定，任何数据结构只要具备Symbol.iterator属性（这个属性就是Iterator的具体实现，它本质上是当前数据结构默认的迭代器生成函数），就可以被遍历——准确地说，是被for...of...循环和迭代器的next方法遍历。 事实上，for...of...的背后正是对next方法的反复调用。

>数据结构含有Symbol.iterator方法，就是一个可迭代对象，可以被for...of...访问。for..of的本质就是不断调用next方法


```js
const arr = [1, 2, 3]
// 通过调用iterator，拿到迭代器对象
const iterator = arr[Symbol.iterator]()

// 对迭代器对象执行next，就能逐个访问集合的成员
iterator.next()
iterator.next()
iterator.next()
```

而for...of...做的事情，基本等价于下面这通操作：

```js
// 通过调用iterator，拿到迭代器对象
const iterator = arr[Symbol.iterator]()

// 初始化一个迭代结果
let now = { done: false }

// 循环往外迭代成员
while(!now.done) {
    now = iterator.next()
    if(!now.done) {
        console.log(`现在遍历到了${now.value}`)
    }
}
```
可以看出，for...of...其实就是iterator循环调用换了种写法。


编写一个迭代器生成函数：
>每调用一次Generator函数，就返回一个迭代器对象，代表Generator函数的内部指针。以后，每次调用迭代器对象的next方法，就会返回一个有着value和done两个属性的对象。value属性表示当前的内部状态的值，是yield语句后面那个表达式的值；done属性是一个布尔值，表示是否遍历结束

es6 yield语法糖实现迭代器生成函数

```js
// 编写一个迭代器生成函数，带*号
function *iteratorGenerator() {
    yield '1号选手'
    yield '2号选手'
    yield '3号选手'
}

const iterator = iteratorGenerator()

iterator.next()
iterator.next()
iterator.next()
```

关于yield语法糖
>yield语句只能用于function*的作用域，如果function*的内部还定义了其他的普通函数，则函数内部不允许使用yield语句



- 遇到yield语句，就暂停执行后面的操作，并将紧跟在yield后面的那个表达式的值，作为返回的对象的value属性值。
- 下一次调用next方法时，再继续往下执行，直到遇到下一个yield语句
- 如果没有再遇到新的yield语句，就一直运行到函数结束，直到return语句为止，并将return语句后面的表达式的值，作为返回的对象的value属性值
- 如果该函数没有return语句，则返回的对象的value属性值为undefined


换到ES5实现迭代器生成函数

```js
// 定义生成器函数，入参是任意集合
function iteratorGenerator(list) {
    // idx记录当前访问的索引
    var idx = 0
    // len记录传入集合的长度
    var len = list.length
    return {
        // 自定义next方法
        next: function() {
            // 如果索引还没有超出集合长度，done为false
            var done = idx >= len
            // 如果done为false，则可以继续取值
            var value = !done ? list[idx++] : undefined
            
            // 将当前值与遍历是否完毕（done）返回
            return {
                done: done,
                value: value
            }
        }
    }
}

var iterator = iteratorGenerator(['1号选手', '2号选手', '3号选手'])
iterator.next()
iterator.next()
iterator.next()
```











---
title: "JavaScript 笔记"
tag: "JavaScript"
classify: "md"
description: "笔记"
pubDate: "2023/2/21 16:48:01"
heroImage: ""
---

### 笔记

## 判断值的类型

```js
console.log(Object.prototype.toString.call("obj")); //[object String]
console.log(Object.prototype.toString.call([])); //[object Array]
console.log(Object.prototype.toString.call(1)); //[object Number]
console.log(Object.prototype.toString.call(true)); //[object Boolean]
console.log(Object.prototype.toString.call(null)); //[object Null]
console.log(Object.prototype.toString.call(undefined)); //[object Undefined]

let obj1 = {};

Object.defineProperty(obj1, Symbol.toStringTag, { value: "lll" });
console.log(Object.prototype.toString.call(obj1)); //[object lll]

let obj = {};
let ageValue = 10;
Object.defineProperty(obj, "age", {
  get() {
    return ageValue;
  },
  set(val) {
    ageValue = val;
  },
  enumerable: true,
  configurable: true,
});

console.log(obj.age); //10
obj.age = 20;
console.log(obj.age); //20
```

## CommonJs 与 ESModule 区别

- CommonJs 导出的是一个值拷贝，会对加载结果进行缓存，一旦内部再修改这个值，则不会同步到外部。ESModule 是导出的一个引用，内部修改可以同步到外部

## 算法题 字符串是由括号组成，判断括号是否有效

```js
/**
 * 字符串是由括号组成，判断括号是否有效
 * @param {string} str '[({})]'  '[]({})]'
 * @returns Boolean
 */
function bracket(str) {
  let arr = [];
  let map = {
    "[": "]",
    "{": "}",
    "(": ")",
  };
  for (let i = 0; i < str.length; i++) {
    const element = str[i];
    if (map[element]) {
      arr.push(element);
    } else if (map[arr[arr.length - 1]] === element) {
      arr.pop();
    }
  }
  return !!!arr.length;
}
```

## 用迭代器简化循环

```js
/**
 *
 * @param {*} min
 * @param {*} max
 * @param {*} step
 */
let range = function* (min, max, step = 1) {
  if (max === undefined) {
    for (let i = 0; i < min; i += step) {
      yield i;
    }
  } else {
    for (let i = min; i < max; i += step) {
      yield i;
    }
  }
};
let enumerate = function* (iterator) {
  let i = 0;
  for (let item of iterator) {
    yield [i, item];
    i++;
  }
};
for (let [i, v] of enumerate(range(89, 152, 5))) {
  console.log(i, v);
}

for (let i of range(89, 152, 5)) {
  console.log(i);
}
```

## Set 集合

### Set 增删改查

```js
// Set 增删改查
const s = new Set();
s.add(1).add(2);
s.add(1);
s.delete(1);
console.log(s.has(1));
console.log(s);
```

### 集合转化数组

```js
// 集合转化数组
let arr1 = [...s];
```

### 数组转化集合

```js
// 数组转化集合
let arr = [1, 2, 3, 4, 5, 6, 6];
const s1 = new Set(arr);
```

### 实现交并补

```js
// 实现交并补
/**
 * 实现交
 * @param {Set} other
 */
Set.prototype.f = function (other) {
  const res = new Set();
  this.forEach((v) => {
    if (other.has(v)) {
      res.add(v);
    }
  });
  return res;
};

let f1 = new Set([1, 2, 3, 4]);
let f2 = new Set([3, 4, 5, 6]);
console.log(f1.f(f2));
```

### Set 内是值 或者 值的地址

```js
// Set 内是值 或者 值的地址
let arr4 = [];
let f4 = new Set();
f4.add({});
f4.add(arr4);
f4.add(arr4);
// f4.add([])
// f4.add([])
f4.add(function (params) {});
console.log(f4);
```

### 产生的问题

```js
// 产生的问题
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  toString() {
    return `${this.x}, ${this.y}`;
  }
  static fromString(str) {
    let [x, y] = str.split(",");
    return new Point(x, y);
  }
}
let p1 = new Point(1, 1);
let p3 = new Point(1, 1);

let set1 = new Set();
set1.add(p1);
set1.add(new Point(1, 1));

console.log(set1); //Set(2) { Point { x: 1, y: 1 }, Point { x: 1, y: 1 } }

let set2 = new Set();
set2.add(p1.toString());
set2.add(new Point(1, 1).toString());

console.log(set2); //Set(1) { '1, 1' }

set2.forEach((v) => {
  console.log(Point.fromString(v));
});
```

## 面试题 如何打印 Win?

```js
var a = 1;

// const a = {
//     _a: 0,
//     toString: function () {
//         return ++this._a
//     }
// }
// var a = 1;
// Object.defineProperty(window, "a", {
//     get() {
//         return this.value++;
//     }
// });

if (a == 1 && a == 2 && a == 3) {
  console.log("Hello world!");
}
```

### valueOf 返回的值是基本数据类型时才会按照此值进行计算，如果不是基本数据类型，则将使用 toString()方法返回的值进行计算。

```js
class Person {
  constructor(name) {
    this.name = name;
  }
  // 复写 valueOf 方法
  valueOf() {
    return this.name;
  }
  toString() {
    return `toString ${this.name}`;
  }
}
const best = new Person("nini");
console.log(best); // log: Person {name: "nini"}           复写 valueOf Person { name: 'nini' } 复写 toString Person { name: 'nini' }toString
console.log(best.toString()); // log: [object Object]      复写 valueOf [object Object]         复写 toString toString nini
console.log(best.valueOf()); // log: Person {name: "nini"} 复写 valueOf nini                    复写 toString nini
console.log(best + "mimi"); // log: [object Object]mimi    复写 valueOf ninimimi                复写 toString ninimimi
```

### 并不是基本数据类型，所以当执行加法运算的时候取 toString()方法返回的值进行计算，当然如果没有 valueOf()方法，就会去执行 toString()方法。

```js
const best1 = new Person({ name: "nini" });
console.log(best1); // log:Person { name: { name: 'nini' } }
console.log(best1.toString()); // log: toString [object Object]
console.log(best1.valueOf()); // log: { name: 'nini' }
console.log(best1 + "mimi"); // log:toString [object Object]mimi 现在传入的name是一个对象new Person({ name: "nini" })，
```

### 这里就比较简单，直接改写 toString()方法，由于没有 valueOf()，当他做运算判断 a == 1 的时候会执行 toString()的结果。

```js
class A {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value++;
  }
}
const a = new A(1);
if (a == 1 && a == 2 && a == 3) {
  console.log("Hello world!");
}
```

### 你也可以不使用 toString，换成 valueOf 也行，效果也是一样的

```js
class B {
  constructor(value) {
    this.value = value;
  }
  valueOf() {
    return this.value++;
  }
}

const b = new B(1);
console.log(b);
if (b == 1 && b == 2 && b == 3) {
  console.log("Hello world!");
}
```

## new操作符

- 创建一个空对象（即{}）
- 为新对象添加属性 __proto__ ，将该属性链接至构造函数的原型对象 
- 执行构造函数方法，属性和方法被添加到this引用的对象中
- 如果构造函数中没有返回新对象，那么返回this，即创建这个新对象，否则，返回构造函数中返回的对象

```js
var obj = new Da();
```
实现
```js
var obj = {};
obj.__proto__ = Da.prototype;
Da.call(obj);
```

## defer 和 async

![defer和async.png](//static.jmni.cn/blog/img/9094ad96c82c2ddce9f1.png)
defer 和 async 加载不阻塞
async 执行可能阻塞可能不阻塞，主要看加载速度
defer 执行不阻塞

> `<script>`标签上有 defer 或 async 属性，脚本就会异步加载。
> 渲染引擎遇到这一行命令，就会开始下载外部脚本.
> 但不会等它下载和执行，而是直接执行后面的命令。

defer 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；
async 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。
一句话，defer 是“渲染完再执行”，async 是“下载完就执行”。
另外，如果有多个 defer 脚本，会按照它们在页面出现的顺序加载，
而多个 async 脚本是不能保证加载顺序的。

async 对于应用脚本的用处不大，因为它完全不考虑依赖（哪怕是最低级的顺序执行），不过它对于那些可以不依赖任何脚本或不被任何脚本依赖的脚本来说却是非常合适的，最典型的例子：Google Analytics

## loader 和 plugin 的区别

loader 即为文件加载器，操作的是文件，将文件 A 通过 loader 转换成文件 B，是一个单纯的文件转化过程。

plugin 即为插件，是一个扩展器，丰富 webpack 本身，增强功能 ，针对的是在 loader 结束之后，webpack 打包的整个过程，他并不直接操作文件，而是基于事件机制工作，监听 webpack 打包过程中的某些节点，执行广泛的任务。

## 死锁产生的四个条件

## HTTPS 原理详解

协议
1、HTTP 协议（HyperText Transfer Protocol，超文本传输协议）：是客户端浏览器或其他程序与 Web 服务器之间的应用层通信协议 。

2、HTTPS 协议（HyperText Transfer Protocol over Secure Socket Layer）：可以理解为 HTTP+SSL/TLS， 即 HTTP 下加入 SSL 层，HTTPS 的安全基础是 SSL，因此加密的详细内容就需要 SSL，用于安全的 HTTP 数据传输。

![https.png](//static.jmni.cn/blog/img/5aa773b3e56301c2e969.png)
如上图所示 HTTPS 相比 HTTP 多了一层 SSL/TLS

SSL（Secure Socket Layer，安全套接字层）：1994 年为 Netscape 所研发，SSL 协议位于 TCP/IP 协议与各种应用层协议之间，为数据通讯提供安全支持。

TLS（Transport Layer Security，传输层安全）：其前身是 SSL，它最初的几个版本（SSL 1.0、SSL 2.0、SSL 3.0）由网景公司开发，1999 年从 3.1 开始被 IETF 标准化并改名，发展至今已经有 TLS 1.0、TLS 1.1、TLS 1.2 三个版本。SSL3.0 和 TLS1.0 由于存在安全漏洞，已经很少被使用到。TLS 1.3 改动会比较大，目前还在草案阶段，目前使用最广泛的是 TLS 1.1、TLS 1.2。

## typeof 和 instanceof

`typeof null` 输出结果为 `object`
`instanceof`的判断就是根据原型链进行搜寻，在对象 obj1 的原型链上如果存在另一个对象 obj2 的原型属性，那么表达式（obj1 instanceof obj2）返回值为 true；否则返回 false

## v8 垃圾回收

[https://time.geekbang.org/column/article/230845](https://time.geekbang.org/column/article/230845)





## js 拷贝 & 如何拷贝正则表达式的值

```js
let obj2 = {...obj1}
let arr2 = [...arr1] //跟 arr.slice()一样的效果

let arr1 = [1,2,3]
let arr2 = arr1.slice()

let arr1 = [1,2,3]
let arr2 = arr1.concat()
```

`JSON.parse(JSON.stringify(target))`

**JSON.stringify 会丢失的内容有以下内容**
使用 JSON.Stringify 转换的数据中，如果包含 function，undefined，Symbol，这几种类型，不可枚举属性，JSON.Stringify 序列化后，这个键值对会消失。
转换的数据中包含 NaN，Infinity 值（含-Infinity），JSON 序列化后的结果会是 null。
转换的数据中包含 Date 对象，JSON.Stringify 序列化之后，会变成字符串。
转换的数据包含 RegExp 引用类型序列化之后会变成空对象。
无法序列化不可枚举属性。
无法序列化对象的循环引用，对象成环（例如: obj[key] = obj)。
无法序列化对象的原型链。

**获取数据类型**

typeof：能准确判断基本数据类型，但一般复杂数据类型无法判断
instanceof：能准确判断复杂数据类型，但基本数据类型不行
Object.property.toString.call：全部可以

**拷贝 set**

```js
function deepClone(val) {
  if (isSet(val)) {
    const set = new Set();
    val.forEach((item) => {
      set.add(deepClone(item));
    });
  }
}
```

**拷贝正则和date**
```js
  function deepClone (val) {
  const Ctor = val.constructor
  if (isDate(val)) {
    return new Ctor(+val)
  } else if (isRegExp(val)) {
    const reFlags = /\w*$/;
    // 此处不用flags的原因在于flags方法返回的修饰符是按照字母顺序排列的
    const reg = new Ctor(val.source, reFlags.exec(val))
    reg.lastIndex = val.lastIndex
    return reg
  }
}
```






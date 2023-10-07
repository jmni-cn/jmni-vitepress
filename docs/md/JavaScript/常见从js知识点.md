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


---
title: "图解 __proto__、prototype 和 constructor"
tag: "JavaScript"
classify: "md"
description: "图解 __proto__、prototype 和 constructor"
pubDate: "2023/2/20 11:14:11"
heroImage: "//static.jmni.cn/blog/img/0e8aac3210394c91a15f25261d0548ad.png"
---

# 图解 __proto__、prototype 和 constructor

我在图纸上画构造函数、实例、原型、`constructor` 、`__proto__`、`prototype`三者之间的关系图时，顺着`__proto__`和`prototype`试图寻找 JavaScript 宇宙本源的时候，
在图纸上画着画着发现`Function.__proto__`该指向哪里？心里有一个大胆的猜想
## Function 作为构造函数，同时又是自己的实例


然后向控制台输入这样一串代码的时候

```js
console.log(Function.prototype === Function.__proto__);
```

我的世界顿时凌乱了，我知道我不应该用正常的思维去理解这件事。
`Function` 作为构造函数 又是自己的实例，或许这大概就是 MDN 上写的标准内置对象了吧，我只能接受它。

![prototype.png](//static.jmni.cn/blog/img/0e8aac3210394c91a15f25261d0548ad.png)

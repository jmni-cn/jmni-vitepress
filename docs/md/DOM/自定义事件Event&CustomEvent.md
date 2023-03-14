# 自定义事件Event&CustomEvent
来源：https://blog.webdevsimplified.com/2022-04/js-custom-events/
## Event

在最基本的形式中，您需要做的就是将单个字符串传递给构造函数，这是自定义事件的名称。
```js
const myEvent = new Event("myCustomEvent")
```
为了监听该事件，只需将事件监听器添加到想要监听事件的任何元素。
```js
document.addEventListener("myCustomEvent", e => {
  console.log(e)
})
```
最后一步，需要执行的是实际触发创建并正在侦听的事件。
```js
document.dispatchEvent(myEvent)
```
这就是该`dispatchEvent`函数的用武之地。每个元素都有这个函数，需要传递给它的只是创建的事件对象`new Event`


```js
{
  isTrusted: false
  bubbles: false
  cancelBubble: false
  cancelable: false
  composed: false
  currentTarget: null
  defaultPrevented: false
  eventPhase: 0
  path: [document, window]
  returnValue: true
  srcElement: document
  target: document
  timeStamp: 54.69999998807907
  type: "myCustomEvent"
}
```

`isTrusted`属性仅指此事件是由用户交互触发还是由自定义 JavaScript 代码触发。例如，当用户单击按钮时，事件将`isTrusted`设置为 `true`，而我们的自定义事件已`isTrusted`设置为 `false`，因为该事件是由 JavaScript 触发的。

`target`，`dispatchEvent`被调用的元素
`timeStamp`是自事件发生时页面加载以来的时间。

`type`只是事件的名称。

### Event Customization

```js
const myEvent = new Event("myCustomEvent", {
  bubbles: true,
  cancelable: true,
  composed: true
})
```
### 冒泡 bubbles

当事件触发后，`bubbles`属性确定事件在触发时是否应通过 HTML 冒泡。默认为 false，这意味着事件不会向上传播树，但如果我们希望在 HTML 元素的每个父元素上调用事件，则可以将其设置为 true。

```js
const bubbleEvent = new Event("bubbleEvent", { bubbles: true })
const defaultEvent = new Event("defaultEvent", { bubbles: false })

document.addEventListener("bubbleEvent", () => {
    // 这将被调用，因为事件将从按钮冒泡到文档
    console.log("Bubble")
})

document.addEventListener("defaultEvent", () => {
    // 这永远不会被调用，因为事件不能从按钮冒泡到文档
    console.log("Default")
})

const button = document.querySelector("button")
button.dispatchEvent(bubbleEvent)
button.dispatchEvent(defaultEvent)
```
### 可取消cancelable

`cancelable`属性确定是否可以通过调用`e.preventDefault()`取消。默认为 false 不可以。如果此属性为true，你可以调用 `e.preventDefault()` 方法。`e.preventDefault()` 会将事件属性`defaultPrevented`设置为 true。
```js
const cancelableEvent = new Event("cancelableEvent", { cancelable: true })
const defaultEvent = new Event("defaultEvent", { cancelable: false })

document.addEventListener("cancelableEvent", e => {
  e.preventDefault()
  console.log(e.defaultPrevented) // True
})

document.addEventListener("defaultEvent", e => {
  e.preventDefault()
  console.log(e.defaultPrevented) // False
})

document.dispatchEvent(cancelableEvent)
document.dispatchEvent(defaultEvent)
```

### composed

如果返回的 Boolean 值为 true，表明当事件到达 shadow DOM 的根节点（也就是 shadow DOM 中事件开始传播的第一个节点）时，事件可以从 shadow DOM 传递到一般 DOM。当然，事件要具有可传播性，即该事件的 bubbles 属性必须为 true。你也可以通过调用 composedPath() 来查看事件从 shadow DOM 传播到普通 DOM 的路径。

如果属性值为 false，那么事件将不会跨越 shadow DOM 的边界传播。



## CustomEvent 向事件传递自定义数据

```js
const myEvent = new CustomEvent("myEvent", { detail: { hello: "World" } })
```

CustomEvent 构造函数取代 Event 构造函数。这与 new Event 的工作方式相同，但你可以将 detail 属性以及 bubbles，cancelable 和 composed属性一起传递给第二个参数。detail 属性中你设置的内容都会传递给事件监听器。

```js
const myEvent = new CustomEvent("myEvent", { detail: { hello: "World" } })

document.addEventListener("myEvent", e => {
  console.log(e.detail) // { hello: "World" }
})

document.dispatchEvent(myEvent)
```

### 命名约定

在我们讲自定义双击事件的例子前，我想先讲讲命名约定。你可以为自定义事件命名任何你想要的名字，但是还是遵循命名约定，以更方便使用自己的代码。最普遍的命名约定事件，是为事件添加 custom: 前缀。

custom: 以区分自定义事件和本身的事件，而且，如果 JavaScript 添加与你的事件同名的新事件，它还可以确保你的代码不会中断。


### 双击示例

在这个例子中，我们将创建一个双击的事件，只要你在短时间内单击一个元素，就会触发该事件。该事件还会将按钮单击之间的总时间作为自定义数据传递。

首先，我们需要创建一个正常的单击事件监听器来确保是否有双击。

```js
const button = document.querySelector("button")

const MAX_DOUBLE_CLICK_TIME = 500
let lastClick = 0
button.addEventListener("click", e => {
  const timeBetweenClicks = e.timeStamp - lastClick
  if (timeBetweenClicks > MAX_DOUBLE_CLICK_TIME) {
    lastClick = e.timeStamp
    return
  }

  // TODO: 双击发生。触发自定义事件。
  lastClick = 0
})
```

上面的代码使用该timeStamp属性来确定按钮上点击事件之间的时间，如果点击之间的间隔超过 500 毫秒，它将立即返回并更新值lastClick。一旦我们在 500 毫秒内有两次点击，我们将继续通过 if 检查并能够触发我们的双击事件。为此，我们需要创建我们的事件并发送它。

```js
const button = document.querySelector("button")

const MAX_DOUBLE_CLICK_TIME = 500
let lastClick = 0
button.addEventListener("click", e => {
  const timeBetweenClicks = e.timeStamp - lastClick
  if (timeBetweenClicks > MAX_DOUBLE_CLICK_TIME) {
    lastClick = e.timeStamp
    return
  }

  const doubleClickEvent = new CustomEvent("custom:doubleClick", {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: { timeBetweenClicks },
  })
  e.target.dispatchEvent(doubleClickEvent)
  lastClick = 0
})
```
对于我们的自定义事件，我们将所有选项设置为 true，因为默认情况下单击事件将所有这些属性设置为 true，并且我们希望双击的行为类似于普通单击。我们也将 传递timeBetweenClicks给我们的detail选项。最后，我们在事件的目标上调度事件，在我们的例子中是按钮元素。我们剩下要做的最后一件事是监听事件。


```js
const button = document.querySelector("button")

button.addEventListener("custom:doubleClick", e => {
  console.log("Double Click", e.detail.timeBetweenClicks)
})

const MAX_DOUBLE_CLICK_TIME = 500
let lastClick = 0
button.addEventListener("click", e => {
  const timeBetweenClicks = e.timeStamp - lastClick
  if (timeBetweenClicks > MAX_DOUBLE_CLICK_TIME) {
    lastClick = e.timeStamp
    return
  }

  const doubleClickEvent = new CustomEvent("custom:doubleClick", {
    bubbles: true,
    cancelable: true,
    composed: true,
    detail: {
      timeBetweenClicks,
    },
  })
  e.target.dispatchEvent(doubleClickEvent)
  lastClick = 0
})
```
我们刚刚向按钮田间了一个简单的事件监听器，它将打印出 Double Click 之间的时间。


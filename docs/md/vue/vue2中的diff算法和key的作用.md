# vue2中的diff算法

>diff过程整体遵循深度优先、同层比较的策略。 当数据发生改变时，会调用Dep.notify通知所有Watcher，调用patch给真实的DOM打补丁，更新相应的视图。 patch两个节点之间比较会根据它们是否拥有子节点或者文本节点做不同操作。 比较两组子节点是重点：首先假设头尾节点可能相同，做4次比对尝试，如果没有找到相同节点则遍历查找，查找结束再按情况处理剩下的节点。 借助key通常可以非常精确找到相同节点。

## key的作用

Vue在对比vnode与oldVnode时, 会根据它们的key来判断它们是否指向同一个DOM，

官网推荐推荐的使用key，应该理解为“使用唯一id作为key”。因为index作为key，和不带key的效果是一样的。index作为key时，每个列表项的index在变更前后也是一样的，都是直接判断为sameVnode然后复用。

key的作用就是更新组件时判断两个节点是否相同。相同就复用，不相同就删除旧的创建新的。
正是因为带唯一key时每次更新都不能找到可复用的节点，不但要销毁和创建vnode，在DOM里添加移除节点对性能的影响更大。所以会才说“不带key可能性能更好”。

因为不带key时节点能够复用，省去了销毁/创建组件的开销，同时只需要修改DOM文本内容而不是移除/添加节点，这就是文档中所说的“刻意依赖默认行为以获取性能上的提升”。

既然如此，为什么还要建议带key呢？因为这种模式只适用于渲染简单的无状态组件。对于大多数场景来说，列表组件都有自己的状态。

实际的小栗子：一个新闻列表，可点击列表项来将其标记为"已访问"，可通过tab切换“娱乐新闻”或是“社会新闻”。

不带key属性的情况下，在“娱乐新闻”下选中第二项然后切换到“社会新闻”，"社会新闻"里的第二项也会是被选中的状态，因为这里复用了组件，保留了之前的状态。要解决这个问题，可以为列表项带上新闻id作为唯一key，那么每次渲染列表时都会完全替换所有组件，使其拥有正确状态。

这只是个简单的例子，实际应用会更复杂。带上唯一key虽然会增加开销，但是对于用户来说基本感受不到差距，而且能保证组件状态正确，这应该就是为什么推荐使用唯一id作为key的原因。至于具体怎么使用，就要根据实际情况来选择了。

## vue渲染过程

在vue框架中，我们写的html模板会被编译成渲染函数，渲染函数会生成vnode，最终以vnode渲染视图

![render.png](//static.jmni.cn/blog/img/dd829803e48e40debc7583cf30f3f651.png)

若是首次渲染，此时并没有 oldVnode，直接以vnode为模板渲染视图。

若并非首次渲染，则对比vnode 与 oldVnode（上一次渲染的vnode）的差异，在现有的DOM上进行修改达到更新视图的效果。此过程称为patch，即打补丁。

## patch

比对两个虚拟dom时会有三种操作：删除、新增、更新

![patch.png](//static.jmni.cn/blog/img/aed27ba44bdf44ca9814b833e85a62b5.png)

## patchVnode

比较两个VNode三种类型操作 属性更新、文本更新、子节点更新

![patchVnode.png](//static.jmni.cn/blog/img/4bacb27f527b46498d6ce0184372cc06.png)

核心代码
```js
patchVnode() {
    ...
    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) { 
        // 子节点存在且不同时，执行updateChildren方法即diff算法，下文会详细讲解
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly) 
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // 渲染子节点并插入到DOM中
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        // 移除DOM下所有子节点
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        // DOM文本置空
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      // DOM文本设为vnode.text
      nodeOps.setTextContent(elm, vnode.text)
    }
    ...
}   
 
function isUndef (v) {
  return v === undefined || v === null
}
 
function isDef (v) {
  return v !== undefined && v !== null
}
```
当vnode与oldVnode都有子节点且子节点不相等时会调用updateChildren方法进行子节点之间的对比，也就是本文的重点diff算法。

## updateChildren

用一种较高效的方式对比新旧两个VNode的children，得出最小操作补丁。双循环执行方式。

![updateChildren.png](//static.jmni.cn/blog/img/9004bf6c06174ddca1801c6a86f73508.png)

一些工具函数
- sameVnode--用于判断节点是否应该复用,这里做了一些简化，实际的diff算法复杂些，这里只用tag 和 key 相同，我们就复用节点，执行patchVnode，即对节点进行修改

```js
function sameVnode(a, b) {
  return a.key === b.key && a.tag === b.tag
}
```
- createKeyToOldIdx--建立key-index的索引,主要是替代遍历，提升性能

```js
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key
  const map = {}
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key
    if (isDef(key)) map[key] = i
  }
  return map
}
```

## updateChildren 图解分析

![updateChildren1.png](//static.jmni.cn/blog/img/c397cb6d20794e6f887c90ccc5e11616.png)

在新老两组VNode节点的头尾两侧都有一个变量标记，在遍历过程中这几个变量都会向中间靠拢。 当oldStartIdx > oldEndIdx或者newStartIdx > newEndIdx时结束循环

## updateChildren  循环

![updateChildren2.png](//static.jmni.cn/blog/img/630e345ed613457099f4ae6801325a0a.png)
当 oldStartVnode和newStartVnode 满足sameVnode，直接将该 VNode节点进行patchVnode


![updateChildren3.png](//static.jmni.cn/blog/img/466aa47ba61d485881f90600ab667111.png)
当 oldEndVnode和newEndVnode 满足sameVnode，直接将该 VNode节点进行patchVnode


![updateChildren4.png](//static.jmni.cn/blog/img/83f46d06076149189a13e1febb4e6344.png)
如果oldStartVnode与newEndVnode满足sameVnode。说明oldStartVnode已经到oldEndVnode 后面，进行patchVnode的同时还需要将真实DOM节点移动到oldEndVnode后面。


![updateChildren5.png](//static.jmni.cn/blog/img/83a31531177d4cc0948374a837d4b0eb.png)
如果oldEndVnode与newStartVnode满足sameVnode，说明oldEndVnode到oldStartVnode前面，进行patchVnode的同时要将oldEndVnode对应DOM移动到oldStartVnode对应DOM的前面。


![updateChildren6.png](//static.jmni.cn/blog/img/25973ad94c604f80ad07035e5046a23e.png)
如果以上情况均不符合，则在oldVNode中找与newStartVnode相同的节点，若存在执行patchVnode，同时将elmToMove移动到oldStartIdx对应的DOM的前面。


![updateChildren7.png](//static.jmni.cn/blog/img/1e76cfae83184df3842ff7544dfc4aa5.png)
当然也有可能newStartVnode在oldVNode节点中找不到一致的sameVnode，这个时候会调用 createElm创建一个新的DOM节点。


![updateChildren8.png](//static.jmni.cn/blog/img/4c9650aead584193b51ddacc6b9c52e2.png)
循环结束，处理剩下的节点。
当oldStartIdx > oldEndIdx，这个时候旧的VNode节点已经遍历完了，但是新的节点还没有。新的VNode节点实际上比老的VNode节点多，需要将剩下的VNode对应的DOM根据下标插入到真实DOM 中。


![updateChildren9.png](//static.jmni.cn/blog/img/7f007f89c24d4b39be90db038f0e80e9.png)
当结束时newStartIdx > newEndIdx时，说明新的VNode节点已经遍历完了，但是老的节点还有剩余，需要在真实dom中，将区间为[oldStartIdx, oldEndIdx]的多余节点删掉。

diff核心代码
```js
 
// 判断两个vnode是否相同
function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
 
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;
 
    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;
 
    {
      checkDuplicateKeys(newCh);
    }
 
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && 
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) { // oldCh遍历结束，此时剩下的未处理的newCh则是新增节点
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) { // newCh遍历结束，此时剩下的未处理的oldCh则是需要移除的节点
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
```










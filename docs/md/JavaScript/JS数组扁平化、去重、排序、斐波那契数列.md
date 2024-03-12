---
title: "JS数组扁平化、去重、排序、斐波那契数列"
tag: "JavaScript"
classify: "md"
description: "扁平化、去重、排序"
pubDate: "2024/3/12 15:44:01"
heroImage: ""
---

# JS数组扁平化、去重、排序、斐波那契数列

## 一、数组扁平化

```js
var arr = [[1, 3, 2, 1],[5, 3, 4, 8, 5, 6, 5],[6, 2, 8, 9, [4, 11, 15, 8, 9, 12, [12, 13, [10], 14]]], 16]
```

1、扁平化方法一（toString）

  注意：如果arr数组中有空数组，不使用此方法，用下面的方法；同时得到数组的值是字符串，不是数字
```js
var newArr = arr.toString().split(',')
```
2、扁平化方法二(正则表达式)
```js
var newArr1 = JSON.parse("[" +JSON.stringify(arr).replace(/(\[\]\,)|[\[\]]*/g, "") + "]");
```
3、扁平化方法三(reduce)

  reduce() 方法对累加器和数组中的每个元素 (从左到右)应用一个函数，将其减少为单个值，[reduce详细介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

```js
function flatten(arr) {
  return arr.reduce((a, b) => [].concat(Array.isArray(a) && a ? flatten(a) : a, Array.isArray(b) && b ? flatten(b) : b), [])
  }
var newArr2 = flatten(arr)
```

4、扁平化方法四(遍历数组)
```js
var newArr3 = []
function flat(arr) {
    for(var i = 0; i < arr.length; i++) {
        if(arr[i] instanceof Array) {
            flat(arr[i])
        } else {
            newArr3.push(arr[i])
        }
    }
}
flat(arr)
```


## 二、如何对数组进行去重

```js
// 1.双层 for循环嵌套
function unique(arr){            
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            if(arr[i]==arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}
// 2. 使用 Set：将数组转化为 Set 对象，去重后再转化回数组
var duplicate = Array.from(new Set(newArr1))
// 3. 使用 filter、reduce、includes：遍历数组
var duplicate1 = newArr1.reduce((a, b) => {
    if(a.indexOf(b) === -1) {
        a.push(b)
    }
    return a
}, [])

```
## 三、数组基本排序算法
Array.sort api也可以快速排序
### 快速排序
算法描述：

在数据集之中，选择一个元素作为”基准”（pivot）。
所有小于”基准”的元素，都移到”基准”的左边；所有大于”基准”的元素，都移到”基准”的右边。这个操作称为分区 (partition)操作，分区操作结束后，基准元素所处的位置就是最终排序后它的位置。
对”基准”左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。
```
5 6 3 1 8 7 2 4

pivot
|
5 6 3 1 9 7 2 4
|
storeIndex

5 6 3 1 9 7 2 4//将5同6比较，大于则不更换
|
storeIndex

3 6 5 1 9 7 2 4//将5同3比较，小于则更换
  |
  storeIndex

3 6 1 5 9 7 2 4//将5同1比较，小于则不更换
    |
   storeIndex
...

3 6 1 4 9 7 2 5//将5同4比较，小于则更换
      |
      storeIndex

3 6 1 4 5 7 2 9//将标准元素放到正确位置
      |
storeIndex pivot
```
上述讲解了分区的过程，然后就是对每个子区进行同样做法
```js
// 造成堆栈溢出
function quickSort(arr){
    if(arr.length<=1) return arr;
    var partitionIndex=Math.floor(arr.length/2);
    var tmp=arr[partitionIndex];
    var left=[];
    var right=[];
    for(var i=0;i<arr.length;i++){
        if(arr[i]<tmp){
            left.push(arr[i])
        }else{
            right.push(arr[i])
        }
    }
    return quickSort(left).concat([tmp],quickSort(right))
}
```
上述版本会造成堆栈溢出，所以建议使用下面版本

原地分区版：主要区别在于先进行分区处理，将数组分为左小右大

```js
function quickSort(arr){
    function swap(arr,right,left){
        var tmp = arr[right];
        arr[right]=arr[left];
        arr[left]=tmp;
    }
    function partition(arr,left,right){//分区操作，
        var pivotValue=arr[right]//最右面设为标准
        var storeIndex=left;
        for(var i=left;i<right;i++){
            if(arr[i]<=pivotValue){
                swap(arr,storeIndex,i);
                storeIndex++;
            }
        }
        swap(arr,right,storeIndex);
        return storeIndex//返回标杆元素的索引值
    }
    function sort(arr,left,right){
        if(left>right) return;
        var storeIndex=partition(arr,left,right);
        sort(arr,left,storeIndex-1);
        sort(arr,storeIndex+1,right);
    }
    sort(arr,0,arr.length-1);
    return arr;
}
```
时间复杂度O(nlogn)


### 冒泡排序
算法描述：
1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。
3. 针对所有的元素重复以上的步骤，除了最后一个。
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。
```
5 6 3 1 8 7 2 4

[5 6] 3 1 8 7 2 4 //比较5和6

5 [6 3] 1 8 7 2 4

5 3 [6 1] 8 7 2 4

5 3 1 [6 8] 7 2 4

5 3 1 6 [8 7] 2 4

5 3 1 6 7 [8 2] 4

5 3 1 6 7 2 [8 4]

5 3 1 6 7 2 4 8  // 这样最后一个元素已经在正确位置，所以下一次开始时候就不需要再比较最后一个

```
编程思路：外循环控制需要比较的元素，比如第一次排序后，最后一个元素就不需要比较了，内循环则负责两两元素比较，将元素放到正确位置上
```js
function bubbleSort(arr){
    var len=arr.length;
    for(var i=len-1;i>0;i--){
        for(var j=0;j<i;j++){
            if(arr[j]>arr[j+1]){
                var tmp = arr[j];
                arr[j]=arr[j+1];
                arr[j+1]=tmp
            }
        }
    }
    return arr;
}
```
时间复杂度O(n^2)

### **插入排序**

算法描述：
1. 从第一个元素开始，该元素可以认为已经被排序
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置
4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置
5. 将新元素插入到该位置后
6. 重复步骤 2~5

现有一组数组 arr = [5, 6, 3, 1, 8, 7, 2, 4]
```
[5] 6 3 1 8 7 2 4  //第一个元素被认为已经被排序

[5,6]  3 1 8 7 2 4 //6与5比较，放在5的右边

[3，5，6]  1 8 7 2 4 //3与6和5比较，都小，则放入数组头部

[1,3,5,6]   8 7 2 4 //1与3,5,6比较，则放入头部

[1,3，5，6，8]   7 2 4

[1,3，5，6,7，8]  2 4

[1，2,3，5，6,7，8] 4

[1，2,3，4，5，6,7，8] 
```
编程思路：双层循环，外循环控制未排序的元素，内循环控制已排序的元素，将未排序元素设为标杆，与已排序的元素进行比较，小于则交换位置，大于则位置不动
```js
function insertSort(arr){
    var tmp;
    for(var i=1;i<arr.length;i++){
        tmp  = arr[i];
        for(var j=i;j>=0;j--){
            if(arr[j-1]>tmp){
                arr[j]=arr[j-1];
            }else{
                arr[j]=tmp;
                break;
            }
        }
    }
    return arr
}
```
时间复杂度O(n^2)





## 四、实现斐波那契数列0，1，1，2，3，5，8，...  每一项的值都是前两项相加得到的

```js
function func(n) {
    let sum = 0;
    let last = 1;
    for (let i = 1; i <= n; i++) {
      const tmp = sum;
      sum = last;
      last = tmp + last;
    }
    return sum;
}
function func1(n) {
    if (n === 0 || n === 1) {
        return n
    }
    return func1(n - 1) + func1(n - 2)
}
// 尾递归优化 内存占用小
function func2(n, sum = 0, last = 1) {
    if (n === 0) {
        return sum;
    }
    return func2(n - 1, last, sum + last);
}

```

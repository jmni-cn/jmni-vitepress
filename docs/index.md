---
layout: home

title: Jmni
titleTemplate: 我的学习笔记

# hero:
#   name: Jmni
#   text: 我的学习笔记
#   tagline: 前端, web, typescript, ..
#   image:
#       src: https://www.github.com/jmni-cn.png
#       alt: jmni-cn
#   actions:
#     - theme: brand
#       text: 开始
#       link: /list/
#     - theme: alt
#       text: View on GitHub
#       link: https://github.com/jmni-cn/jmni-vitepress
# features:
#   - title: 博客
#     details: 类似于随笔，其实就是笔记，相对来说更多带有自己的思考和理解...
#   - title: 日常
#     details: 记录自己生活中遇到有趣的、有意义的事情
---


<script setup>
const WHITELIST = ['/md/', '/daily/', '/knowledge/', '/blog/', '/list-page/']
import { useData, useRouter, useRoute  } from 'vitepress'

const { page, site } = useData()
const sidebar = site.value.themeConfig.sidebars
const list = []
let pagelist = []

Object.keys(sidebar).forEach(i => {
    if(WHITELIST.includes(i)){
        sidebar[i].forEach(v => {
            if(v.link){
                list.push({
                    ...v,
                    tag:i.slice(1,-1)
                })
            }else if(v.items){
                v.items.forEach(k => {
                    list.push({
                        ...k,
                        tag:v.text
                    })
                })
            }
            
        })
    }
})
const pagecu = (c=0,p=10) => {pagelist = list.slice(c,p)}
</script>

<div class="VPDoc">
  <ul class="list-content">
    <li class="list-page" v-for="(item, i) in list" :key="i">
        <a class="list-a" :href="item.link">{{item.text}} </a>
        <span class="tag">{{item.tag}}</span>
    </li>
</ul>
</div>


<style>
.VPDoc {
    padding: 32px 24px 96px;
}
.VPHome{
  padding-bottom:0 !important;
  padding-top: 0 !important;
}
@media (min-width: 768px){
  .VPHome {
      padding-bottom: 0 !important;
      padding-top: 0 !important;
  }
}

@media (min-width: 960px){
    .VPDoc {
      padding: 32px 32px 0;
    }
    .list-content {
      max-width: 752px;
      margin: 0 auto;
    }
  }


@media (min-width: 768px){
  .VPDoc {
      padding: 48px 32px 128px;
  }
}



ul, li {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list-page{
    display:flex;
    justify-content: space-between;
    align-items: center;
    line-height: 3em;
    padding:6px 10px;
    border-radius: 6px;

    position: relative;
    transition: color 1s;
    overflow: hidden;
}
.list-page:hover{
    background:var(--vp-c-bg-soft)
}
.tag{
    line-height: 1.2em;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 50%;
    display: inline-block;
}


.list-a{
    position: relative;
    font-size: 1.2em;
    color: var(--vp-c-brand);
    font-weight: 500;
    transition: color 0.25s;
}
.list-a:hover{
  color: var(--vp-c-green-dark);
}
.list-a::before{
    content: "";
    position: absolute;
    width: 0;
    height: 100%;
    bottom: 4px;
    left: 0;
    box-sizing: border-box;
    border: 3px solid transparent;
}
.list-a:hover::before{
    transition: width .5s, border-bottom-color 0.5s;
    width: 100%;
    height: 100%;
    border-bottom: 3px solid var(--vp-c-green-dark);
}


/* 

@property --offset {
  syntax: '<length>';
  inherits: false;
  initial-value: 0;
}
.list-a{
    font-size: 1.2em;
    text-underline-offset:var(--offset,1px);
    text-decoration-line: underline;
    text-decoration-style: inherit !important;
    transition: --offset 400ms, text-decoration-color 400ms !important;
}
.list-a:hover{
    --offset: 10px;
    text-decoration-color: var(--vp-c-green-dark);
} */

/* .list-page::before,
.list-page::after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border: 3px solid transparent;
}
.list-page:hover {
    color: #00e2ff;
}
.list-page:hover::before{
    transition: width .5s, height .5s, border-bottom-color 0s;
    transition-delay: .5s, 0s, .5s;
    width: 100%;
    height: 100%;
    border-left: 3px solid #00e2ff;
    border-bottom: 3px solid #00e2ff;
}
.list-page:hover::after{
    transition: width .5s, height .5s, border-right-color .5s;
    transition-delay: 0s, .5s, .5s;
    width: 100%;
    height: 100%;
    border-top: 3px solid #00e2ff;
    border-right: 3px solid #00e2ff;
} */


</style>
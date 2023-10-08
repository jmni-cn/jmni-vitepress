---
layout: list
title: 列表页
descript: jmni blog
heroImage: ""
---

<script setup>
const WHITELIST = ['/md/', '/daily/', '/knowledge/', '/blog/', '/list-page/']
import { useData, useRouter, useRoute  } from 'vitepress'

const { page, site } = useData()
const sidebar = site.value.themeConfig.sidebar
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

<ul >
    <li class="list-page" v-for="(item, i) in list" :key="i">
        <a :href="item.link">{{item.text}} </a>
        <span class="tag">{{item.tag}}</span>
    </li>
</ul>

<style>

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
}
.list-page:hover{
    background:var(--vp-c-bg-soft)
}
.tag{
    line-height: 1em;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 50%;
    display: inline-block;
}

</style>
import { createRequire } from 'module'
import { defineConfig } from 'vitepress'

const require = createRequire(import.meta.url)
const pkg = require('vitepress/package.json')

export default defineConfig({
  lang: 'zh-en',
  title: 'JmnI',
  description: 'Jmni (jmni-cn), Front-end developer.',

  lastUpdated: true,
  // cleanUrls: true,
  // outDir: '../blog',

  head: [
    ['meta', { name: 'theme-color', content: '#5d8bba' }],
    ['meta', { name: 'og:image', content: '//jmni.cn/avatar.png' }],
    ['meta', { name: 'og:type', content: 'website' }],
    [
      'meta',
      {
        name: 'og:description',
        content: 'Jmni (jmni-cn), Front-end developer.'
      }
    ],
    ['meta', { name: 'og:url', content: '//blog.jmni.cn' }],
    ['meta', { name: 'key', content: 'jmni,blog,markdown,md' }],
    ['meta', { name: 'url', content: '//blog.jmni.cn' }],
    ['link', { rel: 'canonical', href: '//jmni.cn' }],
    // [
    //   'script',
    //   {
    //     async: 'async',
    //     src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7821833143678290',
    //     crossorigin: 'anonymous'
    //   }
    // ],
    [
      'script',
      {},
      'var _hmt = _hmt || []; (function () { var hm = document.createElement("script"); hm.src = "https://hm.baidu.com/hm.js?a9e110a79d2606ec47b7b486eba0612b"; var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(hm, s); })();'
    ]
  ],

  markdown: {
    headers: {
      level: [0, 0]
    }
  },

  themeConfig: {
    nav: nav(),

    sidebar: {
      '/md/': sidebarMd(),
      '/daily/': sidebarDaily()
    },

    editLink: {
      pattern: 'https://github.com/jmni-cn/jmni-vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jmni-cn' },
      { icon: 'twitter', link: 'https://twitter.com/jmni_zh' }
    ],

    footer: {
      message:
        'Released under the <a href="https://github.com/jmni-cn/md/blob/master/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2023-present <a href="https://jmni.cn">jmni</a>'
    }
    //搜索DocSearch
    // algolia: {
    //   appId: '',
    //   apiKey: '',
    //   indexName: ''
    // },

    // 广告https://www.carbonads.net/blogs
    // carbonAds: {
    //   code: '',
    //   placement: ''
    // }
  }
})

function nav() {
  return [
    { text: 'blog', link: '/md/DOM/DOM事件', activeMatch: '/md' },
    { text: 'daily', link: '/daily/chat', activeMatch: '/daily' }
    // {
    //   text: pkg.version,
    //   items: [
    //     {
    //       text: 'Changelog',
    //       link: 'https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md'
    //     },
    //     {
    //       text: 'Contributing',
    //       link: 'https://github.com/vuejs/vitepress/blob/main/.github/contributing.md'
    //     }
    //   ]
    // }
  ]
}

function sidebarMd() {
  return [
    {
      text: 'DOM',
      collapsed: false,
      items: [
        { text: 'DOM事件', link: '/md/DOM/DOM事件' },
        {
          text: '自定义事件Event&CustomEvent',
          link: '/md/DOM/自定义事件Event&CustomEvent'
        }
      ]
    },
    {
      text: 'JavaScript',
      collapsed: false,
      items: [
        { text: 'js', link: '/md/JavaScript/js' },
        {
          text: '观察者模式和发布-订阅模式的区别',
          link: '/md/JavaScript/observer'
        },
        {
          text: 'JavaScript 设计模式',
          link: '/md/JavaScript/JavaScript 设计模式'
        },
        {
          text: '事件的节流（throttle）与防抖（debounce）',
          link: '/md/JavaScript/事件的节流（throttle）与防抖（debounce）'
        },
        { text: 'prototype', link: '/md/JavaScript/prototype' },
        { text: '关于h5和原生之间', link: '/md/JavaScript/关于h5和原生之间' }
      ]
    },
    {
      text: 'vue',
      collapsed: false,
      items: [
        { text: 'Vue的数据响应式原理', link: '/md/vue/Vue的数据响应式原理' },
        {
          text: 'vue2中的diff算法和key的作用',
          link: '/md/vue/vue2中的diff算法和key的作用'
        },
        {
          text: 'vue 中使用了哪些设计模式',
          link: '/md/vue/vue 中使用了哪些设计模式'
        },
        { text: 'Vue 的性能优化', link: '/md/vue/Vue 的性能优化' },
        { text: 'Vue 修饰符', link: '/md/vue/Vue 修饰符' },
        { text: 'Vue3速度快的原因', link: '/md/vue/Vue3速度快的原因' }
      ]
    },
    {
      text: '性能优化',
      items: [
        {
          text: '输入 URL 到页面渲染的整个流程',
          link: '/md/性能优化/输入 URL 到页面渲染的整个流程'
        }
      ]
    },
    {
      text: '代理',
      items: [{ text: '抓包工具whistle', link: '/md/代理/抓包工具whistle' }]
    },
    {
      text: '规范',
      items: [{ text: '前端规范知识点', link: '/md/规范/dev' }]
    },
    {
      text: '工程化',
      items: [{ text: '前端工程化', link: '/md/工程化/1' }]
    },
    {
      text: 'nestjs',
      collapsed: true,
      items: [{ text: 'NestJS_1', link: '/md/nestjs/NestJS_1' }]
    },
    {
      text: '安全',
      items: [{ text: '安全防范', link: '/md/安全/前端安全防范知识点' }]
    },
    {
      text: '监控',
      items: [{ text: '监控', link: '/md/监控/前端监控' }]
    }
  ]
}
function sidebarDaily() {
  return [
    {
      text: 'Daily',
      items: [{ text: 'chat Based on OpenAI API', link: '/daily/chat' }]
    }
  ]
}

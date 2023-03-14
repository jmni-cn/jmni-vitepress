<template>
    <div class="list-page">
      <div class="list-page__header">
        <h1>{{ $page.title }}</h1>
      </div>
      <div class="list-page__content">
        <slot v-for="child in $slots.default">
          <div v-if="child.tag === 'h2'" class="list-page__item">
            <a :href="`#${child.properties.id}`">{{ child.children[0].text }}</a>
          </div>
        </slot>
      </div>
    </div>
  </template>
  
  <style>
  .list-page {
    padding: 20px;
  }
  
  .list-page__header {
    margin-bottom: 20px;
  }
  
  .list-page__header h1 {
    font-size: 28px;
    font-weight: bold;
  }
  
  .list-page__content {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .list-page__item {
    width: 50%;
  }
  </style>
  
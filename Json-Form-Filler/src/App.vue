<script setup>

import { defineAsyncComponent } from 'vue';

const ExtensionVue = defineAsyncComponent(() => import('./components/ExtensionVue.vue'));

</script>

<template>
  
  <ExtensionVue />  

</template>

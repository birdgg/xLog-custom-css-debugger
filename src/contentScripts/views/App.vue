<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import CssEditor from './CssEditor.vue'

const [show, toggle] = useToggle(true)
</script>

<template>
  <div class="w-[300px] fixed right-0 bottom-0 z-100 flex">
    <CssEditor v-show="show" @minimize="toggle" />
    <div
      v-show="!show"
      class="flex w-10 h-10 rounded-full shadow cursor-pointer"
      bg="teal-600 hover:teal-700"
      @click="toggle()"
    >
      <pixelarticons-power class="block m-auto text-black text-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'uno.css'
import CssEditor from './CssEditor.vue'
import Logo from './Logo.vue'
import { useTheme } from '~/composables/useTheme'

const [show, toggle] = useToggle(true)
const theme = useTheme()
</script>

<template>
  <div class="w-[300px] fixed right-0 bottom-0 z-100 flex" :class="theme">
    <CssEditor v-show="show" @minimize="toggle" />
    <div
      v-show="!show"
      class="absolute right-10 bottom-10 p-3 w-10 h-10 rounded-full shadow cursor-pointer"
      bg="white"
      @click="toggle()"
    >
      <Logo />
    </div>
  </div>
</template>

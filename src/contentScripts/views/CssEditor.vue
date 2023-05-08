<script setup lang="ts">
import 'uno.css'
import { useWindowSize } from '@vueuse/core'
import { getCss, removeDebuggerNode, updateCss } from '../utils'
import type { IframeMessage, ParentCssMessage, ParentThemeChange } from '~/types/iframeMessage'
import { useTheme } from '~/composables/useTheme'

defineEmits(['minimize'])

const isMonacoLoaded = ref(false)
const editorValue = ref('')
const iframe = ref<HTMLIFrameElement | null>(null)
const src = ref(chrome.runtime.getURL('monaco-editor/iframe/index.html'))
const theme = useTheme()
const { height } = useWindowSize()
const isCopied = ref(false)

const messageHandler = ({ data }: { data: IframeMessage }) => {
  switch (data.type) {
    case 'xlogMonacoIframeLoaded':
      isMonacoLoaded.value = true
      break
    case 'xlogMonacoIframeCssUpdated':
      isCopied.value = false
      updateCss(data.css)
      editorValue.value = data.css
      break
    default:
      // console.log("message not have a handler", data);
  }
}

const postMessageToIframe = (message: object) => {
  iframe.value?.contentWindow?.postMessage(message, chrome.runtime.getURL('*'))
}

const onClose = () => {
  removeDebuggerNode()
}

const onCopy = async () => {
  try {
    await navigator.clipboard.writeText(editorValue.value)
    isCopied.value = true
  }
  catch (err) {
    console.error('Failed to set clipboard:', err)
  }
}

onMounted(() => {
  window.addEventListener('message', messageHandler)
})

onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
})

watch(isMonacoLoaded, (loaded) => {
  if (!loaded)
    return
  const initialCss = getCss()
  if (initialCss) {
    const message: ParentCssMessage = {
      type: 'xlogCssInit',
      css: initialCss,
    }
    postMessageToIframe(message)
  }
})

watch([theme, isMonacoLoaded], ([newTheme, isLoaded]) => {
  if (!isLoaded)
    return

  const message: ParentThemeChange = {
    type: 'xlogThemeChange',
    theme: newTheme,
  }
  postMessageToIframe(message)
})
</script>

<template>
  <div
    class="flex flex-col bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white"
    :style="{ height: `${height}px` }"
  >
    <div class="flex h-[40px] justify-between px-2 py-1 items-center">
      <h2 class="flex-1">
        xLog css debugger
      </h2>
      <div class="flex justify-between align-baseline">
        <material-symbols:minimize
          class="block text-lg" @click="$emit('minimize')"
        />
        <material-symbols:close class="block text-lg" @click="onClose" />
      </div>
    </div>
    <iframe ref="iframe" :src="src" class="flex-1" />
    <div className="flex justify-end h-[50px] px-2 items-center">
      <button
        class="font-bold rounded w-[100px] h-[40px] bg-teal-600 text-white border-none"
        @click="onCopy"
      >
        {{ isCopied ? "Copied" : "Copy" }}
      </button>
    </div>
  </div>
</template>

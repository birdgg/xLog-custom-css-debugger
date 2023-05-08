import { onBeforeUnmount, onMounted, ref } from 'vue'
type Theme = 'light' | 'dark'

export function useTheme() {
  const theme = ref<Theme>('light')

  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.attributeName === 'class')
        theme.value = mutation.target.className
    })
  })

  onMounted(() => {
    theme.value = document.documentElement.className as Theme
    observer.observe(document.documentElement, { attributes: true })
  })

  onBeforeUnmount(() => {
    observer.disconnect()
  })

  return theme
}

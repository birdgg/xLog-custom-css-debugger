export function removeDebuggerNode() {
  const debuggerNode = document.querySelector(
    '#xlog-css-debugger',
  ) as HTMLElement
  debuggerNode.remove()
}

export function getCss() {
  const stylesheet = document
    .querySelector('.xlog-user link[rel="stylesheet"]')
    ?.getAttribute('href')
  if (stylesheet) {
    const regex = /data:text\/css;base64,(.*)/
    const base64String = stylesheet.match(regex)?.[1] || ''
    return decodeBase64(base64String)
  }
  else {
    return ''
  }
}

export function updateCss(css: string) {
  const xlogUserNode = document.querySelector('.xlog-user') as HTMLElement
  const stylesheet = document.querySelector(
    '.xlog-user link[rel="stylesheet"]',
  )
  const base64CssString = `data:text/css;base64,${encodeBase64(css)}`
  if (stylesheet) {
    stylesheet?.setAttribute('href', base64CssString)
  }
  else {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', base64CssString)
    xlogUserNode.appendChild(link)
  }
}

export function encodeBase64(input: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  let base64 = ''
  const characters
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let padding = 0

  for (let i = 0; i < data.length;) {
    const a = i < data.length ? data[i++] : 0
    const b = i < data.length ? data[i++] : 0
    const c = i < data.length ? data[i++] : 0
    const index1 = a >> 2
    const index2 = ((a & 3) << 4) | (b >> 4)
    const index3 = ((b & 15) << 2) | (c >> 6)
    const index4 = c & 63

    if (i === data.length + 1)
      padding = 1

    else if (i === data.length)
      padding = 2

    base64
      += characters[index1]
      + characters[index2]
      + characters[index3]
      + characters[index4]
  }

  return (
    base64.slice(0, base64.length - padding)
    + (padding === 2 ? '==' : padding === 1 ? '=' : '')
  )
}

export function decodeBase64(input: string) {
  const decoder = new TextDecoder()
  input = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = input.endsWith('==') ? 2 : input.endsWith('=') ? 1 : 0
  const data = new Uint8Array((input.length / 4) * 3 - padding)

  let index = 0
  for (let i = 0; i < input.length;) {
    const index1
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(
        input[i++],
      )
    const index2
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(
        input[i++],
      )
    const index3
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(
        input[i++],
      )
    const index4
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.indexOf(
        input[i++],
      )
    const a = (index1 << 2) | (index2 >> 4)
    const b = ((index2 & 15) << 4) | (index3 >> 2)
    const c = ((index3 & 3) << 6) | index4

    data[index++] = a
    if (i < input.length - padding)
      data[index++] = b
    if (i < input.length - padding - 1)
      data[index++] = c
  }

  return decoder.decode(data)
}

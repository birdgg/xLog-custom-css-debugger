import type { IframeMessage, ParentMessage } from '../../types/iframeMessage'
import { selectorSuggestions } from './suggestion'

declare global {
  interface Window {
    monaco: any
    require: any
  }
}

class MonacEditorIframe {
  // todo: import monaco types
  editor?: any
  theme: 'vs' | 'vs-dark'

  constructor() {
    this.theme = 'vs'
    this.loadEditor(() => {
      this.attachWindowListeners()
      this.initEditor()
      this.injectSuggestion()
      this.postMessage({ type: 'xlogMonacoIframeLoaded' })
    })
  }

  loadEditor(callback: () => void): void {
    window.require.config({
      paths: {
        vs: browser.runtime.getURL(
          'monaco-editor/iframe/node_modules/monaco-editor/min/vs',
        ),
      },
    })

    window.require(['vs/editor/editor.main'], callback)
  }

  initEditor(): void {
    const container = this.getContainer()
    const editorOptions = this.getEditorOptions()

    this.editor = window.monaco.editor.create(container, editorOptions)
    this.editor.onDidChangeModelContent(() => {
      this.postMessage({
        css: this.editor.getValue(),
        type: 'xlogMonacoIframeCssUpdated',
      })
    })
  }

  injectSuggestion() {
    const suggestions = selectorSuggestions.map(item => ({
      label: item,
      kind: window.monaco.languages.CompletionItemKind.Snippet,
      insertText: item,
      insertTextRules:
        window.monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    }))
    window.monaco.languages.registerCompletionItemProvider('css', {
      provideCompletionItems() {
        return {
          triggerCharacters: ['.', '#'],
          suggestions,
        }
      },
    })
  }

  getContainer(): HTMLDivElement {
    // DOM element is guaranteed to exist, so typecasting it.
    return document.getElementById('container') as HTMLDivElement
  }

  getEditorOptions(): any {
    const container = this.getContainer()
    // todo: find a more robust / accurate way to compute;
    // might not work for some cases
    const wordWrapColumn = Math.round(container.offsetWidth / 8)

    return {
      value: '',
      tabSize: 2,
      theme: this.theme,
      wordWrap: 'bounded',
      wordWrapColumn,
      scrollBeyondLastLine: false,
      language: 'css',
      folding: false,
      renderLineHighlight: 'none',
      suggestOnTriggerCharacters: false,
      cursorBlinking: 'smooth',
      mouseWheelZoom: false,
      lineNumbers: 'off',
      minimap: {
        enabled: false,
      },
      hover: {
        enabled: false,
      },
      codeLens: false,
    }
  }

  postMessage(message: IframeMessage): void {
    window.parent.postMessage(message, '*')
  }

  updateTheme(theme: 'light' | 'dark'): void {
    const editorTheme = theme === 'light' ? 'vs' : 'vs-dark'
    this.theme = editorTheme
    window.monaco.editor.setTheme(editorTheme)
  }

  attachWindowListeners(): void {
    window.addEventListener('resize', () => {
      this.editor.layout()
      this.editor.updateOptions(this.getEditorOptions())
    })

    window.addEventListener('message', (message: { data: ParentMessage }) => {
      if (message.data.type === 'xlogCssInit')
        this.editor.setValue(message.data.css)

      if (message.data.type === 'xlogThemeChange')
        this.updateTheme(message.data.theme)
    })
  }
}

export default MonacEditorIframe

import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { EditorView } from '@codemirror/view'
import { githubDark, githubLight } from '@uiw/codemirror-theme-github'
import { useTheme } from '@/features/theme'

/** Loaded lazily — CodeMirror is only downloaded when a reader starts editing. */
const languages = {
  js: () => javascript({ jsx: true, typescript: false }),
  html: () => html(),
  css: () => css(),
}

/**
 * Same colours as the build-time Shiki output (GitHub light/dark), and the same
 * gutter, font and line height as static code blocks, so switching to "Edit"
 * doesn't make the code jump or change colour.
 */
const chrome = EditorView.theme({
  '&': { fontSize: '13.6px', backgroundColor: 'var(--code-bg) !important' },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.75' },
  '.cm-content': { padding: '14px 0', caretColor: 'var(--accent)' },
  '.cm-line': { paddingInline: '1.1rem 1.25rem' },
  '.cm-gutters': {
    backgroundColor: 'var(--gutter) !important',
    borderInlineEnd: '1px solid var(--line) !important',
    color: 'var(--muted) !important',
    minWidth: '3.1rem',
  },
  '.cm-gutterElement': { paddingInline: '0 0.9rem !important', textAlign: 'right' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--accent) 7%, transparent) !important' },
  '.cm-activeLineGutter': {
    backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent) !important',
    color: 'var(--ink) !important',
  },
  '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: 'color-mix(in srgb, var(--accent) 25%, transparent) !important',
  },
  '.cm-cursor': { borderLeftColor: 'var(--accent)', borderLeftWidth: '2px' },
  '.cm-matchingBracket': { backgroundColor: 'color-mix(in srgb, var(--ok) 22%, transparent) !important', outline: 'none' },
  '&.cm-focused': { outline: 'none' },
})

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: keyof typeof languages
  autoFocus?: boolean
}

export default function CodeEditor({ value, onChange, language = 'js', autoFocus }: CodeEditorProps) {
  const { theme } = useTheme()
  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      theme={theme === 'dark' ? githubDark : githubLight}
      autoFocus={autoFocus}
      extensions={[languages[language](), chrome, EditorView.lineWrapping]}
      basicSetup={{ foldGutter: false, highlightActiveLineGutter: true, highlightActiveLine: true }}
      className="text-start"
    />
  )
}

import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { Extension } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { Highlighter, tags as t } from '@lezer/highlight'

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors

const chalky = '#e5c07b',
  coral = '#e06c75',
  cyan = '#56b6c2',
  invalid = '#ffffff',
  ivory = '#abb2bf',
  stone = '#7d8799', // Brightened compared to original to increase contrast
  malibu = '#61afef',
  sage = '#98c379',
  whiskey = '#d19a66',
  violet = '#c678dd',
  darkBackground = '#21252b',
  highlightBackground = '#2c313a',
  background = 'transparent',
  tooltipBackground = '#353a42',
  selection = '#0051ff',
  cursor = '#528bff'

/// The colors used in the theme, as CSS color strings.
export const color = {
  chalky,
  coral,
  cyan,
  invalid,
  ivory,
  stone,
  malibu,
  sage,
  whiskey,
  violet,
  darkBackground,
  highlightBackground,
  background,
  tooltipBackground,
  selection,
  cursor
}

/// The editor theme styles for One Dark.
export const oneDarkTheme = EditorView.theme({
  '&': {
    color: ivory,
    backgroundColor: background
  },

  '.cm-content': {
    caretColor: cursor,
  },

  '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: selection },

  '.cm-panels': { backgroundColor: darkBackground, color: ivory },
  '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
  '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

  '.cm-searchMatch': {
    backgroundColor: '#72a1ff59',
    outline: '1px solid #457dff'
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#6199ff2f'
  },

  '.cm-activeLine': { backgroundColor: '#6699ff0b' },
  '.cm-selectionMatch': { backgroundColor: '#aafe661a' },

  '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
    backgroundColor: '#bad0f847'
  },

  '.cm-gutters': {
    backgroundColor: background,
    color: stone,
    border: 'none'
  },

  '.cm-activeLineGutter': {
    backgroundColor: highlightBackground
  },

  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ddd'
  },

  '.cm-tooltip': {
    border: 'none',
    backgroundColor: tooltipBackground
  },
  '.cm-tooltip .cm-tooltip-arrow:before': {
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent'
  },
  '.cm-tooltip .cm-tooltip-arrow:after': {
    borderTopColor: tooltipBackground,
    borderBottomColor: tooltipBackground
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: highlightBackground,
      color: ivory
    }
  },
  '.cm-highlight': {
    backgroundColor: '#e500e52e',
    outline: '1px solid #e500e569',
    color: '#ff93ff',
  },
  '.cm-highlight-2': {
    backgroundColor: '#23ff0017',
    outline: '1px solid #23ff004a',
    color: '#00ff00',
  },
  '.cm-highlight-3': {
    backgroundColor: '#eaff002b',
    outline: '0.5px solid #eaff005e',
    color: 'yellow',
  },
  '[class^="cm-highlight"]': {
    display: 'inline-block',
    borderRadius: '8px',
    margin: '0 -4px',
    padding: '0 4px',
    position: 'relative',
    zIndex: '-1',
    fontWeight: '500',
  },
  '[class^="cm-highlight"] > *': {
    color: 'inherit'
  },
  '.cm-note-inline': {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '4px',
    borderRadius: '4px',
  },
  '.cm-note-multiline': {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '4px',
  },
  '.cm-note-multiline.top': {
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  '.cm-note-multiline.bottom': {
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
  },
  '.cm-h1': {
    fontSize: '3em',
  },
  '.cm-h2': {
    fontSize: '2.5em',
  },
  '.cm-h3': {
    fontSize: '2em',
  },
  '.cm-h4': {
    fontSize: '1.8em',
  },
  '.cm-h5': {
    fontSize: '1.5em',
  },
  '.cm-h6': {
    fontSize: '1.2em',
  },
}, { dark: true })

/// The highlighting style for code in the One Dark theme.
export const oneDarkHighlightStyle = HighlightStyle.define([
  {
    tag: t.keyword,
    color: violet
  },
  {
    tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
    color: coral
  },
  {
    tag: [t.function(t.variableName), t.labelName],
    color: malibu
  },
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
    color: whiskey
  },
  {
    tag: [t.definition(t.name), t.separator],
    color: ivory
  },
  {
    tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: chalky
  },
  {
    tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
    color: cyan
  },
  {
    tag: [t.meta, t.comment],
    color: stone
  },
  {
    tag: t.strong,
    fontWeight: 'bold'
  },
  {
    tag: t.emphasis,
    fontStyle: 'italic'
  },
  {
    tag: t.strikethrough,
    textDecoration: 'line-through'
  },
  {
    tag: t.link,
    color: stone,
    textDecoration: 'underline'
  },
  {
    tag: t.heading,
    fontWeight: 'bold',
    color: coral
  },
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: whiskey
  },
  {
    tag: [t.processingInstruction, t.string, t.inserted],
    color: sage
  },
  {
    tag: t.invalid,
    color: invalid
  },
])

/// Extension to enable the One Dark theme (both the editor theme and
/// the highlight style).
export const oneDark: Extension = [oneDarkTheme, syntaxHighlighting(oneDarkHighlightStyle as Highlighter)]

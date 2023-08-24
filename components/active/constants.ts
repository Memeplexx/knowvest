import { useInputs } from "./inputs";
import { tags as t } from '@lezer/highlight';
import { createTheme } from 'thememirror';

export const activePanelInitialState = {
  selection: '',
  allowNotePersister: true,
  confirmDelete: false,
  showOptions: false,
};

export type Inputs = ReturnType<typeof useInputs>;

export const codeMirrorTheme: Parameters<typeof createTheme>[0] = {
  variant: 'dark',
  settings: {
    background: 'transparent',
    foreground: '#ffffff',
    caret: '#FFF',
    selection: '#b3b3b3',
    lineHighlight: '#333333',
    gutterBackground: '#fff',
    gutterForeground: '#8a919966',
  },
  styles: [
    {
      tag: t.comment,
      color: '#787b8099',
    },
    {
      tag: t.variableName,
      color: '#57abff',
    },
    {
      tag: [t.string, t.special(t.brace)],
      color: '#0059b3',
    },
    {
      tag: t.number,
      color: '#61b0ff',
    },
    {
      tag: t.bool,
      color: '#5c6166',
    },
    {
      tag: t.null,
      color: '#5c6166',
    },
    {
      tag: t.keyword,
      color: '#5c6166',
    },
    {
      tag: t.operator,
      color: '#5c6166',
    },
    {
      tag: t.className,
      color: '#5c6166',
    },
    {
      tag: t.definition(t.typeName),
      color: '#5c6166',
    },
    {
      tag: t.typeName,
      color: '#5c6166',
    },
    {
      tag: t.angleBracket,
      color: '#5c6166',
    },
    {
      tag: t.tagName,
      color: '#5c6166',
    },
    {
      tag: t.attributeName,
      color: '#5c6166',
    },
  ],
};

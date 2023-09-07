import { RangeSetBuilder } from "@codemirror/state";
import { Decoration, DecorationSet, MatchDecorator, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { EditorView } from "codemirror";

export const bulletPointPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  decorator = new MatchDecorator({
    regexp: /\*\s/g,
    decoration: () => Decoration.replace({
      widget: new (class extends WidgetType {
        toDOM() {
          const wrap = document.createElement("span");
          wrap.innerHTML = '• ';
          return wrap;
        }
      })()
    }),
  });
  constructor(view: EditorView) {
    this.decorations = this.decorator.createDeco(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.decorator.updateDeco(update, this.decorations);
    }
  }
}, {
  decorations: v => v.decorations
});

export const inlineNotePlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  decorator = new MatchDecorator({
    regexp: /`[^`]+`/gm,
    decoration: (x) => Decoration.replace({
      widget: new (class extends WidgetType {
        toDOM() {
          const wrap = document.createElement("span");
          wrap.className = 'cm-note-inline';
          wrap.innerHTML = x[0].substring(1, x[0].length - 1);
          return wrap;
        }
      })()
    }),
  });
  constructor(view: EditorView) {
    this.decorations = this.decorator.createDeco(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.decorator.updateDeco(update, this.decorations);
    }
  }
}, {
  decorations: v => v.decorations
});


export const noteBlockPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  codeBlockDeco(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    let codeBlockOpened = false;
    for (const { from, to } of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        const line = view.state.doc.lineAt(pos)
        const text = line.text;
        const isStartOfCodeBlock = /```.*/g.test(text);
        if (isStartOfCodeBlock && !codeBlockOpened) {
          codeBlockOpened = true;
          builder.add(line.from, line.from, Decoration.line({ class: 'cm-note-multiline top' }));
        } else if (codeBlockOpened) {
          const isEndOfCodeBlock = /```/g.test(text);
          if (isEndOfCodeBlock) {
            builder.add(line.from, line.from, Decoration.line({ class: 'cm-note-multiline bottom' }));
            codeBlockOpened = false;
          } else {
            builder.add(line.from, line.from, Decoration.line({ class: 'cm-note-multiline' }));
          }
        }
        pos = line.to + 1;
      }
    }
    return builder.finish()
  }

  constructor(view: EditorView) {
    this.decorations = this.codeBlockDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.codeBlockDeco(update.view);
    }
  }
}, {
  decorations: v => v.decorations
});


export const titleFormatPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet;
  headingDeco(view: EditorView) {
    const builder = new RangeSetBuilder<Decoration>()
    for (const { from, to } of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        const line = view.state.doc.lineAt(pos)
        const text = line.text;
        const isHeading = /^#{1,6}\s.*/g.test(text);
        if (isHeading) {
          const anchorPos = view.state.selection.ranges[0].anchor;
          const isFocusedOnLine = anchorPos >= line.from && anchorPos <= line.to;
          const hashCount = text.match(/^#{1,6}/g)![0].length;
          const className = `cm-h${hashCount}`;
          const posCopy = pos;
          if (!isFocusedOnLine) {
            builder.add(line.from, line.to, Decoration.replace({
              widget: new (class extends WidgetType {
                toDOM() {
                  const wrap = document.createElement("span");
                  const hashCount = text.match(/^#{1,6}/g)![0].length;
                  wrap.className = className;
                  text.substring(hashCount + 1).split('').forEach((char, i) => {
                    const span = document.createElement("span");
                    span.innerHTML = char;
                    wrap.appendChild(span);
                    span.addEventListener('click', () => {
                      view.dispatch({
                        selection: {
                          anchor: posCopy + i + hashCount + 1,
                        }
                      })
                    })
                  })
                  return wrap;
                }
              })(),
            }));
          } else {
            builder.add(line.from, line.to, Decoration.mark({attributes: {class: className}}));
          }
        }
        pos = line.to + 1;
      }
    }
    return builder.finish()
  }

  constructor(view: EditorView) {
    this.decorations = this.headingDeco(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged || update.selectionSet) {
      this.decorations = this.headingDeco(update.view);
    }
  }
}, {
  decorations: v => v.decorations,
});

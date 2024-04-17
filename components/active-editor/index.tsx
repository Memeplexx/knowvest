"use client";
import { AddIcon, FilterIcon, SplitIcon } from '@/utils/style-utils';
import { Loader } from '../loader';
import { useOutputs } from './outputs';
import { ActiveSelection, ActiveSelectionInstructions, ActiveSelectionListItem, ActiveSelectionTagName, TextEditor, TextEditorWrapper } from './styles';
import { useInputs } from './inputs';


export default function ActiveEditor() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <TextEditorWrapper
      onClick={outputs.onClickTextEditorWrapper}
      children={
        <>
          <TextEditor
            ref={inputs.editorRef}
          />
          <ActiveSelection
            if={!!inputs.selection}
            children={
              <>
                <ActiveSelectionTagName
                  children={'"' + inputs.selection + '"'}
                />
                <ActiveSelectionInstructions
                  children={
                    <>
                      <ActiveSelectionListItem
                        onClick={outputs.onClickCreateNewTagFromSelection}
                        children={
                          <>
                            <AddIcon />
                            Create a new tag out of selection
                          </>
                        }
                      />
                      <ActiveSelectionListItem
                        onClick={outputs.onClickSplitNoteFromSelection}
                        children={
                          <>
                            <SplitIcon />
                            Move selection out into a new note
                          </>
                        }
                      />
                      <ActiveSelectionListItem
                        onClick={outputs.onClickFilterNotesFromSelection}
                        children={
                          <>
                            <FilterIcon />
                            Filter notes similar to selection
                          </>
                        }
                      />
                    </>
                  }
                />
                <Loader
                  if={inputs.loadingSelection}
                />
              </>
            }
          />
        </>
      }
    />
  );
}
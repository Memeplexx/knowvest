import { AddIcon, FilterIcon, SplitIcon } from '@/utils/styles';
import { Loader } from '../loader';
import { useOutputs } from './outputs';
import { ActiveSelection, ActiveSelectionInstructions, ActiveSelectionListItem, ActiveSelectionTagName, Instruction, TextEditor, TextEditorWrapper } from './styles';
import { useInputs } from './inputs';


export default function ActiveEditor() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  const { state, refs } = inputs;
  return (
    <TextEditorWrapper
      onClick={outputs.onClickTextEditorWrapper}
      children={
        <>
          <TextEditor
            ref={refs.editor}
            onBlur={outputs.onBlurTextEditor}
          />
          <ActiveSelection
            showIf={!!state.selection}
            children={
              <>
                <ActiveSelectionTagName
                  children={'"' + state.selection + '"'}
                />
                <ActiveSelectionInstructions
                  children={
                    <>
                      <ActiveSelectionListItem
                        onClick={outputs.onClickCreateNewTagFromSelection}
                        children={
                          <>
                            <AddIcon />
                            <Instruction
                              children='Create a new tag out of selection'
                            />
                          </>
                        }
                      />
                      <ActiveSelectionListItem
                        onClick={outputs.onClickSplitNoteFromSelection}
                        children={
                          <>
                            <SplitIcon />
                            <Instruction
                              children='Move selection out into a new note'
                            />
                          </>
                        }
                      />
                      <ActiveSelectionListItem
                        onClick={outputs.onClickFilterNotesFromSelection}
                        children={
                          <>
                            <FilterIcon />
                            <Instruction
                              children='Filter notes similar to selection'
                            />
                          </>
                        }
                      />
                    </>
                  }
                />
                <Loader
                  show={state.loadingSelection}
                />
              </>
            }
          />
        </>
      }
    />
  );
}
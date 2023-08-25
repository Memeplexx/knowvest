import { usePropsWithoutFunctions } from '@/utils/functions';
import { Props } from './constants';
import { Container, Instruction, ActiveSelectionInstructions, ActiveSelectionListItem, ActiveSelectionTagName } from './styles';
import { AddIcon, FilterIcon, SplitIcon } from '@/utils/styles';



export const ActiveSelection = (
  props: Props
) => {
  return (
    <Container
      {...usePropsWithoutFunctions(props)}
      children={
        <>
          <ActiveSelectionTagName
            children={'"' + props.selection + '"'}
          />
          <ActiveSelectionInstructions
            children={
              <>
                <ActiveSelectionListItem
                  onClick={props.onClickCreateNewTag}
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
                  onClick={props.onClickSplitNote}
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
                  onClick={props.onClickFilterNotes}
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
        </>
      }
    />
  )
}


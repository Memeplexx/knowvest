import { usePropsWithoutFunctions } from '@/utils/functions';
import { Props } from './constants';
import { Container, Instruction, Instructions, ListItem, TagName } from './styles';
import { AddIcon, FilterIcon, SplitIcon } from '@/utils/styles';



export const ActiveSelection = (
  props: Props
) => {
  return (
    <Container
      {...usePropsWithoutFunctions(props)}
      children={
        <>
          <TagName
            children={'"' + props.selection + '"'}
          />
          <Instructions
            children={
              <>
                <ListItem
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
                <ListItem
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
                <ListItem
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


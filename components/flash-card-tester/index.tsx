import { FaSadCry, FaSmileBeam } from "react-icons/fa";
import ReadonlyNote from "../readonly-note";
import { Props } from "./constants";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Body, Container, Footer, FooterRightContent, NextButton, NoResults, Question, ToggleViewButton } from "./styles";
import { NoResultsIcon } from "../related-items/styles";

export const FlashCardTester = (props: Props) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <Container
      ref={inputs.bodyRef}
      children={
        <>
          <Body
            showIf={!!inputs.items.length}
            children={
              <>
                <Question
                  showIf={inputs.showQuestions}
                  children={inputs.items[0].text}
                />
                <ReadonlyNote
                  showIf={!inputs.showQuestions}
                  note={inputs.items[0].note!}
                  synonymIds={inputs.store.synonymIds}
                />
              </>
            }
          />
          <Footer
            showIf={!!inputs.items.length}
            children={
              <>
                <ToggleViewButton
                  children={inputs.showQuestions ? 'Peek Answer' : 'Back to Question'}
                  onClick={outputs.onToggleView}
                />
                <FooterRightContent
                  children={
                    <>
                      <NextButton
                        showIf={inputs.showQuestions}
                        onClick={outputs.onClickWrongAnswer}
                        children={
                          <>
                            <FaSadCry />
                            Wrong
                          </>
                        }
                      />
                      <NextButton
                        showIf={inputs.showQuestions}
                        onClick={outputs.onClickRightAnswer}
                        children={
                          <>
                            <FaSmileBeam />
                            Got it!
                          </>
                        }
                      />
                    </>
                  }
                />
              </>
            }
          />
          <NoResults
            showIf={!inputs.items.length}
            children={
              <>
                <NoResultsIcon />
                no flash cards to test you with
              </>
            }
          />
        </>
      }
    />

  )
}
import ActiveEditor from "../active-editor";
import ReadonlyNote from "../readonly-note";
import { Props } from "./constants"
import { useInputs } from "./inputs"
import { useOutputs } from "./outputs";
import { Body, Container, Footer, FooterRightContent, NextButton, Question, ToggleViewButton } from "./styles"
import { FaSadCry, FaSmileBeam } from "react-icons/fa";

export const FlashCardTester = (props: Props) => {
  const inputs = useInputs(props);
  const outputs = useOutputs(inputs);
  return (
    <Container
      ref={inputs.bodyRef}
      children={
        <>
          <Body
            children={
              <>
                <Question
                  showIf={inputs.showQuestions}
                  children={inputs.items[0]?.text}
                />
                {inputs.showQuestions ? <></> : <ReadonlyNote
                  note={inputs.items[0]?.note!}
                  synonymIds={inputs.store.synonymIds}
                />}
              </>
            }
          />
          <Footer
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
                        children={
                          <>
                            <FaSadCry />
                            Wrong
                          </>
                        }
                      />
                      <NextButton
                        showIf={inputs.showQuestions}
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
        </>
      }
    />

  )
}
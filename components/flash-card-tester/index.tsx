"use client";
import { FaSadCry, FaSmileBeam } from "react-icons/fa";
import ReadonlyNote from "../readonly-note";
import { Props } from "./constants";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Body, Container, Footer, FooterRightContent, NextButton, NoResults, NoResultsIcon, Question, ToggleViewButton } from "./styles";

export const FlashCardTester = (
  props: Props
) => {
  const inputs = useInputs();
  const outputs = useOutputs(props, inputs);
  return (
    <Container
      ref={inputs.bodyRef}
      children={
        <>
          <Body
            if={!!inputs.items.length}
            children={
              <>
                <Question
                  if={inputs.showQuestions}
                  children={inputs.items[0]?.text}
                />
                <ReadonlyNote
                  if={!inputs.showQuestions}
                  note={inputs.items[0]?.note ?? null}
                  synonymIds={inputs.store.synonymIds}
                />
              </>
            }
          />
          <Footer
            if={!!inputs.items.length}
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
                        if={inputs.showQuestions}
                        onClick={outputs.onClickWrongAnswer}
                        children={
                          <>
                            <FaSadCry />
                            Wrong
                          </>
                        }
                      />
                      <NextButton
                        if={inputs.showQuestions}
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
            if={!inputs.items.length}
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
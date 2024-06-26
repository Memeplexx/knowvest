"use client";
import { store } from "@/utils/store-utils";
import { FaSadCry, FaSmileBeam } from "react-icons/fa";
import { useInputs } from "./inputs";
import { useOutputs } from "./outputs";
import { Answer, Body, Footer, FooterRightContent, NextButton, NoResults, NoResultsIcon, PanelFlashCardTesterWrapper, Question, ToggleViewButton } from "./styles";

export function PanelFlashCardTester() {
  const inputs = useInputs();
  const outputs = useOutputs(inputs);
  return (
    <PanelFlashCardTesterWrapper
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
                <Answer
                  if={!inputs.showQuestions}
                  note={inputs.items[0]?.note ?? null}
                  synonymIds={store.synonymIds}
                />
              </>
            }
          />
          <Footer
            if={!!inputs.items.length}
            children={
              <>
                <ToggleViewButton
                  children={inputs.showQuestions ? 'Peek' : 'Back to Question'}
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
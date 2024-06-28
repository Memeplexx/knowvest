"use client";
import { Card } from "@/components/card";
import { FlashCardTester } from "@/components/flashcard-tester/page";
import { useStore } from "@/utils/store-utils";
import styled from "styled-components";

export default function Page() {
  const { state: { mediaQuery } } = useStore();
  const isMobileWidth = mediaQuery === 'xs' || mediaQuery === 'sm';
  if (!isMobileWidth)
    return <FlashCardTester />;
  return (
    <TestContainer
      heading={
        <>
          Test
          <div />
        </>
      }
      body={<FlashCardTester />}
    />
  );
}

const TestContainer = styled(Card)`
  height: 100%;
`;
"use client";
import { Card } from "@/components/card";
import { Search } from "@/components/search";
import { useStore } from "@/utils/store-utils";
import styled from "styled-components";

export default function Page() {
  const { state: { mediaQuery } } = useStore();
  const isMobileWidth = mediaQuery === 'xs' || mediaQuery === 'sm';
  if (!isMobileWidth)
    return <Search />;
  return (
    <TestContainer
      heading={
        <>
          Test
          <div />
        </>
      }
      body={<Search />}
    />
  );
}

const TestContainer = styled(Card)`
  height: 100%;
`;
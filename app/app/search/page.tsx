"use client";
import { Card } from "@/components/card";
import { Search } from "@/components/search";
import { useStore } from "@/utils/store-utils";
import styled from "styled-components";

export default function Page() {
  const { state: { isMobileWidth } } = useStore();
  if (!isMobileWidth)
    return <Search />;
  return (
    <SearchContainer
      heading={
        <>
          Search
          <div />
        </>
      }
      body={<Search />}
    />
  );
}

const SearchContainer = styled(Card)`
  height: 100%;
`;
"use client";
import { Related } from "@/components/related";
import styled from "styled-components";

export default function Page() {
  return (
    <RelatedContainer
      onSelectNote={() => null}
    />
  );
}

const RelatedContainer = styled(Related)`
  height: 100%;
`;

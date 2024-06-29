"use client";
import { Related } from "@/components/related";
import styled from "styled-components";

export default function Page() {
  return (
    <HistoryWrapper />
  );
}

const HistoryWrapper = styled(Related)`
  background-image: linear-gradient(to right, #131313, #212121);
`;

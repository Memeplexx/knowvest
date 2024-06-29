"use client";
import { History } from "@/components/history";
import styled from "styled-components";

export default function Page() {
  return (
    <HistoryWrapper />
  )
}

const HistoryWrapper = styled(History)`
  background-image: linear-gradient(to right, #131313, #212121);
`;
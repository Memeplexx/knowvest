"use client";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Suspense, createContext } from "react";


export const SearchParamsContext = createContext<ReadonlyURLSearchParams | undefined>(undefined);

export default function SearchParamsProvider({ children }: { children: React.ReactNode }) {

  const params = useSearchParams()!;

  return (
    <SearchParamsContext.Provider
      value={params}
      children={
        <Suspense>
          {children}
        </Suspense>
      }
    />
  );
}
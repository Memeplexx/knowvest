"use server"
import { LoaderPlaceholder } from "./styles";

export default async function Loader() {
  return (
    <LoaderPlaceholder
      if={true}
    />
  );
}


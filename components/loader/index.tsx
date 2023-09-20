import { Props } from "./constants";
import { Container, Spinner } from "./styles";

export const Loader = (props: Props) => {
  return (
    <Container 
      className={props.className}
      $showIf={props.showIf}
      children={<Spinner/>}
    />
  );
}
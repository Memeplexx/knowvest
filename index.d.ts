import 'styled-components';
import { theme } from './utils/style-utils';


type CustomTheme = typeof theme;

declare module 'styled-components' {
  export interface DefaultTheme extends CustomTheme {
    // test: string;
  }
}

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    showIf?: boolean;
  }

  function forwardRef<T, P>(
    render: (props: P, ref: Ref<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null;

}

declare global {
  interface EventTarget {
    /**
     * Checks whether an element or any of its ancestors matches a given condition.
     */
    hasAncestor: (check: (element: HTMLElement) => boolean) => boolean;
  }

  interface Object {
    keysTyped: <O extends object>(obj: O) => Array<keyof O>;
  }
}
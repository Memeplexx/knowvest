import { DecisionResult } from "./types";


export const usePropsWithoutFunctions = <P extends object>(props: P) => {
  return (Object.keys(props) as Array<keyof P>)
    .filter(key => typeof (props[key]) !== 'function')
    .reduce((prev, curr) => ({ ...prev, [curr]: props[curr] }), {});
}

/**
 * A construct for expressing conditional logic with the following advantages over conventional approaches:
 * * Unlike 'if' and 'ternary' statements, this is more readable when there are a lot of conditions.
 * * Unlike 'switch' statements, this can use an expression as a condition.
 * * Unlike both 'if' and 'switch' (and much like ternary statements),
 * this returns an individual result and doesn't oblige us to define any local variables.
 *
 * @example
 *
 * cont result = decide([
 *   {
 *     when: () => // some expression returning a boolean,
 *     then: () => // some result,
 *   },
 *   {
 *     when: () => // some expression returning a boolean,
 *     then: () => // some result,
 *   }
 * ])
 */
export const decide = <X>(
  decisions: { when(): boolean | null | undefined; then(): X }[],
): DecisionResult<X, ReturnType<typeof decisions[0]['then']>> =>
  decisions.findOrThrow(d => d.when()).then() as DecisionResult<X, ReturnType<typeof decisions[0]['then']>>;

/**
 * A construct for expressing conditional logic with the following advantages over conventional approaches:
 * * Unlike 'if' and 'ternary' statements, this is more readable when there are a lot of conditions.
 * * Unlike both 'if' and 'switch' (and much like ternary statements),
 * this returns an individual result and doesn't oblige us to define any local variables.
 *
 * @example
 *
 * cont result = decideComparing(someValue, [
 *   {
 *     when: () => // something which may or may not equal someValue,
 *     then: () => // some result,
 *   },
 *   {
 *     when: () => // something which may or may not equal someValue,
 *     then: () => // some result,
 *   }
 * ])
 */
export const decideComparing = <C, X, T extends { when(): C; then(): X }>(
  toCompare: C,
  decisions: T[],
): DecisionResult<X, ReturnType<T['then']>> =>
  decisions.findOrThrow(d => d.when() === toCompare).then() as DecisionResult<X, ReturnType<T['then']>>;


export const ancestorMatches = (element: EventTarget | null, check: (element: HTMLElement) => boolean): boolean => {
  const parentNode = (element as HTMLElement).parentNode as HTMLElement;
  if (parentNode == null || parentNode.tagName === 'WINDOW') {
    return false;
  } else {
    const checkResult = check(element as HTMLElement);
    if (!checkResult) {
      return ancestorMatches(parentNode, check);
    } else {
      return checkResult;
    }
  }
}

export function pipe<A0, A1>(arg0: A0, arg1: (arg0: A0) => A1): A1;
export function pipe<A0, A1, A2>(arg0: A0, arg1: (arg0: A0) => A1, arg2: (arg1: A1) => A2): A2;
export function pipe(arg0: unknown, ...fns: Array<(arg: unknown) => unknown>) {
  return fns.reduce((prev, curr) => curr(prev), arg0);
}

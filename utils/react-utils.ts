import dynamic from "next/dynamic";
import { ComponentType, ForwardedRef, FunctionComponent, forwardRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { is } from "./logic-utils";

export const createComponent = <Props, Inputs extends object, Outputs extends object, Handle>(
  useInputs: (props: Props, forwardedRef: ForwardedRef<Handle>) => Inputs,
  useOutputs: (inputs: Inputs) => Outputs,
  render: (props: Props, inputs: Inputs, outputs: Outputs, forwardedRef: ForwardedRef<Handle>) => JSX.Element
) => {
  const Component = (
    props: Props,
    forwardedRef: ForwardedRef<Handle>
  ) => {
    const inputs = useInputs(props, forwardedRef);
    const outputs = useOutputs(inputs);
    return render(props, inputs, outputs, forwardedRef);
  }
  return forwardRef(Component) as ComponentType<Props>;
}

/**
 * Accepts a forwardedRef and returns a normal MutableRefObject which can be applied directly to a DOM element.
 * Note that forwardedRefs cannot be applied directly to DOM elements.
 */
export const useForwardedRef = <T>(forwardedRef: ForwardedRef<T>) => {
  const basicRef = useRef<T | null>(null);
  const targetRef = useRef<T | null>(null)
  const refs = useMemo(() => [basicRef, forwardedRef], [forwardedRef]);
  useIsomorphicLayoutEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])
  return targetRef
}

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const usePropsWithDefaults = <P extends Record<string, unknown>, I extends P, D extends P>(incomingProps: I, defaultProps: D) => {

  // We need a ref of incomingProps so we can compare previous props to incoming props
  const inRef = useRef<P>(incomingProps);

  // We need a ref of result because we might want to return exactly the same object if props have not changed
  const outRef = useRef<P>({ ...defaultProps, incomingProps });

  // props object has changed so we can return a new object which is a spread of defaultProps and incomingProps
  if (inRef.current !== incomingProps) {
    inRef.current = incomingProps;
    outRef.current = { ...defaultProps, ...incomingProps };
    return outRef.current as I & D;
  }

  // one or more props have changed.
  Object.assign(outRef.current, incomingProps);
  return outRef.current as I & D;
}

export const useIsMounted = () => {
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    setTimeout(() => setInitialized(true));
  }, []);
  return initialized;
}

export const useComponent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const subscriptions = useRef<(() => void)[]>([]);
  useEffect(() => {
    setIsMounted(true);
    const subs = subscriptions.current;
    return () => {
      subs.forEach(listener => listener());
      subs.length = 0;
    }
  }, []);
  const firstPass = useRef(true);
  firstPass.current = true
  return useMemo(() => new Proxy({} as { isMounted: boolean, listen: () => void }, {
    get: (_, prop) => {
      if (prop === 'isMounted')
        return isMounted;
      return;
    },
    set(_, prop, newValue) {
      if (prop === 'listen') {
        if (firstPass.current) { // This is a workaround for React.strictMode which add double the number of subscriptions.
          subscriptions.current.forEach(listener => listener());
          subscriptions.current.length = 0;
          firstPass.current = false;
        }
        subscriptions.current.push(newValue);
      }
      return true;
    },
  }), [isMounted]);
}

export const useComponentDownloader = <P>(importer: () => Promise<{ default: FunctionComponent<P> }>) => {
  const isMounted = useIsMounted();
  const importerRef = useRef(importer);
  const component = useMemo(() => {
    if (!isMounted) return null;
    return dynamic(importerRef.current);
  }, [isMounted]);
  return component;
}

export const useRecord = <R extends Record<string, unknown>>(record: R) => {
  const [, setCount] = useState(0);
  const stateRef = useRef({
    ...record,
    set: (arg: Partial<R> | ((r: R) => (Partial<R> | void))) => {
      const newState = is.function<[R], Partial<R>>(arg) ? arg(stateRef) : arg;
      if (newState === undefined) return;
      const unChanged = (Object.keys(newState) as Array<keyof typeof newState>)
        .every(key => is.function(newState[key]) || stateRef[key] === newState[key]);
      if (unChanged) return;
      Object.assign(stateRef, newState);
      setCount(c => c + 1);
    }
  }).current;
  return stateRef;
}

const whitelist = ['className', 'style', 'onClick'];
export const useUnknownPropsStripper = (props: object) => {
  return Object.keys(props)
    .filter(k => whitelist.includes(k))
    .reduce((acc, key) => Object.assign(acc, { [key]: props[key as keyof typeof props] }), {});
}

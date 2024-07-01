import { ControlAutocomplete } from '@/components/control-autocomplete';
import { Props } from '@/components/control-autocomplete/constants';
import { ClearTextButton, Input, Options } from '@/components/control-autocomplete/styles';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Montserrat: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
  Source_Code_Pro: () => ({
    style: {
      fontFamily: 'mocked',
    },
  }),
}))

const get = function <T extends HTMLElement>(element: { styledComponentId: string }) {
  return screen.queryByTestId(element.styledComponentId, { exact: false })! as T;
}

test('Page', async () => {

  const doRender = (props: Partial<Props<{ value: number, label: string }>> = {}) => {
    const state = {
      inputText: '',
      value: 0,
      showOptions: false,
      options: [{ label: 'one', value: 1 }],
      onInputClicked: () => state.showOptions = true,
      onValueChange: v => state.value = v,
      onInputTextChange: v => state.inputText = v,
      onShowOptionsChange: s => state.showOptions = s,
    } as Props<{ value: number, label: string }>;
    const compFn = (props: Partial<Props<{ value: number, label: string }>> = {}) => (
      <ControlAutocomplete
        {...state}
        {...props}
      />
    );
    const component = render(compFn(props));
    return {
      component,
      update: (p: (() => unknown) | Partial<Props<{ value: number, label: string }>> = {}) => {
        if (typeof p === 'function') {
          p();
          component.rerender(compFn());
        } else {
          component.rerender(compFn(p));
        }
      }
    }
  }

  const { update } = doRender();

  update(() => get(Input).focus());
  expect(get(Options)).toBeTruthy();

  update({ showOptions: false });
  expect(get(Options)).toBeFalsy();

  update({ inputText: 'xxx' });
  expect(get(Options).children.length).toBeFalsy();

  update({ inputText: 'one' });
  expect(get<HTMLInputElement>(Input).value).toBeTruthy();
  update(() => get(ClearTextButton).click());
  expect(get<HTMLInputElement>(Input).value).toBeFalsy();

  update({ options: [{ label: 'one', value: 1 }, { label: 'two', value: 2 }] });
  expect(get(Options).children.length).toEqual(2);

})
import { vi } from "vitest";

export const mock = () => vi.mock('next/font/google', () => ({
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
}));

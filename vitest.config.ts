import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
 
export default defineConfig({
  plugins: [tsconfigPaths() as any, react() as any], // todo: investigate alternative to casting
  test: {
    environment: 'jsdom',
  },
})
import { defineConfig, UserConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";


export default defineConfig({
  plugins: [tsconfigPaths(), react()] as Array<UserConfig['plugins']>,
  test: {
    environment: 'jsdom',
  },
})
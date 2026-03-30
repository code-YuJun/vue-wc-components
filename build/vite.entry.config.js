import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname, '../entry'),
  server: {
    https: true,
    host: "localhost",
    port: 5174
  }
})
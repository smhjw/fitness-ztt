import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: './',
  plugins: [command === 'serve' && inspectAttr(), react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('echarts') || id.includes('recharts') || id.includes('d3-')) {
            return 'vendor-charts';
          }

          if (id.includes('@fullcalendar')) {
            return 'vendor-calendar';
          }

          if (id.includes('@radix-ui') || id.includes('class-variance-authority') || id.includes('tailwind-merge') || id.includes('lucide-react')) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
}));

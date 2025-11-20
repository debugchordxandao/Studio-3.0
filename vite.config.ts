import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // A linha 'base' foi removida. 
  // Isso faz o Vite usar o padrão "/", que é o correto para Vercel, Netlify, etc.
});
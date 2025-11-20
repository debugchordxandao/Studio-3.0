import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: Troque 'starkids-studio' pelo nome do seu repositório no GitHub
  // Exemplo: se seu repo é 'meu-projeto', use base: '/meu-projeto/'
  base: "/starkids-studio/",
});

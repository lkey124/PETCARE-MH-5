import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/PETCARE-MH-5/",
  server: {
    // Tắt COOP header để Firebase signInWithPopup hoạt động được
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
});

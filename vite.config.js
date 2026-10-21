import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Di GitHub Pages situs berada di /nama-repo/, jadi base diisi lewat VITE_BASE saat build.
// Secara lokal base tetap "/".
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react(), tailwindcss()],
});

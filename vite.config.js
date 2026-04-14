import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base is set via env so the same config works for local dev and GH Pages
// (GitHub Actions sets VITE_BASE to "/<repo-name>/")
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || "/",
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite bundles all imported CSS into one file and injects it as a normal
// <link rel="stylesheet"> in the built index.html — that tag blocks the
// browser from painting anything until the whole file downloads and parses.
// This plugin runs at build time (after Vite knows the final hashed
// filename) and rewrites that tag into the preload+swap pattern: the
// browser fetches the CSS at high priority but doesn't block rendering on
// it, then swaps it to an active stylesheet once loaded. The <noscript>
// fallback keeps styling working if JS is ever disabled.
function deferCss() {
  return {
    name: "defer-css",
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="([^"]+)">/,
        `<link rel="preload" as="style" crossorigin href="$1" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" crossorigin href="$1"></noscript>`
      );
    }
  };
}

export default defineConfig({
  plugins: [react(), deferCss()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      },
      "/uploads": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true
      }
    }
  }
});
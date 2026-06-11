// vite.config.js
import { defineConfig } from "file:///F:/cosmic1987/1987vue/node_modules/vite/dist/node/index.js";
import vue from "file:///F:/cosmic1987/1987vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///F:/cosmic1987/1987vue/node_modules/unplugin-vue-components/dist/vite.mjs";
import Layouts from "file:///F:/cosmic1987/1987vue/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
import wasm from "file:///F:/cosmic1987/1987vue/node_modules/vite-plugin-wasm/exports/import.mjs";
import { resolve } from "path";
import fs from "fs";
import path from "path";
var __vite_injected_original_dirname = "F:\\cosmic1987\\1987vue";
function wasmMimeTypePlugin() {
  return {
    name: "wasm-mime-type",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith(".wasm")) {
          const wasmPaths = [
            path.resolve(__vite_injected_original_dirname, "node_modules", req.url.replace("/node_modules/", "")),
            path.resolve(__vite_injected_original_dirname, "node_modules/babylon-mmd/esm/Runtime/Optimized/wasm/mmd_wasm_bg.wasm"),
            path.resolve(__vite_injected_original_dirname, "node_modules/babylon-mmd/esm/Runtime/Optimized/wasm/mmd_wasm_simd_bg.wasm")
          ];
          let wasmFile = null;
          for (const p of wasmPaths) {
            if (fs.existsSync(p)) {
              wasmFile = p;
              break;
            }
          }
          if (wasmFile && fs.existsSync(wasmFile)) {
            const data = fs.readFileSync(wasmFile);
            res.setHeader("Content-Type", "application/wasm");
            res.setHeader("Content-Length", data.length);
            res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
            res.end(data);
            return;
          }
        }
        next();
      });
    }
  };
}
function wasmBindgenRayonFixPlugin() {
  const STUB_CODE = `
export function startWorkers(numThreads) {}
export function initThreadPool(numThreads) {}
export function getWorkerId() { return 0; }
export function spawn(fn) { return Promise.resolve(fn()); }
export function asyncify(fn) { return fn; }
`;
  return {
    name: "wasm-bindgen-rayon-fix",
    enforce: "pre",
    async resolveId(id, importer, options) {
      if (id.includes("wasm-bindgen-rayon") && id.includes("workerHelpers")) {
        return "\0wasm-bindgen-rayon-worker-helpers";
      }
      return null;
    },
    async transform(code, id) {
      if (id.includes("wasm-bindgen-rayon") && id.includes("workerHelpers")) {
        return STUB_CODE;
      }
      return null;
    },
    async load(id) {
      if (id === "\0wasm-bindgen-rayon-worker-helpers") {
        return STUB_CODE;
      }
      return null;
    }
  };
}
var vite_config_default = defineConfig({
  // 【关键】GitHub Pages 子路径部署必须设置
  base: "/cosmic1987/",
  plugins: [
    vue(),
    Components({
      dirs: ["src/components"],
      extensions: ["vue"]
    }),
    Layouts({
      layoutsDirs: "src/layouts",
      defaultLayout: "default"
    }),
    // 【关键】处理 wasm-bindgen-rayon 的 IIFE 问题
    wasmBindgenRayonFixPlugin(),
    // 【关键】添加 WASM 支持插件
    wasm(),
    wasmMimeTypePlugin()
  ],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src"),
      // 重定向 wasm-bindgen-rayon 文件
      "wasm-bindgen-rayon": resolve(__vite_injected_original_dirname, "src/utils/emptyWorker.js")
    },
    mainFields: ["module", "esnext", "jsnext:main", "main"]
  },
  assetsInclude: [
    /\.(wasm|pmx|pmd|vmd|vpd|bmp|spa|sph|tga|png|jpg|jpeg|wav|mp3|ogg|fx|glsl|json|vertex|fragment)$/i
  ],
  server: {
    watch: {
      usePolling: true,
      interval: 100
    },
    headers: {
      // 【新增】关闭 COEP，允许跨域资源正常加载
      "Cross-Origin-Embedder-Policy": "unsafe-none"
      // 【注释】COOP，它经常和 COEP 成对出现
      // 'Cross-Origin-Opener-Policy': 'same-origin'
    },
    hmr: {
      overlay: true
    }
  },
  optimizeDeps: {
    include: [
      "@babylonjs/core",
      "@babylonjs/loaders",
      "@babylonjs/materials",
      "@babylonjs/gui",
      "babylon-mmd"
    ],
    exclude: [],
    force: true,
    esbuildOptions: {
      target: "es2020",
      format: "esm"
    }
  },
  build: {
    // 【修复】复制 public 目录（包含 ammo/ 文件夹）
    copyPublicDir: true,
    target: "esnext",
    chunkSizeWarningLimit: 2e3,
    assetsInlineLimit: 0,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    rollupOptions: {
      // 【修复】移除 babylon-mmd 外部依赖配置，让它被正确打包
      external: [
        // 'babylon-mmd',
        // /^babylon-mmd\/.*/,
      ],
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("babylon-mmd")) return "babylon-mmd";
            if (id.includes("@babylonjs/core")) return "babylon-core";
            if (id.includes("@babylonjs/loaders") || id.includes("@babylonjs/materials")) return "babylon-loaders";
            if (id.includes("vue") && !id.includes("vue-router") && !id.includes("pinia")) return "vue-vendor";
            if (id.includes("vue-router")) return "vue-vendor";
          }
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxjb3NtaWMxOTg3XFxcXDE5ODd2dWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkY6XFxcXGNvc21pYzE5ODdcXFxcMTk4N3Z1ZVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRjovY29zbWljMTk4Ny8xOTg3dnVlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCBMYXlvdXRzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzJ1xuaW1wb3J0IHdhc20gZnJvbSAndml0ZS1wbHVnaW4td2FzbSdcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFx1MzAxMFx1NTE3M1x1OTUyRVx1MzAxMVx1ODFFQVx1NUI5QVx1NEU0OVx1NjNEMlx1NEVGNlx1RkYxQVx1NUYzQVx1NTIzNlx1NEUzQSBXQVNNIFx1NjU4N1x1NEVGNlx1NjNEMFx1NEY5Qlx1NkI2M1x1Nzg2RVx1NzY4NCBNSU1FIFx1N0M3Qlx1NTc4QlxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmZ1bmN0aW9uIHdhc21NaW1lVHlwZVBsdWdpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnd2FzbS1taW1lLXR5cGUnLFxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKHJlcSwgcmVzLCBuZXh0KSA9PiB7XG4gICAgICAgIC8vIFx1NjJFNlx1NjIyQVx1NjI0MFx1NjcwOSAud2FzbSBcdThCRjdcdTZDNDJcbiAgICAgICAgaWYgKHJlcS51cmwgJiYgcmVxLnVybC5lbmRzV2l0aCgnLndhc20nKSkge1xuICAgICAgICAgIC8vIFx1NUMxRFx1OEJENVx1NEVDRSBub2RlX21vZHVsZXMgXHU2MjdFXHU1MjMwIFdBU00gXHU2NTg3XHU0RUY2XG4gICAgICAgICAgY29uc3Qgd2FzbVBhdGhzID0gW1xuICAgICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcycsIHJlcS51cmwucmVwbGFjZSgnL25vZGVfbW9kdWxlcy8nLCAnJykpLFxuICAgICAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ25vZGVfbW9kdWxlcy9iYWJ5bG9uLW1tZC9lc20vUnVudGltZS9PcHRpbWl6ZWQvd2FzbS9tbWRfd2FzbV9iZy53YXNtJyksXG4gICAgICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnbm9kZV9tb2R1bGVzL2JhYnlsb24tbW1kL2VzbS9SdW50aW1lL09wdGltaXplZC93YXNtL21tZF93YXNtX3NpbWRfYmcud2FzbScpLFxuICAgICAgICAgIF07XG5cbiAgICAgICAgICBsZXQgd2FzbUZpbGUgPSBudWxsO1xuICAgICAgICAgIGZvciAoY29uc3QgcCBvZiB3YXNtUGF0aHMpIHtcbiAgICAgICAgICAgIGlmIChmcy5leGlzdHNTeW5jKHApKSB7XG4gICAgICAgICAgICAgIHdhc21GaWxlID0gcDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU2MjdFXHU1MjMwXHU2NTg3XHU0RUY2XHVGRjBDXHU3NkY0XHU2M0E1XHU4RkQ0XHU1NkRFXHU0RThDXHU4RkRCXHU1MjM2XHU2NTcwXHU2MzZFXG4gICAgICAgICAgaWYgKHdhc21GaWxlICYmIGZzLmV4aXN0c1N5bmMod2FzbUZpbGUpKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gZnMucmVhZEZpbGVTeW5jKHdhc21GaWxlKTtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi93YXNtJyk7XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGRhdGEubGVuZ3RoKTtcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIoJ0Nyb3NzLU9yaWdpbi1SZXNvdXJjZS1Qb2xpY3knLCAnY3Jvc3Mtb3JpZ2luJyk7XG4gICAgICAgICAgICByZXMuZW5kKGRhdGEpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBuZXh0KCk7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gXHUzMDEwXHU1MTczXHU5NTJFXHUzMDExXHU1OTA0XHU3NDA2IHdhc20tYmluZGdlbi1yYXlvbiBcdTc2ODQgSUlGRSBcdTk1RUVcdTk4OThcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5mdW5jdGlvbiB3YXNtQmluZGdlblJheW9uRml4UGx1Z2luKCkge1xuICBjb25zdCBTVFVCX0NPREUgPSBgXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXb3JrZXJzKG51bVRocmVhZHMpIHt9XG5leHBvcnQgZnVuY3Rpb24gaW5pdFRocmVhZFBvb2wobnVtVGhyZWFkcykge31cbmV4cG9ydCBmdW5jdGlvbiBnZXRXb3JrZXJJZCgpIHsgcmV0dXJuIDA7IH1cbmV4cG9ydCBmdW5jdGlvbiBzcGF3bihmbikgeyByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZuKCkpOyB9XG5leHBvcnQgZnVuY3Rpb24gYXN5bmNpZnkoZm4pIHsgcmV0dXJuIGZuOyB9XG5gO1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICd3YXNtLWJpbmRnZW4tcmF5b24tZml4JyxcbiAgICBlbmZvcmNlOiAncHJlJyxcbiAgICBhc3luYyByZXNvbHZlSWQoaWQsIGltcG9ydGVyLCBvcHRpb25zKSB7XG4gICAgICBpZiAoaWQuaW5jbHVkZXMoJ3dhc20tYmluZGdlbi1yYXlvbicpICYmIGlkLmluY2x1ZGVzKCd3b3JrZXJIZWxwZXJzJykpIHtcbiAgICAgICAgcmV0dXJuICdcXDB3YXNtLWJpbmRnZW4tcmF5b24td29ya2VyLWhlbHBlcnMnO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcbiAgICAgIGlmIChpZC5pbmNsdWRlcygnd2FzbS1iaW5kZ2VuLXJheW9uJykgJiYgaWQuaW5jbHVkZXMoJ3dvcmtlckhlbHBlcnMnKSkge1xuICAgICAgICByZXR1cm4gU1RVQl9DT0RFO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcbiAgICBhc3luYyBsb2FkKGlkKSB7XG4gICAgICBpZiAoaWQgPT09ICdcXDB3YXNtLWJpbmRnZW4tcmF5b24td29ya2VyLWhlbHBlcnMnKSB7XG4gICAgICAgIHJldHVybiBTVFVCX0NPREU7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAvLyBcdTMwMTBcdTUxNzNcdTk1MkVcdTMwMTFHaXRIdWIgUGFnZXMgXHU1QjUwXHU4REVGXHU1Rjg0XHU5MEU4XHU3RjcyXHU1RkM1XHU5ODdCXHU4QkJFXHU3RjZFXG4gIGJhc2U6ICcvY29zbWljMTk4Ny8nLFxuXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIGRpcnM6IFsnc3JjL2NvbXBvbmVudHMnXSxcbiAgICAgIGV4dGVuc2lvbnM6IFsndnVlJ10sXG4gICAgfSksXG4gICAgTGF5b3V0cyh7XG4gICAgICBsYXlvdXRzRGlyczogJ3NyYy9sYXlvdXRzJyxcbiAgICAgIGRlZmF1bHRMYXlvdXQ6ICdkZWZhdWx0J1xuICAgIH0pLFxuICAgIC8vIFx1MzAxMFx1NTE3M1x1OTUyRVx1MzAxMVx1NTkwNFx1NzQwNiB3YXNtLWJpbmRnZW4tcmF5b24gXHU3Njg0IElJRkUgXHU5NUVFXHU5ODk4XG4gICAgd2FzbUJpbmRnZW5SYXlvbkZpeFBsdWdpbigpLFxuICAgIC8vIFx1MzAxMFx1NTE3M1x1OTUyRVx1MzAxMVx1NkRGQlx1NTJBMCBXQVNNIFx1NjUyRlx1NjMwMVx1NjNEMlx1NEVGNlxuICAgIHdhc20oKSxcbiAgICB3YXNtTWltZVR5cGVQbHVnaW4oKSxcbiAgXSxcblxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICAgIC8vIFx1OTFDRFx1NUI5QVx1NTQxMSB3YXNtLWJpbmRnZW4tcmF5b24gXHU2NTg3XHU0RUY2XG4gICAgICAnd2FzbS1iaW5kZ2VuLXJheW9uJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvdXRpbHMvZW1wdHlXb3JrZXIuanMnKSxcbiAgICB9LFxuICAgIG1haW5GaWVsZHM6IFsnbW9kdWxlJywgJ2VzbmV4dCcsICdqc25leHQ6bWFpbicsICdtYWluJ10sXG4gIH0sXG5cbiAgYXNzZXRzSW5jbHVkZTogW1xuICAgIC9cXC4od2FzbXxwbXh8cG1kfHZtZHx2cGR8Ym1wfHNwYXxzcGh8dGdhfHBuZ3xqcGd8anBlZ3x3YXZ8bXAzfG9nZ3xmeHxnbHNsfGpzb258dmVydGV4fGZyYWdtZW50KSQvaSxcbiAgXSxcblxuICBzZXJ2ZXI6IHtcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICAgIGludGVydmFsOiAxMDAsXG4gICAgfSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAvLyBcdTMwMTBcdTY1QjBcdTU4OUVcdTMwMTFcdTUxNzNcdTk1RUQgQ09FUFx1RkYwQ1x1NTE0MVx1OEJCOFx1OERFOFx1NTdERlx1OEQ0NFx1NkU5MFx1NkI2M1x1NUUzOFx1NTJBMFx1OEY3RFxuICAgICAgJ0Nyb3NzLU9yaWdpbi1FbWJlZGRlci1Qb2xpY3knOiAndW5zYWZlLW5vbmUnLCBcbiAgICAgIC8vIFx1MzAxMFx1NkNFOFx1OTFDQVx1MzAxMUNPT1BcdUZGMENcdTVCODNcdTdFQ0ZcdTVFMzhcdTU0OEMgQ09FUCBcdTYyMTBcdTVCRjlcdTUxRkFcdTczQjBcbiAgICAgIC8vICdDcm9zcy1PcmlnaW4tT3BlbmVyLVBvbGljeSc6ICdzYW1lLW9yaWdpbidcbiAgICB9LFxuICAgIGhtcjoge1xuICAgICAgb3ZlcmxheTogdHJ1ZSxcbiAgICB9LFxuICB9LFxuXG4gIG9wdGltaXplRGVwczoge1xuICAgIGluY2x1ZGU6IFtcbiAgICAgICdAYmFieWxvbmpzL2NvcmUnLFxuICAgICAgJ0BiYWJ5bG9uanMvbG9hZGVycycsXG4gICAgICAnQGJhYnlsb25qcy9tYXRlcmlhbHMnLFxuICAgICAgJ0BiYWJ5bG9uanMvZ3VpJyxcbiAgICAgICdiYWJ5bG9uLW1tZCcsXG4gICAgXSxcbiAgICBleGNsdWRlOiBbXSxcbiAgICBmb3JjZTogdHJ1ZSxcbiAgICBlc2J1aWxkT3B0aW9uczoge1xuICAgICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgICAgIGZvcm1hdDogJ2VzbScsXG4gICAgfSxcbiAgfSxcblxuICBidWlsZDoge1xuICAgIC8vIFx1MzAxMFx1NEZFRVx1NTkwRFx1MzAxMVx1NTkwRFx1NTIzNiBwdWJsaWMgXHU3NkVFXHU1RjU1XHVGRjA4XHU1MzA1XHU1NDJCIGFtbW8vIFx1NjU4N1x1NEVGNlx1NTkzOVx1RkYwOVxuICAgIGNvcHlQdWJsaWNEaXI6IHRydWUsXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDIwMDAsXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDAsXG4gICAgY29tbW9uanNPcHRpb25zOiB7XG4gICAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZSxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIC8vIFx1MzAxMFx1NEZFRVx1NTkwRFx1MzAxMVx1NzlGQlx1OTY2NCBiYWJ5bG9uLW1tZCBcdTU5MTZcdTkwRThcdTRGOURcdThENTZcdTkxNERcdTdGNkVcdUZGMENcdThCQTlcdTVCODNcdTg4QUJcdTZCNjNcdTc4NkVcdTYyNTNcdTUzMDVcbiAgICAgIGV4dGVybmFsOiBbXG4gICAgICAgIC8vICdiYWJ5bG9uLW1tZCcsXG4gICAgICAgIC8vIC9eYmFieWxvbi1tbWRcXC8uKi8sXG4gICAgICBdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICAgIC8vIFx1NTNFQVx1NUJGOSBub2RlX21vZHVsZXMgXHU0RTJEXHU3Njg0XHU1MzA1XHU4RkRCXHU4ODRDXHU2MjRCXHU1MkE4XHU1MjA2XHU1NzU3XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdiYWJ5bG9uLW1tZCcpKSByZXR1cm4gJ2JhYnlsb24tbW1kJztcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQGJhYnlsb25qcy9jb3JlJykpIHJldHVybiAnYmFieWxvbi1jb3JlJztcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnQGJhYnlsb25qcy9sb2FkZXJzJykgfHwgaWQuaW5jbHVkZXMoJ0BiYWJ5bG9uanMvbWF0ZXJpYWxzJykpIHJldHVybiAnYmFieWxvbi1sb2FkZXJzJztcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndnVlJykgJiYgIWlkLmluY2x1ZGVzKCd2dWUtcm91dGVyJykgJiYgIWlkLmluY2x1ZGVzKCdwaW5pYScpKSByZXR1cm4gJ3Z1ZS12ZW5kb3InO1xuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2dWUtcm91dGVyJykpIHJldHVybiAndnVlLXZlbmRvcic7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSkiXSwKICAibWFwcGluZ3MiOiAiO0FBQXVQLFNBQVMsb0JBQW9CO0FBQ3BSLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsZUFBZTtBQUN4QixPQUFPLFFBQVE7QUFDZixPQUFPLFVBQVU7QUFQakIsSUFBTSxtQ0FBbUM7QUFZekMsU0FBUyxxQkFBcUI7QUFDNUIsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sZ0JBQWdCLFFBQVE7QUFDdEIsYUFBTyxZQUFZLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUztBQUV6QyxZQUFJLElBQUksT0FBTyxJQUFJLElBQUksU0FBUyxPQUFPLEdBQUc7QUFFeEMsZ0JBQU0sWUFBWTtBQUFBLFlBQ2hCLEtBQUssUUFBUSxrQ0FBVyxnQkFBZ0IsSUFBSSxJQUFJLFFBQVEsa0JBQWtCLEVBQUUsQ0FBQztBQUFBLFlBQzdFLEtBQUssUUFBUSxrQ0FBVyxzRUFBc0U7QUFBQSxZQUM5RixLQUFLLFFBQVEsa0NBQVcsMkVBQTJFO0FBQUEsVUFDckc7QUFFQSxjQUFJLFdBQVc7QUFDZixxQkFBVyxLQUFLLFdBQVc7QUFDekIsZ0JBQUksR0FBRyxXQUFXLENBQUMsR0FBRztBQUNwQix5QkFBVztBQUNYO0FBQUEsWUFDRjtBQUFBLFVBQ0Y7QUFHQSxjQUFJLFlBQVksR0FBRyxXQUFXLFFBQVEsR0FBRztBQUN2QyxrQkFBTSxPQUFPLEdBQUcsYUFBYSxRQUFRO0FBQ3JDLGdCQUFJLFVBQVUsZ0JBQWdCLGtCQUFrQjtBQUNoRCxnQkFBSSxVQUFVLGtCQUFrQixLQUFLLE1BQU07QUFDM0MsZ0JBQUksVUFB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

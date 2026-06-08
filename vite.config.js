import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import Layouts from 'vite-plugin-vue-layouts'
import wasm from 'vite-plugin-wasm'
import { resolve } from 'path'
import fs from 'fs'
import path from 'path'

// ============================================
// 【关键】自定义插件：强制为 WASM 文件提供正确的 MIME 类型
// ============================================
function wasmMimeTypePlugin() {
  return {
    name: 'wasm-mime-type',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // 拦截所有 .wasm 请求
        if (req.url && req.url.endsWith('.wasm')) {
          // 尝试从 node_modules 找到 WASM 文件
          const wasmPaths = [
            path.resolve(__dirname, 'node_modules', req.url.replace('/node_modules/', '')),
            path.resolve(__dirname, 'node_modules/babylon-mmd/esm/Runtime/Optimized/wasm/mmd_wasm_bg.wasm'),
            path.resolve(__dirname, 'node_modules/babylon-mmd/esm/Runtime/Optimized/wasm/mmd_wasm_simd_bg.wasm'),
          ];

          let wasmFile = null;
          for (const p of wasmPaths) {
            if (fs.existsSync(p)) {
              wasmFile = p;
              break;
            }
          }

          // 如果找到文件，直接返回二进制数据
          if (wasmFile && fs.existsSync(wasmFile)) {
            const data = fs.readFileSync(wasmFile);
            res.setHeader('Content-Type', 'application/wasm');
            res.setHeader('Content-Length', data.length);
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.end(data);
            return;
          }
        }
        next();
      });
    },
  };
}

// ============================================
// 【关键】处理 wasm-bindgen-rayon 的 IIFE 问题
// ============================================
function wasmBindgenRayonFixPlugin() {
  return {
    name: 'wasm-bindgen-rayon-fix',
    async resolveId(id, importer, options) {
      // 拦截 wasm-bindgen-rayon 的 Worker 文件
      if (id.includes('wasm-bindgen-rayon') && id.includes('workerHelpers')) {
        // 返回一个唯一的 ID 来标记这个模块
        return '\0wasm-bindgen-rayon-worker-helpers';
      }
      return null;
    },
    async load(id) {
      // 如果是 wasm-bindgen-rayon 的 Worker 文件，返回一个兼容的 ESM 模块
      if (id === '\0wasm-bindgen-rayon-worker-helpers') {
        return `
export function startWorkers(numThreads) {
  // 空实现，避免构建错误
  console.warn('wasm-bindgen-rayon worker helpers not available in this build');
}
export function initThreadPool(numThreads) {
  // 空实现，避免构建错误
}
export function getWorkerId() {
  return 0;
}
export function spawn(fn) {
  return Promise.resolve(fn());
}
export function asyncify(fn) {
  return fn;
}
`;
      }
      return null;
    },
  };
}

export default defineConfig({
  // 【关键】GitHub Pages 子路径部署必须设置
  base: '/cosmic1987/',

  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'default'
    }),
    // 【关键】处理 wasm-bindgen-rayon 的 IIFE 问题
    wasmBindgenRayonFixPlugin(),
    // 【关键】添加 WASM 支持插件
    wasm(),
    wasmMimeTypePlugin(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // 重定向 wasm-bindgen-rayon 文件
      'wasm-bindgen-rayon': resolve(__dirname, 'src/utils/emptyWorker.js'),
    },
    mainFields: ['module', 'esnext', 'jsnext:main', 'main'],
  },

  assetsInclude: [
    /\.(wasm|pmx|pmd|vmd|vpd|bmp|spa|sph|tga|png|jpg|jpeg|wav|mp3|ogg|fx|glsl|json|vertex|fragment)$/i,
  ],

  server: {
    watch: {
      usePolling: true,
      interval: 100,
    },
    headers: {
      // 【新增】关闭 COEP，允许跨域资源正常加载
      'Cross-Origin-Embedder-Policy': 'unsafe-none', 
      // 【注释】COOP，它经常和 COEP 成对出现
      // 'Cross-Origin-Opener-Policy': 'same-origin'
    },
    hmr: {
      overlay: true,
    },
  },

  optimizeDeps: {
    include: [
      '@babylonjs/core',
      '@babylonjs/loaders',
      '@babylonjs/materials',
      '@babylonjs/gui',
      'babylon-mmd',
    ],
    exclude: [],
    force: true,
    esbuildOptions: {
      target: 'es2020',
      format: 'esm',
    },
  },

  build: {
    // 不复制 public（大文件在 COS）
    copyPublicDir: false,
    target: 'esnext',
    chunkSizeWarningLimit: 2000,
    assetsInlineLimit: 0,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // 将 babylon-mmd 及其子模块排除在构建之外
      external: [
        'babylon-mmd',
        /^babylon-mmd\/.*/,
      ],
      output: {
        manualChunks: {
          'babylon-core': ['@babylonjs/core'],
          'babylon-loaders': ['@babylonjs/loaders', '@babylonjs/materials'],
          'vue-vendor': ['vue', 'vue-router'],
        },
      },
    },
  },
})
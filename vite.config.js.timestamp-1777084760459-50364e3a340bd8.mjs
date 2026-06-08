// vite.config.js
import { defineConfig } from "file:///C:/Users/X/Desktop/cosmic1977/1977vue/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Users/X/Desktop/cosmic1977/1977vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///C:/Users/X/Desktop/cosmic1977/1977vue/node_modules/unplugin-vue-components/dist/vite.mjs";
import Layouts from "file:///C:/Users/X/Desktop/cosmic1977/1977vue/node_modules/vite-plugin-vue-layouts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ["src/components"],
      plugins: [vue()],
      extensions: ["vue"]
    }),
    Layouts({
      layoutsDirs: "src/layouts",
      defaultLayout: "default"
    })
  ],
  server: {
    watch: {
      usePolling: true,
      // 使用轮询，解决某些环境下的文件监听问题
      interval: 100
      // 轮询间隔
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxYXFxcXERlc2t0b3BcXFxcY29zbWljMTk3N1xcXFwxOTc3dnVlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxYXFxcXERlc2t0b3BcXFxcY29zbWljMTk3N1xcXFwxOTc3dnVlXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9YL0Rlc2t0b3AvY29zbWljMTk3Ny8xOTc3dnVlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcbmltcG9ydCBMYXlvdXRzIGZyb20gJ3ZpdGUtcGx1Z2luLXZ1ZS1sYXlvdXRzJ1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICBkaXJzOiBbJ3NyYy9jb21wb25lbnRzJ10sXG4gICAgICBwbHVnaW5zOiBbdnVlKCldLFxuICAgICAgZXh0ZW5zaW9uczogWyd2dWUnXSxcbiAgICB9KSxcbiAgICBMYXlvdXRzKHtcbiAgICAgIGxheW91dHNEaXJzOiAnc3JjL2xheW91dHMnLFxuICAgICAgZGVmYXVsdExheW91dDogJ2RlZmF1bHQnXG4gICAgfSksXG4gIF0sXG4gIHNlcnZlcjoge1xuICAgIHdhdGNoOiB7XG4gICAgICB1c2VQb2xsaW5nOiB0cnVlLCAvLyBcdTRGN0ZcdTc1MjhcdThGNkVcdThCRTJcdUZGMENcdTg5RTNcdTUxQjNcdTY3RDBcdTRFOUJcdTczQUZcdTU4ODNcdTRFMEJcdTc2ODRcdTY1ODdcdTRFRjZcdTc2RDFcdTU0MkNcdTk1RUVcdTk4OThcbiAgICAgIGludGVydmFsOiAxMDAsICAgIC8vIFx1OEY2RVx1OEJFMlx1OTVGNFx1OTY5NFxuICAgIH0sXG4gIH0sXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBUyxvQkFBb0I7QUFDMVUsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sYUFBYTtBQUVwQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsTUFDVCxNQUFNLENBQUMsZ0JBQWdCO0FBQUEsTUFDdkIsU0FBUyxDQUFDLElBQUksQ0FBQztBQUFBLE1BQ2YsWUFBWSxDQUFDLEtBQUs7QUFBQSxJQUNwQixDQUFDO0FBQUEsSUFDRCxRQUFRO0FBQUEsTUFDTixhQUFhO0FBQUEsTUFDYixlQUFlO0FBQUEsSUFDakIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFlBQVk7QUFBQTtBQUFBLE1BQ1osVUFBVTtBQUFBO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=

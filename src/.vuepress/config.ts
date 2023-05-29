import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "zh-CN",
      title: "杨大大",
      description: "计算机的修炼指南。",
    },
    // "/zh/": {
    //   lang: "zh-CN",
    //   title: "文档演示",
    //   description: "vuepress-theme-hope 的文档演示",
    // },
  },
 
  plugins: [
    searchProPlugin({
       // 索引全部内容
      indexContent: true,
      locales: {
        "/": {
          // 覆盖 placeholder
          placeholder: "开始搜索",
        },
      },
      
    }),
  ],
  
  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

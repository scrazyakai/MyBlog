import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/MyBlog/",

  lang: "zh-CN",
  title: "我的博客",
  description: "个人博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,1
});

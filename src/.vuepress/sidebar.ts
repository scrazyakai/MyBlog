import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    {
      text: "主页",
      icon: "house",
      link: "/",
    },
    {
      text: "算法系列",
      icon: "lightbulb",
      prefix: "algorithm/",
      children: "structure",
    },
    {
      text: "独立开发项目系列",
      icon: "folder-open",
      prefix: "project/",
      children: "structure",
    },
    {
      text: "杂谈系列",
      icon: "comment-dots",
      prefix: "posts/",
      children: "structure",
    },
    
    // "intro",
    // {
    //   text: "幻灯片",
    //   icon: "person-chalkboard",
    //   link: "https://ecosystem.vuejs.press/zh/plugins/markdown/revealjs/demo.html",
    // },
  ],
});

import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "算法系列",
      icon: "pen-to-square",
      prefix: "algorithm/",
      children: "structure",
    },
    {
      text: "独立开发项目系列",
      icon: "pen-to-square",
      prefix: "project/",
      children: "structure",
    },
    {
      text: "杂谈系列",
      icon: "pen-to-square",
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
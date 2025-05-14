import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  {
    text: "博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "算法",
        icon: "pen-to-square",
        prefix: "algorithm/",
        children: [
          { text: "图", icon: "pen-to-square", link: "1" },
          { text: "回溯", icon: "pen-to-square", link: "2" },
          "3",
          "4",
        ],
      },
      {
        text: "项目",
        icon: "pen-to-square",
        prefix: "project/",
        children: [
          {
            text: "黑马点评",
            icon: "pen-to-square",
            link: "1",
          },
          {
            text: "苍穹外卖",
            icon: "pen-to-square",
            link: "2",
          },
          "3",
          "4",
        ],
      },
      { text: "樱桃", icon: "pen-to-square", link: "cherry" },
      { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
      "tomato",
      "strawberry",
    ],
  },
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);

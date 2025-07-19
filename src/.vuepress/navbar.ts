import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: '算法',
    icon: 'pen-to-square',
    link: '/algorithm/'
  },
  {
    text: '独立项目',
    icon: 'pen-to-square',
    link: '/project/'
  },
  {
    text: '杂谈',
    icon: 'pen-to-square',
    link: '/posts/'
  },
  {
    text: '时间轴',
    icon: 'time',
    link: '/timeline/'
  },
]);
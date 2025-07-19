import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: '主页',
    icon: 'house',
    link: '/'
  },
  {
    text: '算法',
    icon: 'lightbulb',
    link: '/algorithm/'
  },
  {
    text: '独立项目',
    icon: 'folder-open',
    link: '/project/'
  },
  {
    text: '杂谈',
    icon: 'comment-dots',
    link: '/posts/'
  },
  {
    text: '时间轴',
    icon: 'timeline',
    link: '/timeline/'
  },
]);

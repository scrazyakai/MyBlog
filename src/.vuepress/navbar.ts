import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: '算法系列',
    icon: 'Algorithm',
    link: '/algorithm/'
  },
  {
    text: '独立开发项目系列',
    icon: 'project',
    link: '/project/'
  },
  {
    text: '杂谈',
    icon: 'article',
    link: '/posts/'
  },
  {
    text: '黑马项目系列',
    icon: 'hm',
    link: '/hmProject/'
  },
  {
    text: '时间轴',
    icon: 'time',
    link: '/timeline/'
  },
]);

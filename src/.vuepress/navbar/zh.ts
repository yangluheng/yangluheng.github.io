import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
   { text: "项目", icon: "discover", link: "/demo/" },
  // {
  //   text: "指南",
  //   icon: "creative",
  //   prefix: "/zh/guide/",
  //   children: [
  //     {
  //       text: "分享",
  //       icon: "creative",
  //       prefix: "bar/",
  //       children: ["baz", { text: "...", icon: "more", link: "" }],
  //     },
  //     {
  //       text: "项目",
  //       icon: "config",
  //       prefix: "foo/",
  //       children: ["ray", { text: "...", icon: "more", link: "" }],
  //     },
  //   ],
  // },
  { text: "面经指南", icon: "discover", link: "/guide/" },
  {
    text: "关于我",
    icon: "note",
    link: "https://github.com/yangluheng",
  },
]);

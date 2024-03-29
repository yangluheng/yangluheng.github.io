import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/": [
    {
      icon: "note",
      text: "Java基础",
      prefix: "page/Java-SE/",
      link: "page/",
      children: "structure",
    },
    {
      text: "JVM",
      icon: "note",
      prefix: "page/JVM/",
      children: "structure",
    },
     {
      text: "多线程开发",
      icon: "note",
      prefix: "page/duo-xian-cheng/",
      children: "structure",
    },
     {
      text: "Java框架",
      icon: "note",
      prefix: "page/Java-framework/",
      children: "structure",
    },
     {
      text: "数据库",
      icon: "note",
      prefix: "page/database/",
      children: "structure",
    },
     {
      text: "消息中间件",
      icon: "note",
      prefix: "page/Kafka/",
      children: "structure",
    },
     {
      text: "操作系统",
      icon: "note",
      prefix: "page/OS/",
      children: "structure",
    },
     {
      text: "计算机网络",
      icon: "note",
      prefix: "page/cs-network/",
      children: "structure",
    },
     {
      text: "开发者工具",
      icon: "note",
      prefix: "page/dev-tools/",
      children: "structure",
    },
     {
      text: "场景问题",
      icon: "note",
      prefix: "page/chang-jing/",
      children: "structure",
    },
     {
      text: "微服务、分布式",
      icon: "note",
      prefix: "page/microservice-distribution/",
      children: "structure",
    },
     {
      text: "项目",
      icon: "note",
      prefix: "page/project/",
      children: "structure",
    },
     {
      text: "面试",
      icon: "note",
      prefix: "page/interview/",
      children: "structure",
    },
  ],
});

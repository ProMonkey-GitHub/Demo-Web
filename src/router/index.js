// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import UserList from '../components/UserList.vue';
// 引入其他页面组件

const routes = [
  {
    path: '/',
    component: UserList,
  },
  // 定义其他路由
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
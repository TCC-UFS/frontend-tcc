import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AtosView from "../views/AtosView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/atos",
    name: "atos",
    component: AtosView,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

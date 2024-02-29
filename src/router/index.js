import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AtosView from "../views/AtosView.vue";
import VisualizeLawView from "../views/VisualizeLawView.vue";
import AdvancedSearch from "../views/AdvancedSearchView.vue";

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
  },
  {
    path: "/visualize/:id",
    name: "visualizeLaw",
    component: VisualizeLawView,
  },
  {
    path: "/search",
    name: "advancedSearch",
    component: AdvancedSearch
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

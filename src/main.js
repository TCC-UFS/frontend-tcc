import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";
import "./assets/tailwind.css";
import { Api } from "./services/api";

loadFonts();

const app = createApp(App);
  
app.config.globalProperties.$api = new Api();

app.use(router)
  .use(store)
  .use(vuetify)
  .use(ToastPlugin)
  .mount("#app");

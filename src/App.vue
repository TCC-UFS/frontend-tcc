<template>
  <v-app class="bg-slate-200 dark:bg-[#121212]">
    <v-main class="h-full font-roboto">
      <Navbar
        @logout="logout"
        @logged="logged"
        :userLogged="userLogged"
        :userData="user"
      />
      <router-view />
      <v-spacer />
      <Footer />
    </v-main>
  </v-app>
</template>

<style>
.font-roboto {
  font-family: Roboto;
}
body {
  background-color: #0f172a;
}
</style>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import { useDark } from "@vueuse/core";
import { useTheme } from 'vuetify'

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
  data: () => ({
    userLogged: false,
    user: {},
  }),
  methods: {
    logged: function () {
      if (localStorage.user && !this.userLogged) {
        this.userLogged = true;
        this.user = JSON.parse(localStorage.user);
      }
    },
    logout: function () {
      this.userLogged = false;
      this.user = {};
      this.$router.push("/");
    },
  },
  mounted() {
    this.logged();

    const theme = useTheme()
    var isDark = useDark();
    theme.global.name.value = !isDark.value ? 'light' : 'dark'
  },
};
</script>

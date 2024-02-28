<template>
  <v-app class="bg-slate-200 dark:bg-[#121212]">
    <v-main class="h-full font-roboto">
      <Loading v-if="loading" />
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
.v-toast {
  z-index: 999999 !important;
}
</style>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import Loading from "./components/Loading.vue";
import { useDark } from "@vueuse/core";
import { useTheme } from 'vuetify'

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
    Loading,
  },
  data: () => ({
    loading: false,
    userLogged: false,
    requests: [],
    user: {},
  }),
  methods: {
    logged: function () {
      if (localStorage.getItem("access_token") && !this.userLogged) {
        this.userLogged = true;
        let user = JSON.parse(localStorage.getItem('user'));
        this.user = user;
      }
    },
    logout: function () {
      this.userLogged = false;
      this.user = {};
      localStorage.removeItem("access_token");
      this.$router.push("/");
    },
    mountInterceptors: function () {
      this.$api.getApi().interceptors.request.use(
        (config) => {
          this.requests.push(1);
          this.loading = true;
          return config;
        },
        (error) => {
          return error;
        }
      );

      this.$api.getApi().interceptors.response.use(
        (config) => {
          if (this.requests.length > 1) {
            this.requests.pop();
          } else {
            this.requests.pop();
            this.loading = false;
          }
          return config;
        },
        (error) => {
          if (this.requests.length > 1) {
            this.requests.pop();
          } else {
            this.requests.pop();
            this.loading = false;
          }
          
          if (error.response?.status == 403) {
            this.$toast.error("Sem permissão.");
          }else {
            if (error.response?.status == 401 && localStorage.getItem("access_token")) {
              this.logout();
              this.$toast.info("Sessão inválida, usuário deslogado.");
            } else {
              var errors = error.response?.data?.errors;
              if (errors) {
                var errorMessage = "";
                if (errors.length && errors.length > 0)
                  errorMessage = errors.join("\n");
                else {
                  for (var err in errors) {
                    errorMessage += errors[err][0] + "\n";
                  }
                }
                this.$toast.error(errorMessage);
              } else {
                this.$toast.error("Um erro ocorreu.");
              }
            }
          }
          throw error;
        }
      );
    },
  },
  mounted() {
    this.logged();
    this.mountInterceptors();

    const theme = useTheme()
    var isDark = useDark();
    theme.global.name.value = !isDark.value ? 'light' : 'dark'
  },
};
</script>

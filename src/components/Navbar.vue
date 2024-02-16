<template>
  <div>
    <div class="d-flex w-100 px-4 py-2 dark:bg-emerald-900 bg-emerald-300">
      <div class="d-flex my-auto mr-2">
        <img class="w-8" :src="require('../assets/logo.png')" />
      </div>
      <ul class="d-flex w-fit justify-start my-auto">
        <li v-for="item in items" :key="item.id">
          <div
            @click="$router.push(item.path)"
            class="d-flex dark:hover:bg-emerald-800 hover:bg-emerald-400 cursor-pointer px-4 py-2 rounded-md"
          >
            <v-icon :icon="item.icon" class="my-auto" />
            <span class="my-auto ml-2">{{ item.text }}</span>
          </div>
        </li>
      </ul>
      <v-spacer />
      <div class="my-auto dark:text-white mx-2" v-if="$route.path != '/login'">
        <v-btn
          variant="outlined"
          @click="loginDialog = true"
          v-if="!isUserLogged"
        >
          Login
        </v-btn>
        <div v-else class="d-flex my-auto mx-2">
          <span class="mx-4 text-xl font-semibold">
            Olá {{ userData.name }}
          </span>
          <v-tooltip text="Sair" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon
                icon="mdi-logout my-auto"
                v-bind="props"
                @click="logout()"
              />
            </template>
          </v-tooltip>
        </div>
      </div>
      <v-dialog v-model="loginDialog" class="w-1/4" persistent>
        <v-card class="d-flex justify-center p-5">
          <div class="d-flex text-center">
            <v-spacer />
            <v-icon icon="mdi-close hover:bg-[#ff00001d] rounded-lg" @click="loginDialog = false; user = {}" />
          </div>
          <v-card-text class="text-center">
            <v-text-field
              label="Email"
              type="email"
              variant="outlined"
              v-model="user.email"
              :rules="[rules.required, rules.min, rules.max]"
            />
            <v-text-field
              label="Senha"
              variant="outlined"
              v-model="user.password"
              type="password"
              :rules="[rules.required, rules.min, rules.maxPassword]"
            />
            <span class="mt-4 text-xs text-center">Não possui uma conta?
              <span class="underline text-blue-400 cursor-pointer" @click="registerDialog = true; loginDialog = false; user = {}">Cadastre-se</span>.
            </span>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn 
              :disabled="!(user.email && user.password)"
              variant="outlined" color="success" @click="login()">
              Entrar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="registerDialog" class="w-1/4" persistent>
        <v-card class="d-flex justify-center p-5">
          <div class="d-flex text-center">
            <v-spacer />
            <v-icon icon="mdi-close hover:bg-[#ff00001d] rounded-lg" @click="registerDialog = false; newUser = {}" />
          </div>
          <v-card-text class="text-center">
            <v-text-field
              label="Nome"
              variant="outlined"
              v-model="newUser.name"
              :rules="[rules.required, rules.minName, rules.maxName]"
            />
            <v-text-field
              label="Email"
              type="email"
              variant="outlined"
              v-model="newUser.email"
              :rules="[rules.required, rules.min, rules.max]"
            />
            <v-text-field
              label="Senha"
              variant="outlined"
              v-model="newUser.password"
              type="password"
              :rules="[rules.required, rules.min, rules.maxPassword]"
            />
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn 
              :disabled="!(newUser.email && newUser.password && newUser.name)"
              variant="outlined" color="success" @click="register()">
              Criar conta
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="my-auto">
          <v-tooltip text="Alterar Tema" location="bottom">
            <template v-slot:activator="{ props }">
              <v-icon icon="mdi-circle-half-full" v-bind="props" @click="toggleDark(); toggleTheme();"></v-icon>
            </template>
          </v-tooltip>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data: () => ({
    user: {},
    newUser: {},
    rules: {
      required: (value) => !!value || "Campo obrigatório.",
      min: (value) => value.length >= 8 || "Mínimo 8 caracteres.",
      max: (value) => value.length <= 200 || "Máximo 200 caracteres.",
      minName: (value) => value.length >= 3 || "Mínimo 3 caracteres.",
      maxName: (value) => value.length <= 50 || "Máximo 50 caracteres.",
      maxPassword: (value) => value.length <= 32 || "Máximo 32 caracteres.",
    },
    items: [
      {
        id: crypto.randomUUID(),
        text: "Home",
        icon: "mdi-home",
        path: "/",
      },
      {
        id: crypto.randomUUID(),
        text: "Leis ordinárias",
        icon: "mdi-book-open-page-variant",
        path: "/lei-ordinaria",
      },
      {
        id: crypto.randomUUID(),
        text: "Leis complementares",
        icon: "mdi-book-open-page-variant-outline",
        path: "/lei-complementar",
      },
      {
        id: crypto.randomUUID(),
        text: 'Pesquisa avançada',
        icon: "mdi-magnify",
        path: "/search"
      }
    ],
    loginDialog: false,
    registerDialog: false,
  }),
  props: {
    userLogged: Boolean,
    userData: Object,
  },
  computed: {
    isUserLogged: function () {
      return this.userLogged;
    },
  },
  methods: {
    logout() {
      localStorage.removeItem("user");
      this.$emit("logout");
      this.$router.push("/");
    },
    validateUser(user, register = false) {
      if (!user.email) 
        return "Email: Campo obrigatório.";
      if (!user.password)
        return "Senha: Campo obrigatório.";
      if (user.email.length < 8)
        return "Email: mínimo 8 caracteres.";
      if (user.email.length > 200)
        return "Email: máximo 200 caracteres.";
      if (user.password.length < 8)
        return "Senha: mínimo 8 caracteres.";
      if (user.email.length > 32)
        return "Senha: máximo 32 caracteres.";
      if (register && !user.nome)
        return "Nome: Campo obrigatório.";
      if (register && user.nome.length < 3)
        return "Nome: mínimo 3 caracteres.";
      if (register && user.nome.length > 50)
        return "Nome: máximo 50 caracteres.";

      return null;
    },
    login() {
      let errorValidation = this.validateUser(this.user);
      if (errorValidation)
        this.$toast.error(errorValidation);

      localStorage.setItem("user", JSON.stringify(user));
      this.loginDialog = false;
      this.$emit("logged");
      this.$router.push("/");
    },
    register() {
      let errorValidation = this.validateUser(this.newUser);
      if (errorValidation)
        this.$toast.error(errorValidation);

      this.$api.register(this.newUser)
      .then(() => {
        this.$toast.success("Conta criada com sucesso!");
        this.newUser = {};
        this.registerDialog = false;
      })
      .catch(err => {
        console.log(err.data);
        this.$toast.error(err.data);
      })
    }
  },
};
</script>

<script setup>
import { useDark, useToggle } from "@vueuse/core";
import { useTheme } from 'vuetify'

const theme = useTheme()

const isDark = useDark();
const toggleDark = useToggle(isDark)
function toggleTheme () {
  theme.global.name.value = !isDark.value ? 'light' : 'dark'
}
</script>

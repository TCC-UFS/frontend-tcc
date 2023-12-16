<template>
  <footer class="absolute bottom-0 w-full">
    <div class="d-flex px-10 py-2 bg-slate-900">
      <v-row>
        <v-col class="self-center">
          <div class="d-flex">
            <img
              :src="require('../assets/logo-dcomp.svg')"
              class="my-auto mr-5"
              width="80"
            />
            <img
              :src="require('../assets/logo-ufs.png')"
              class="my-auto ml-4"
              width="180"
            />
          </div>
        </v-col>
        <v-col class="self-center">
          <div class="text-center flex-col my-auto">
            <h1 class="font-semibold text-regular">Sistemas Distribuídos</h1>
            <h1 class="font-semibold text-regular">2023.2</h1>
          </div>
        </v-col>
        <v-col class="self-center">
          <div class="text-right flex-col my-auto">
            <h1 class="font-semibold text-regular">Allaphy Lima</h1>
            <h1 class="font-semibold text-regular">201700017143</h1>
          </div>
        </v-col>
      </v-row>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterView",
};
</script>

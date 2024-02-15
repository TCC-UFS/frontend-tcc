<template>
  <v-container>
    <v-row class="text-center mt-2">
      <v-col>
        <Logo />
      </v-col>
    </v-row>
    <v-row class="mt-16 d-flex justify-center">
      <v-col cols="10 d-flex justify-center">
        <v-text-field 
          id="searchbar"
          v-model="searchTerm"
          class="h-[150%]"
          clearable
          placeholder="Buscar Termo"
          variant="solo"
          append-inner-icon="mdi-send"
          @click:append-inner="search()"
          prepend-inner-icon="mdi-magnify"></v-text-field>
      </v-col>
    </v-row>
    <v-row class="text-center mt-10">
      <v-col md="3">
        <v-card class="px-4 pb-4 d-flex flex-col items-center">
          <v-card-title>FEDERAL</v-card-title>
          <div class="text-lg w-9/12">Leis Ordinárias</div>
          <div class="text-2xl mt-2">{{ stats[0] }}</div>
        </v-card>
      </v-col>
      <v-col md="3">
        <v-card class="px-4 pb-4 d-flex flex-col items-center">
          <v-card-title>FEDERAL</v-card-title>
          <div class="text-lg">Leis Complementares</div>
          <div class="text-2xl mt-2">{{ stats[1] }}</div>
        </v-card>
      </v-col>
      <v-col md="3">
        <v-card class="px-4 pb-4 d-flex flex-col items-center">
          <v-card-title>ESTADUAIS</v-card-title>
          <div class="text-lg">Leis Ordinárias</div>
          <div class="text-2xl mt-2">{{ stats[2] }}</div>
        </v-card>
      </v-col>
      <v-col md="3">
        <v-card class="px-4 pb-4 d-flex flex-col items-center">
          <v-card-title>ESTADUAIS</v-card-title>
          <div class="text-lg">Leis Complementares</div>
          <div class="text-2xl mt-2">{{ stats[3] }}</div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
#searchbar {
  height: 100%;
  font-size: x-large;
}

.v-field__prepend-inner {
  font-size: x-large;
}

.v-field__append-inner {
  font-size: x-large;
}
</style>

<script>
import Logo from '../components/Logo.vue';

export default {
  name: "HomeView",
  components: {
    Logo
  },
  data: () => ({
    searchTerm: "",
    stats: [
      1068,
      23,
      513,
      74
    ]
  }),
  methods: {
    search() {
      console.log(this.searchTerm);
    }
  }
};
</script>

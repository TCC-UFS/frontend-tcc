<template>
    <div class="d-flex justify-center">
        <v-img
          :src="require('../assets/logo2.png')"
          class="my-auto"
          contain
          max-width="200"
        />
        <span class="text-left ml-5 font-mono font-extrabold text-5xl my-auto">
          Portal<br />Legislativo<br />Ambiental <v-icon icon="mdi-leaf pb-5 pr-10 text-[#439237]" size="x-small"></v-icon>
        </span>
    </div>
</template>

<script>
export default {
  name: "Logo"
}
</script>
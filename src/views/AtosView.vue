<template>
    <v-container class="d-flex flex-col items-center">
        <v-toolbar
            v-if="!isMobile"
            density="compact"
            :elevation="4"
            class="mt-8 rounded-lg"
        >
            <div class="d-flex justify-evenly w-full">
                <!-- <div class="d-flex justify-center"> -->
                <v-row class="w-full">
                    <v-col class="d-flex items-center">
                        <span v-for="tp in types" :key="tp.id" @click="search(tp.value)"
                            :class="['cursor-pointer px-3 py-1 rounded-md  mx-2 hover:dark:text-white hover:bg-[#43923745] hover:text-black',
                            tp.value.toLowerCase() === type ? 'text-green-600' : '']">
                            {{ tp.name }}
                        </span>
                    </v-col>
                    <v-spacer />
                    <v-col class="d-flex justify-end mx-4 mt-4" cols="3">
                        <v-checkbox class="mr-2" v-for="jur in jurisdictions" v-model="filter" :key="jur.id" :label="jur.sigla" :value="jur.sigla"></v-checkbox>
                    </v-col>
                </v-row>
                <!-- </div> -->
            </div>
        </v-toolbar>
        <v-toolbar v-else
            :elevation="4"
            height="auto"
            class="mt-8 rounded-lg">
            <div class="d-flex flex-col items-center w-full">
                <div class="d-flex justify-center mt-2">
                    <span v-for="tp in types" :key="tp.id" @click="search(tp.value)"
                        :class="['cursor-pointer px-3 py-1 rounded-md  mx-2 hover:dark:text-white hover:bg-[#43923745] hover:text-black',
                        tp.value.toLowerCase() === type ? 'text-green-600' : '']">
                        {{ tp.name }}
                    </span>
                </div>
                <div class="d-flex justify-center">
                    <v-checkbox class="mr-2" v-for="jur in jurisdictions" v-model="filter" :key="jur.id" :label="jur.sigla" :value="jur.sigla"></v-checkbox>
                </div>
            </div>
        </v-toolbar>
        <v-data-table class="mt-8" :headers="headers" :items="filteredResults"
                height="50%"
                no-data-text="Nenhum resultado encontrado"
                items-per-page-text="Resultados por página:"
                :items-per-page-options="[10, 25, 50, 100]"
                loading-text="Carregando">
            <template v-slot:item.numero="{ item }">
                <div class="text-center">
                    <span>
                        {{ 
                            isNaN(item.numero) ? item.numero : parseInt(item.numero.replaceAll(".", "")).toLocaleString('pt-br').split(',').join('.') 
                        }}
                    </span>
                </div>
            </template>
                <template v-slot:item.ementa="{ item }">
                    <span>
                        {{ 
                            formatEmenta(item.ementa)
                        }}
                    </span>
                </template>
            <template v-slot:item.dataAto="{ item }">
                <span>{{ formatDate(item.dataAto) }}</span>
            </template>
            <template v-slot:item.dataPublicacao="{ item }">
                <span>{{ formatDate(item.dataPublicacao) }}</span>
            </template>
            <template v-slot:item.jurisdicao="{ item }">
                <div class="text-center">
                    <span>{{ item.jurisdicao.sigla === 'BR' ? 'Federal' : item.jurisdicao.sigla }}</span>
                </div>
            </template>
            <template v-slot:item.visualize="{ item }">
                <div class="text-center">
                    <v-tooltip>
                        <template v-slot:activator="{ props }">
                            <v-icon v-bind="props" icon="mdi-open-in-new" @click="$router.push(`/visualize/${item.id}`)"></v-icon>
                        </template>
                        Visualizar
                    </v-tooltip>
                </div>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import moment from 'moment';

export default {
  name: "Atos",
  data: () => ({
    type: 'lei-ordinaria',
    filter: [],
    types: [{
        id: '515415-lo',
        name: 'Leis Ordinárias',
        value: 'lei-ordinaria'
    }, {
        id: '756445-lc',
        name: 'Leis Complementares',
        value: 'lei-complementar'
    }],
    headers: [
        { sortable: false, title: 'Número', key: 'numero', value: item => isNaN(item.numero) ? 0 : parseInt(item.numero.replaceAll(".", "")) },
        { sortable: false, title: 'Ementa', key: 'ementa', value: 'ementa' },
        { sortable: false, title: 'Data do Ato', key: 'dataAto', value: item => moment(item.dataAto) },
        { sortable: false, title: 'Data de Publicação', key: 'dataPublicacao', value: item => moment(item.dataPublicacao) },
        { sortable: false, title: 'Jurisdição', key: 'jurisdicao', value: item => item.jurisdicao.sigla },
        { sortable: false, title: 'Ações', key: 'visualize', value: 'id' }
    ],
    laws: [],
    jurisdictions: [],
  }),
  methods: {
    formatEmenta(ementa) {
        return this.$vuetify.display.mobile ? ementa.split(" ").splice(0, 10).join(" ") + (ementa.split(" ").length > 10 ? "..." : "") : ementa;
    },
    formatDate(date) {
        return moment(date).format("DD/MM/yyyy")
    },
    search(type) {
        this.type = type;
        this.$api.getAtos({ type: this.type }).then(res => {
            this.laws = res.data;
        })
        .catch(() => {});
    },
    loadInitialData() {
        this.$api.getJurisdictionsDropdown().then(res => {
            this.jurisdictions = res.data;
            for (let i = 0; i < this.jurisdictions.length; i++) {
                this.filter.push(this.jurisdictions[i].sigla);
            }
        })
        .catch(() => {});
    },
    checkQuery() {
        let searchType = this.$route.query["type"];
        let allowed = ["lei-complementar", "lei-ordinaria"]
        if (searchType && allowed.includes(searchType.toLowerCase())) {
            this.type = searchType.toLowerCase();
            this.search(this.type);
        }
    }
  },
  computed: {
    filteredResults() {
        return this.laws.filter(a => this.filter.includes(a.jurisdicao.sigla))
    },
    isMobile() {
        return this.$vuetify.display.mobile;
    }
  },
  watch: {
    $route() {
      this.checkQuery();
    }
  },
  mounted() {
    this.checkQuery();
    this.loadInitialData();
  }
}
</script>
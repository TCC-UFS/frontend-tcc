<template>
    <v-container>
        <v-row class="justify-center">
            <v-col cols="10 d-flex justify-center">
                <div class="w-full my-auto">
                    <span class="d-flex justify-center font-mono font-extrabold text-4xl">
                        Portal Legislativo Ambiental <v-icon icon="mdi-leaf ml-2 text-[#439237]" size="x-small"></v-icon>
                    </span>
                    <v-text-field 
                        class="mt-2 z-10"
                        id="searchbar"
                        v-model="searchData.term"
                        clearable
                        placeholder="Buscar Termo"
                        variant="solo"
                        append-inner-icon="mdi-send"
                        @click:append-inner="search()"
                        prepend-inner-icon="mdi-magnify" />
                    <div class="mt-[-25px]">
                        <v-expand-transition>
                            <div v-if="expandFilters" class="dark:bg-[#000] bg-slate-100 px-2 pt-4 justify-center">
                                <v-row>
                                    <v-col class="pb-0">
                                        <v-select density="compact"
                                            variant="outlined"
                                            label="Tipo do Ato"
                                            :items="types"
                                            v-model="searchData.type" />
                                    </v-col>
                                    <v-col class="pb-0">
                                        <v-select density="compact"
                                            variant="outlined"
                                            label="Jurisdição"
                                            :items="jurisdictions"
                                            v-model="searchData.jurisdicion" />
                                    </v-col>
                                    <v-col class="d-flex items-center pt-0 justify-between">
                                        <span :class="searchData.term ? '' : 'text-[#888]'">Grau de aproximação:</span>
                                        <div class="d-flex justify-evenly mt-1 mb-2">
                                            <v-tooltip v-if="searchData.term" location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '1' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-1-box mx-2 cursor-pointer" @click="searchData.fuzziness = '1'" />
                                                </template>
                                                Baixo
                                            </v-tooltip>
                                            <v-icon v-else size="x-large" icon="mdi-numeric-1-box mx-2 text-[#777]" />
                                            <v-tooltip v-if="searchData.term" location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '3' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-3-box mx-2 cursor-pointer" @click="searchData.fuzziness = '3'" />
                                                </template>
                                                Médio
                                            </v-tooltip>
                                            <v-icon v-else size="x-large" icon="mdi-numeric-3-box mx-2 text-[#777]" />
                                            <v-tooltip v-if="searchData.term" location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '5' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-5-box mx-2 cursor-pointer" @click="searchData.fuzziness = '5'" />
                                                </template>
                                                Alto
                                            </v-tooltip>
                                            <v-icon v-else size="x-large" icon="mdi-numeric-5-box mx-2 text-[#777]" />
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="pt-0">
                                        <v-text-field density="compact"
                                            variant="outlined"
                                            label="Número"
                                            v-model="searchData.number" />
                                    </v-col>
                                    <v-col class="pt-0">
                                        <v-text-field density="compact"
                                            type="number"
                                            variant="outlined"
                                            label="Ano"
                                            v-model="searchData.number" />
                                    </v-col>
                                    <v-col class="d-flex justify-between pt-0">
                                        <span class="mt-2">Ordenar por:</span>
                                        <div class="d-flex justify-evenly mt-1 mb-2">
                                            <v-tooltip location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" size="x-large" :class="searchData.order === 'asc' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-sort-calendar-ascending mx-2 cursor-pointer" @click="searchData.order = 'asc'" />
                                                </template>
                                                Ascendente
                                            </v-tooltip>
                                            <v-tooltip location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" size="x-large" :class="searchData.order === 'desc' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-sort-calendar-descending mx-2 cursor-pointer" @click="searchData.order = 'desc'" />
                                                </template>
                                                Descendente
                                            </v-tooltip>
                                            <v-tooltip v-if="searchData.term" location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" size="x-large" :class="searchData.order === 'rel' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-format-letter-matches mx-2 cursor-pointer" @click="searchData.order = 'rel'" />
                                                </template>
                                                Relevância
                                            </v-tooltip>
                                            <v-icon v-else size="x-large" icon="mdi-format-letter-matches mx-2 text-[#777]" />
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expand-transition>
                        <div class="dark:bg-emerald-900 bg-emerald-300 items-center h-7 b-round d-flex justify-center cursor-pointer">
                            <v-tooltip :location="expandFilters ? 'bottom' : 'top'">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props" :icon="expandFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="large" class="mt-auto w-full" @click="expand()" />
                                </template>
                                Filtros
                            </v-tooltip>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-row class="mt-4">
            <v-data-table-server
                no-data-text="Nenhum resultado encontrado"
                items-per-page-text="Resultados por página:"
                :items-per-page-options="[10, 25, 50, 100]"
                loading-text="Carregando"
                v-model:items-per-page="searchData.limti"
                :items-length="results.length"
                :items="results"></v-data-table-server>
        </v-row>
    </v-container>
</template>

<style>
.b-round {
    border-radius: 0px 0px 10px 10px;
}
</style>

<script>
import Logo from '../components/Logo.vue';

export default {
    name: "AdvancedSearch",
    data: () => ({
        searchData: {
            term: null,
            type: null,
            jurisdiction: null,
            number: null,
            order: "asc",
            fuzziness: "1",
            limit: 10,
            page: 1
        },
        types: [],
        jurisdictions: [],
        results: [],
        expandFilters: true
    }),
    components: {
        Logo,
    },
    methods: {
        expand() {
            this.expandFilters = !this.expandFilters;
        },
        search() {
            console.log(this.searchData.term);
        },
        loadInitialData() {
            this.$api.getTypes().then(res => {
                this.types = res.data.map(type => type.nome);
            })
            .catch(() => {});

            this.$api.getJurisdictionsDropdown().then(res => {
                this.jurisdictions = res.data.map(jur => jur.sigla === 'BR' ? 'Federal' : jur.sigla);
            })
            .catch(() => {})
        }
    },
    mounted() {
        let query = this.$route.query["term"];
        if (query) {
            this.searchData.term = query;
            this.search();
        }

        this.loadInitialData();
    }
}
</script>
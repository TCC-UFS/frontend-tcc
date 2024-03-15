<template>
    <v-container>
        <v-row class="justify-center">
            <v-col cols="10 d-flex justify-center">
                <div class="w-full my-auto">
                    <span v-if="!isMobile" class="d-flex justify-center font-mono font-extrabold text-4xl">
                        Portal Legislativo Ambiental <v-icon icon="mdi-leaf ml-2 text-[#439237]" size="x-small"></v-icon>
                    </span>
                    <div class="d-flex justify-center" v-else>
                        <v-img
                            :src="require('../assets/logo.svg')"
                            class="my-auto"
                            contain
                            max-width="200"
                        />
                    </div>
                    <v-text-field 
                        class="mt-2 z-10"
                        id="searchbar"
                        v-model="searchData.term"
                        clearable
                        placeholder="Buscar Termo"
                        variant="solo"
                        @keyup.enter="search()"
                        append-inner-icon="mdi-send"
                        @click:append-inner="search()"
                        prepend-inner-icon="mdi-magnify" />
                    <div class="mt-[-25px]">
                        <v-expand-transition>
                            <div v-if="expandFilters" class="dark:bg-[#000] bg-slate-100 px-2 pt-4 justify-center">
                                <div v-if="isMobile" class="d-flex flex-col items-center w-full">
                                    <v-select density="compact"
                                            variant="outlined"
                                            label="Tipo do Ato"
                                            :items="types"
                                            v-model="searchData.type"
                                            class="w-full" />
                                    <v-select density="compact"
                                        variant="outlined"
                                        label="Jurisdição"
                                        class="w-full"
                                        :items="jurisdictions"
                                        v-model="searchData.jurisdiction" />
                                    <v-text-field density="compact"
                                        variant="outlined"
                                        class="w-full mt-4"
                                        label="Número"
                                        v-model="searchData.number" />
                                    <v-text-field v-if="hasTermToSearch" density="compact"
                                        type="number"
                                        disabled
                                        class="w-full"
                                        variant="outlined"
                                        label="Ano"
                                        v-model="searchData.year" />
                                    <v-text-field v-else density="compact"
                                        type="number"
                                        variant="outlined"
                                        label="Ano"
                                        v-model="searchData.year" />
                                    <span :class="enableFuzziness ? '' : 'text-[#888]'">Grau de aproximação:</span>
                                    <div class="d-flex justify-evenly mt-1 mb-2">
                                        <v-tooltip v-if="enableFuzziness" location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '0' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-0-box mx-2 cursor-pointer" @click="searchData.fuzziness = '0'" />
                                            </template>
                                            Baixo
                                        </v-tooltip>
                                        <v-icon v-else size="x-large" icon="mdi-numeric-0-box mx-2 text-[#777]" />
                                        <v-tooltip v-if="enableFuzziness" location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '1' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-1-box mx-2 cursor-pointer" @click="searchData.fuzziness = '1'" />
                                            </template>
                                            Médio
                                        </v-tooltip>
                                        <v-icon v-else size="x-large" icon="mdi-numeric-1-box mx-2 text-[#777]" />
                                        <v-tooltip v-if="enableFuzziness" location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '2' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-2-box mx-2 cursor-pointer" @click="searchData.fuzziness = '2'" />
                                            </template>
                                            Alto
                                        </v-tooltip>
                                        <v-icon v-else size="x-large" icon="mdi-numeric-2-box mx-2 text-[#777]" />
                                    </div>
                                    <span class="mt-2">Ordenar por:</span>
                                    <div class="d-flex justify-evenly mt-1 mb-4">
                                        <v-tooltip location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon v-bind="props" size="x-large" :class="searchData.order === 'asc' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-sort-calendar-ascending mx-2 cursor-pointer" @click="searchData.order = 'asc'" />
                                            </template>
                                            Mais antigo
                                        </v-tooltip>
                                        <v-tooltip location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon v-bind="props" size="x-large" :class="searchData.order === 'desc' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-sort-calendar-descending mx-2 cursor-pointer" @click="searchData.order = 'desc'" />
                                            </template>
                                            Mais recente
                                        </v-tooltip>
                                        <v-tooltip v-if="searchData.term" location="bottom">
                                            <template v-slot:activator="{ props }">
                                                <v-icon v-bind="props" size="x-large" :class="searchData.order === 'rel' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-format-letter-matches mx-2 cursor-pointer" @click="searchData.order = 'rel'" />
                                            </template>
                                            Relevância
                                        </v-tooltip>
                                        <v-icon v-else size="x-large" icon="mdi-format-letter-matches mx-2 text-[#777]" />
                                    </div>
                                    <div class="d-flex justify-center pt-4 pb-6 w-full">
                                        <v-btn variant="outlined" class="w-3/4" @click="search()">Pesquisar</v-btn>
                                    </div>
                                </div>
                                <div v-else>
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
                                                v-model="searchData.jurisdiction" />
                                        </v-col>
                                        <v-col class="d-flex items-center pt-0 justify-between">
                                            <span :class="enableFuzziness ? '' : 'text-[#888]'">Grau de aproximação:</span>
                                            <div class="d-flex justify-evenly mt-1 mb-2">
                                                <v-tooltip v-if="enableFuzziness" location="bottom">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '0' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-0-box mx-2 cursor-pointer" @click="searchData.fuzziness = '0'" />
                                                    </template>
                                                    Baixo
                                                </v-tooltip>
                                                <v-icon v-else size="x-large" icon="mdi-numeric-0-box mx-2 text-[#777]" />
                                                <v-tooltip v-if="enableFuzziness" location="bottom">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '1' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-1-box mx-2 cursor-pointer" @click="searchData.fuzziness = '1'" />
                                                    </template>
                                                    Médio
                                                </v-tooltip>
                                                <v-icon v-else size="x-large" icon="mdi-numeric-1-box mx-2 text-[#777]" />
                                                <v-tooltip v-if="enableFuzziness" location="bottom">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props" size="x-large" :class="searchData.fuzziness === '2' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-numeric-2-box mx-2 cursor-pointer" @click="searchData.fuzziness = '2'" />
                                                    </template>
                                                    Alto
                                                </v-tooltip>
                                                <v-icon v-else size="x-large" icon="mdi-numeric-2-box mx-2 text-[#777]" />
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
                                            <v-text-field v-if="hasTermToSearch" density="compact"
                                                type="number"
                                                disabled
                                                variant="outlined"
                                                label="Ano"
                                                v-model="searchData.year" />
                                            <v-text-field v-else density="compact"
                                                type="number"
                                                variant="outlined"
                                                label="Ano"
                                                v-model="searchData.year" />
                                        </v-col>
                                        <v-col class="d-flex justify-between pt-0">
                                            <span class="mt-2">Ordenar por:</span>
                                            <div class="d-flex justify-evenly mt-1 mb-2">
                                                <v-tooltip location="bottom">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props" size="x-large" :class="searchData.order === 'asc' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-sort-calendar-ascending mx-2 cursor-pointer" @click="searchData.order = 'asc'" />
                                                    </template>
                                                    Mais antigo
                                                </v-tooltip>
                                                <v-tooltip location="bottom">
                                                    <template v-slot:activator="{ props }">
                                                        <v-icon v-bind="props" size="x-large" :class="searchData.order === 'desc' ? 'dark:text-emerald-600 text-emerald-600' : ''" icon="mdi-sort-calendar-descending mx-2 cursor-pointer" @click="searchData.order = 'desc'" />
                                                    </template>
                                                    Mais recente
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
                                    <v-row class="d-flex justify-center pb-6">
                                        <v-btn variant="outlined" class="w-1/2" @click="search()">Pesquisar</v-btn>
                                    </v-row>
                                </div>
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
            <v-data-table-server v-if="searchedWithTerm"
                :headers="headers"
                disable-sort
                no-data-text="Nenhum resultado encontrado"
                items-per-page-text="Resultados por página:"
                :items-per-page-options="[10, 25, 50, 100]"
                loading-text="Carregando"
                v-model:items-per-page="searchData.limit"
                v-model:page="searchData.page"
                :items-length="totalLength"
                :items="results">
                <template v-slot:item.numero="{ item }">
                    <div class="text-center">
                        <span>
                            {{ 
                                isNaN(item.numero) ? item.numero : parseInt(item.numero.replaceAll(".", "")).toLocaleString('pt-br').split(',').join('.') 
                            }}
                        </span>
                    </div>
                </template>
                <template v-slot:item.tipoAto="{ item }">
                    <div class="text-center">
                        <span>
                            {{ 
                                formatType(item.tipoAto)
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
                        <span>{{ item.jurisdicao === 'BR' ? 'Federal' : item.jurisdicao }}</span>
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
            </v-data-table-server>
            <v-data-table v-else class="mt-8" :headers="headers" :items="results"
                disable-sort
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
                <template v-slot:item.tipoAto="{ item }">
                    <div class="text-center">
                        <span>
                            {{ 
                                formatType(item.tipoAto)
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
import moment from 'moment';

export default {
    name: "AdvancedSearch",
    data: () => ({
        searchData: {
            term: null,
            type: null,
            jurisdiction: null,
            number: null,
            order: "desc",
            fuzziness: "0",
            year: null,
            limit: 10,
            page: 1
        },
        headers: [
            { sortable: false, title: 'Número', key: 'numero', value: item => isNaN(item.numero) ? 0 : parseInt(item.numero.replaceAll(".", "")) },
            { sortable: false, title: 'Tipo', key: 'tipoAto', value: 'tipoAto' },
            { sortable: false, title: 'Ementa', key: 'ementa', value: 'ementa' },
            { sortable: false, title: 'Data do Ato', key: 'dataAto', value: item => moment(item.dataAto) },
            { sortable: false, title: 'Data de Publicação', key: 'dataPublicacao', value: item => moment(item.dataPublicacao) },
            { sortable: false, title: 'Jurisdição', key: 'jurisdicao', value: item => item.jurisdicao.sigla || item.jurisdicao },
            { sortable: false, title: 'Ações', key: 'visualize', value: 'id' }
        ],
        types: [],
        jurisdictions: [],
        results: [],
        totalLength: 0,
        expandFilters: true,
        searchedWithTerm: false,
    }),
    components: {
        Logo,
    },
    computed: {
        isMobile() {
            return this.$vuetify.display.mobile;
        },
        hasTermToSearch() {
            return this.searchData.term;
        },
        paginationChanged() {
            return this.searchData.page;
        },
        limitPerPageChanged() {
            return this.searchData.limit;
        },
        enableFuzziness() {
            return this.searchData.term && this.searchData.term.split(" ").length === 1;
        }
    },
    methods: {
        formatEmenta(ementa) {
            return this.$vuetify.display.mobile ? ementa.split(" ").splice(0, 10).join(" ") + (ementa.split(" ").length > 10 ? "..." : "") : ementa;
        },
        formatType(type) {
            var tp = type.split("_");
            for (let i = 0; i < tp.length; i++) {
                let firstLetter = tp[i].slice(0, 1);
                let rest = tp[i].slice(1);
                tp[i] = `${firstLetter.toUpperCase()}${rest}`;
            }
            return tp.join(" ");
        },
        formatDate(date) {
            return moment(date).format("DD/MM/yyyy")
        },
        expand() {
            this.expandFilters = !this.expandFilters;
        },
        search() {
            if (this.searchData.term)
                this.$router.replace({ name: "advancedSearch", query: {term: this.searchData.term} });

            this.$api.search(this.searchData).then(res => {
                if (!res.data.data)
                    this.searchedWithTerm = false;
                else this.searchedWithTerm = true;
                this.results = res.data.data || res.data;
                this.totalLength = res.data.pagination?.totalCount || res.data.length;

                if (!this.searchedWithTerm) {
                    this.results = this.results.map(r => {
                        r.tipoAto = r.tipoAto.nome;
                        return r;
                    });
                }
            })
            .catch(() => {});
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
    watch: {
        paginationChanged() {
            this.search();
        },
        limitPerPageChanged() {
            this.search();
        }
    },
    mounted() {
        let query = this.$route.query["term"];
        if (query) {
            this.searchData.term = query;
            this.searchedWithTerm = true;
            this.search();
        }

        this.loadInitialData();
    }
}
</script>
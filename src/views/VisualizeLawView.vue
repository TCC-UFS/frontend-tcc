<template>
    <v-container class="d-flex flex-col items-center h-fit">
        <div v-if="currentAto.id !== null" class="w-full h-full">
            <div v-if="currentAto.possuiHtml">
                <div id="content" v-html="sanitize(currentAto.conteudoHtml)"></div>
            </div>
            <div v-else class="w-full h-[90vh]">
                <iframe width="100%" height="100%" v-if="currentAto.arquivo" :src="b64toBlobUrl(currentAto.arquivo)" />
                <div v-else class="text-center text-4xl mt-8">Conteúdo não encontrado.</div>
            </div>
        </div>
        <div v-else class="text-center">
            <span class="text-4xl mt-8">Erro ao processar o ato.</span>
        </div>
    </v-container>
</template>

<script>
export default {
    name: "VisualizeLaw",
    data: () => ({
        currentAto: {}
    }),
    methods: {
        getAto (id) {
            this.$api.getAto(id).then(res => {
                this.currentAto = res.data;
            })
            .catch((err) => {
                console.log(err);
            })
        },
        sanitize (str) {
            return str.replaceAll(/<a.*?>|<\/a>/g, "").replaceAll(/&nbsp;/g, "");
        },
        b64toBlobUrl (b64Data, sliceSize=512) {
            if (b64Data) {
                const byteCharacters = atob(b64Data);
                const byteArrays = [];

                for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    const slice = byteCharacters.slice(offset, offset + sliceSize);

                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                    }

                    const byteArray = new Uint8Array(byteNumbers);
                    byteArrays.push(byteArray);
                }
                    
                const blob = new Blob(byteArrays, {type: 'application/pdf'});
                const blobUrl = URL.createObjectURL(blob);

                return blobUrl;
            }
            return null;
        }
    },
    mounted() {
        let id = this.$route.params["id"];
        this.getAto(id);
    }
}
</script>
<template>
    <v-app>
        <v-app-bar
        app
        color="primary"
        dark
        >
        KyDiagrams
        </v-app-bar>
        <v-main>
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import ls from 'local-storage'
import { mapMutations, mapGetters } from 'vuex'
import Vue from 'vue';
import Diagram from './types/Diagram';

export default Vue.extend({
    name: 'App',

    components: {

    },

    data: () => ({
        text: 'none',
    }),
    computed: {
        ...mapGetters(['diagrams']),
    },
	methods: {
        ...mapMutations(['SET_DIAGRAMS', 'SET_CURRENT']),
    },
    created() {
        const diagramsLs: any = ls('diagrams')
        if (diagramsLs) {
            this.SET_DIAGRAMS(diagramsLs)
            const currentLs: any = ls('current')
            const current = currentLs ? this.diagrams.find((el: Diagram) => el.id === currentLs.id) : this.diagrams[0]
            this.SET_CURRENT(current)
        }
    },
});
</script>

<style lang="scss">
    .left{
        float: left;
    }
    .right{
        float: right;
    }
    .overflow-hidden{
        overflow: hidden;
    }

</style>

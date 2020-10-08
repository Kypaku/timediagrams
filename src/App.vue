<template>
    <v-app>
        <v-app-bar app color="primary" dark>
            <router-link :to="`/`"><div class="logo-text">KyDiagrams</div></router-link>
            <v-spacer/>
            <router-link :to="`/about`" class="about">About</router-link>
        </v-app-bar>
        <v-main>
            <router-view/>
        </v-main>
    </v-app>
</template>

<script lang="ts">
    import ls from 'local-storage'
    import { mapMutations, mapGetters } from 'vuex'
    import Vue from 'vue'
    import Diagram from './types/Diagram'

    export default Vue.extend({
        name: 'App',
        components: {

        },
        data() {
            return {

            }
        },
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
                if (currentLs !== 'undefined') {
                    const current = currentLs ? this.diagrams.find((el: Diagram) => el.id === currentLs.id) : this.diagrams[0]
                    this.SET_CURRENT(current)
                }
            }
        },
    });
</script>

<style lang="scss" scoped>
	.logo-text{
		font-size: 22px;
        color: white;
	}
	.about{
		color: white;
        text-decoration: none;
	}
</style>

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
    .flex-center{
        display: flex;
        align-items: center;
    }
	.helper{
		font-size: 22px;
        color: #333;
	}
</style>

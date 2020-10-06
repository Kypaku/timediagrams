<template>
    <div class="main-page mt-3">
        <v-container>
            <Navigation :items="diagrams"/>
            <div class="diagram-wrap" v-if="current.id">
                <h3 class="mt-4">Diagram:</h3>
                <Diagram/>
            </div>
            <v-row class="footer" v-if="current.id">
                <v-col class="add-layer">
                    <AddLayer/>
                </v-col>
                <v-col class="add-block-wrap" v-if="currentLayer.id">
                    <AddBlock/>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang='ts'>
	import { mapGetters, mapMutations } from 'vuex'
    import { Vue } from 'vue-property-decorator'
	import Navigation from './Navigation/Navigation.vue'
    import Diagram from './Diagram/Diagram.vue'
	import AddBlock from './Diagram/AddBlock.vue'
	import AddLayer from './Diagram/AddLayer.vue'

    export default Vue.extend({
        components: {
            Navigation,
            Diagram,
            AddLayer,
            AddBlock,
        },
		computed: {
            ...mapGetters(['diagrams', 'current', 'currentLayer']),

        },
        methods: {
            ...mapMutations(['ADD_DIAGRAM']),

        },
    })

</script>

<style lang="scss" scoped>

</style>

<template>
    <div class="main-page">
        <v-container>
            <Navigation :items="diagrams"/>
            <Diagram/>
        </v-container>
    </div>
</template>

<script lang='ts'>
	import { mapGetters, mapMutations } from 'vuex'
    import { Vue } from 'vue-property-decorator'
	import Navigation from './Navigation/Navigation.vue'
    import Diagram from './Diagram/Diagram.vue'

    export default Vue.extend({
        components: {
            Navigation,
            Diagram,
        },
		computed: {
            ...mapGetters(['diagrams']),

        },
        methods: {
            ...mapMutations(['ADD_DIAGRAM']),

        },
    })

</script>

<style lang="scss" scoped>

</style>

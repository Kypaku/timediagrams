<template>
    <div class="navigation d-flex">
        <div class="diagrams flex-center">
            <div class="helper" v-show="!items.length">Create new diagram: </div>
            <DiagramItem v-for="item in items" :key="item.id" :item="item"/>
        </div>
        <v-dialog
            v-model="dialog"
            max-width="350"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" icon class="add-button ml-2">+</v-btn>
            </template>
            <AddDiagram @close="dialog = false"/>
        </v-dialog>
    </div>
</template>

<script lang='ts'>
    import { Vue } from 'vue-property-decorator'
    import DiagramItem from './DiagramItem.vue'
	import AddDiagram from './AddDiagram.vue'

    export default Vue.extend({
        props: {
            items: {
                type: Array,
                required: true,
            },
        },
        data() {
            return {
                dialog: false,
            }
        },
        components: {
            AddDiagram,
            DiagramItem,
        },
        computed: {

        },
        methods: {

        },
    })

    </script>

<style lang="scss" scoped>
	.add-button{
		font-size: 26px;
        font-weight: 700;
        background: #1976d21f;
	}

</style>

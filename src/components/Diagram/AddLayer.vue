<template>
    <div class="add-layer">
        <v-text-field v-model="name" label="Name" required :rules="[() => !!name || 'This field is required']"/>
        <v-textarea v-model="description" label="Description"/>
        <v-btn @click="add" :disabled="!isValidated">ADD LAYER</v-btn>
    </div>
</template>

<script lang='ts'>
	import { mapMutations, mapGetters } from 'vuex'
    import { Vue } from 'vue-property-decorator'

    export default Vue.extend({
        components: {

        },
        data() {
            return {
                name: '',
                description: '',
            }
        },
        computed: {
            ...mapGetters(['current']),
            isValidated(): boolean {
                return !!this.name.length
            },
        },
		methods: {
            ...mapMutations(['ADD_LAYER', 'SET_CURRENT_LAYER']),
			add() {
                this.ADD_LAYER({ data: { name: this.name, description: this.description } })
                this.SET_CURRENT_LAYER(this.current.layers[this.current.layers.length - 1])
			},
        },
    })

    </script>

<style lang="scss" scoped>

</style>

<template>
    <div class="add-layer">
        <v-btn-toggle v-model="mode" tile color="deep-purple accent-3" group>
            <v-btn :value="1" :disabled="!currentLayer.id">Edit layer</v-btn>
            <v-btn :value="0">Add layer</v-btn>
        </v-btn-toggle>
        <v-text-field v-model="name" label="Name" required :rules="[() => !!name || 'This field is required']"/>
        <v-textarea v-model="description" label="Description"/>
        <div class="overflow-hidden">
            <v-btn @click="apply" :disabled="!isValidated" class="right">{{mode ? 'EDIT' : 'ADD'}} LAYER</v-btn>
        </div>
    </div>
</template>

<script lang='ts'>
	import { mapMutations, mapGetters } from 'vuex'
    import { Vue } from 'vue-property-decorator'
    import { formModes } from '@/types/Misc'

    export default Vue.extend({
        components: {

        },
        data() {
            return {
                name: '',
                description: '',
                id: '',
            }
        },
        computed: {
            ...mapGetters(['current', 'currentLayer', 'addLayerMode']),
            isValidated(): boolean {
                return !!this.name.length
            },
            mode: {
                get(): formModes {
                    return this.addLayerMode
                },
                set(newVal: formModes) {
                    if (!newVal) {
                        this.name = '';
                        this.description = '';
                    }
                    this.SET_ADD_LAYER_MODE(newVal)
                },
            } as any,
        },
		methods: {
            ...mapMutations(['ADD_LAYER', 'SET_CURRENT_LAYER', 'SET_ADD_LAYER_MODE', 'UPD_LAYER']),
			apply() {
                const f = this.mode ? this.UPD_LAYER : this.ADD_LAYER
                const data = {
                        name: this.name,
                        description: this.description,
                } as any
               if (this.mode) {
                    data.id = this.id
                }
                f({ data })
                if (!this.mode) {
                    this.SET_CURRENT_LAYER(this.current.layers[this.current.layers.length - 1])
                }
			},
        },
        watch: {
            currentLayer(newVal, old) {
                if (newVal.id) {
                    this.name = newVal.name
                    this.description = newVal.description
                    this.id = newVal.id
                }
            },
        },
    })

    </script>

<style lang="scss" scoped>

</style>

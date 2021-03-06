<template>
    <div class="block diagram-item" :style="style" :class="{ active: item.id === currentBlock.id }" @click.stop="setCurrent" ref="block">
        <div  class="" v-if="!isRenaming" text v-show="width > 100">
            <span>{{item.name || "_"}}</span>
            <span class="rename_button pointer" icon @click.stop="(isRenaming = true, name = item.name)"><v-icon size="14">edit</v-icon></span>
        </div>
        <div v-else>
            <v-layout row align-center>
                <v-text-field v-model="name" label="" required></v-text-field>
                <v-btn icon @click="rename">✓</v-btn>
                <v-btn icon @click="del"><v-icon size="14">close</v-icon></v-btn>
            </v-layout>
        </div>
    </div>
</template>

<script lang='ts'>
	import { mapGetters, mapMutations } from 'vuex'
    import { getContrastYIQ } from '@/helpers';
    import { Vue } from 'vue-property-decorator'
    import { PropType } from 'vue';
    import BlockInterface from '../../types/Block';
    import LayerInterface from '../../types/Layer';

    export default Vue.extend({
        props: {
            item: {
                type: Object as PropType<BlockInterface>,
                required: true,
            },
            layer: {
                type: Object as PropType<LayerInterface>,
                required: true,
            },
            width: {
                type: Number,
                required: true,
            },
        },
        data() {
            return {
                isRenaming: false,
                name: this.item.name,
            }
        },
        components: {

        },
		computed: {
            ...mapGetters(['currentBlock', 'currentLayer', 'current']),
            style(): object {
                return {
                    background: this.item.color,
                    color: getContrastYIQ(this.item.color) > .5 ? 'black' : 'white',
                    opacity: this.item.intensity / 100,
                }
            },
        },
        methods: {
            ...mapMutations(['SET_CURRENT_BLOCK', 'DEL_BLOCK', 'UPD_BLOCK', 'SET_ADD_BLOCK_MODE', 'SET_CURRENT_LAYER', 'SET_ADD_LAYER_MODE']),
            setCurrent() {
                this.SET_CURRENT_LAYER(this.layer)
                this.SET_CURRENT_BLOCK(this.item)
                this.SET_ADD_BLOCK_MODE(1)
                this.SET_ADD_LAYER_MODE(1)
            },
            getContrastYIQ,
            del() {
                this.DEL_BLOCK({ diagramId: this.current.id, layerId: this.currentLayer.id, blockId: this.item.id })
                this.isRenaming = false
                if (this.currentBlock.id === this.item.id) {
                    this.SET_CURRENT_BLOCK(this.item)
                }
            },
            rename() {
                this.UPD_BLOCK({ diagramId: this.current.id, layerId: this.currentLayer.id, data: { id: this.item.id, name: this.name } })
                this.isRenaming = false
            },
        },
    })

</script>

<style lang="scss" scoped>
	.block{
		padding: 10px 0px !important;
        cursor: pointer;
        width: 100%;
        text-align: center;
        border-radius: 5px;
        border: transparent 4px solid;
        height: 60px;
        &.active {
            border: gray 4px solid
        }
	}

</style>

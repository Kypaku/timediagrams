<template>
    <div class="layer" :class="{ active: item.id === currentLayer.id }" @click="setCurrent" ref="layer">
        <div class="label" v-if="!isRenaming">
            <span>{{item.name || "_"}}</span>
            <span class="rename_button pointer" icon @click.stop="isRenaming = true">🖉</span>
        </div>
        <div v-else>
            <v-layout row align-center>
                <v-text-field v-model="name" label="" required></v-text-field>
                <v-btn icon @click="rename">✓</v-btn>
                <v-btn icon @click="del"><v-icon size="14">close</v-icon></v-btn>
            </v-layout>
        </div>
        <div class="blocks">
            <div class="block-wrap" v-for="(block, i) in item.blocks" :key="block.id" :style="blockStyles[i]">
                <Block :item="block" :layer="item" :width="parseInt(blockStyles[i].width)"/>
            </div>
        </div>
        <div class="description">
            {{item.description}}
        </div>
    </div>
</template>

<script lang='ts'>
	import { mapGetters, mapMutations } from 'vuex'
    import { Vue } from 'vue-property-decorator'
    import { PropType } from 'vue';
    import Block from './Block.vue';
    import LayerInterface from '../../types/Layer';
    import TimeInterval from '../../types/TimeInterval';

    export default Vue.extend({
        props: {
            item: {
                type: Object as PropType<LayerInterface>,
                required: true,
            },
            timeInterval: {
                type: Object as PropType<TimeInterval>,
                required: true,
            },
        },
        components: {
            Block,
        },
        data() {
            return {
                isCreated: false,
                isRenaming: false,
                name: this.item.name,
            }
        },
		computed: {
            ...mapGetters(['currentLayer', 'current']),
            scaleWidth(): number {
                if (this.isCreated) {
                    return this.$refs.layer && (this.$refs.layer as any).clientWidth
                }
                return 0
            },
            blockStyles(): Array<object> {
                return this.item.blocks.map(el => {
                    return {
                        left: Math.floor(((+el.start - +this.timeInterval.start) / (+this.timeInterval.end - +this.timeInterval.start)) * this.scaleWidth) + 'px',
                        width: Math.floor(((+el.end - +el.start) / (+this.timeInterval.end - +this.timeInterval.start)) * this.scaleWidth) + 'px',
                    }
                })
            },
        },
        methods: {
            ...mapMutations(['SET_CURRENT_LAYER', 'DEL_LAYER', 'UPD_LAYER', 'SET_CURRENT_BLOCK', 'SET_ADD_BLOCK_MODE', 'SET_ADD_LAYER_MODE']),
            setCurrent() {
                this.SET_CURRENT_BLOCK()
                this.SET_ADD_BLOCK_MODE(0)
                this.SET_CURRENT_LAYER(this.item)
                this.SET_ADD_LAYER_MODE(1)
            },
            del() {
                this.DEL_LAYER({ diagramId: this.current.id, layerId: this.item.id })
                this.isRenaming = false
                if (this.currentLayer.id === this.item.id) {
                    this.SET_CURRENT_LAYER(this.item)
                }
            },
            rename() {
                this.UPD_LAYER({ diagramId: this.current.id, data: { id: this.item.id, name: this.name } })
                this.isRenaming = false
            },
            parseInt,
        },
        mounted() {
            this.isCreated = true
        },
    })
</script>

<style lang="scss" scoped>
	.block-wrap{
		position: absolute;
	}
	.blocks{
		position: relative;
        width: 100%;
        height: 60px;
	}
	.layer{
		cursor: pointer;
        padding: 10px;
        flex-grow: 1;
        overflow: hidden;
	}
	.active{
        border: 2px solid #1976d2;
	}
</style>

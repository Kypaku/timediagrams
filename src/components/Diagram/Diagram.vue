<template>
    <div class="diagram">
        <div class="periods"></div>
        <div class="scale mt-5">
            <Timescale v-model="timescale"/>
        </div>
        <div class="diagram-body" v-if="current.id">
            <div class="layers pt-7">
                <h3>Layers:</h3>
                <div class="layer-wrap mt-3 flex-center" v-for="(layer, i) in current.layers" :key="layer.id">
                    <h5 class="mr-2">#{{i + 1}}</h5>
                    <Layer :item="layer" :time-interval="timescale"/>
                </div>
            </div>
            <v-row class="diagram-footer pt-3">
                <v-col class="block-data" v-show="currentBlock.description && currentBlock.description.length">
                    <h4>Block description: </h4>
                    {{currentBlock.description}}
                </v-col>
                <v-col class="overflow-hidden">
                    <v-btn @click="saveFile" class="right">Save</v-btn>
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script lang='ts'>
	import { mapGetters, mapMutations } from 'vuex'
    import { Vue } from 'vue-property-decorator'
	import Timescale from '../TimeScale/Timescale.vue'
    import Layer from './Layer.vue'

    export default Vue.extend({
        components: {
            Timescale,
            Layer,
        },
        data() {
            return {
                timescale: { start: new Date(), end: new Date('2021') },
            }
        },
		computed: {
            ...mapGetters(['current', 'currentLayer', 'currentBlock']),
        },
        methods: {
            saveFile() {
                const data = JSON.stringify(this.current)
                const blob = new Blob([data], { type: 'text/plain' })
                const e = document.createEvent('MouseEvents')
                const a = document.createElement('a');
                a.download = 'test.json';
                a.href = window.URL.createObjectURL(blob);
                a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
                e.initEvent('click', true, false) // , window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                a.dispatchEvent(e);
            },
        },
    })

</script>

<style lang="scss" scoped>
	.layers{
		background: #f9f9f9;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding: 0 5px;
        .layer-wrap{
            overflow: hidden;
        }
	}
	.diagram-footer{
		background: white;
	}
	.scale{
		background: #f9f9f9;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        padding: 0 5px;
	}
	.diagram-body{
		overflow: hidden;
	}

</style>

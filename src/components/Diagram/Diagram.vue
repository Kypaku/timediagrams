<template>
    <div class="diagram">
        <div class="periods"></div>
        <div class="scale mt-5">
            <Timescale v-model="timescale"/>
        </div>
        <div class="diagram-body mt-7" v-if="current.id">
            <Layer v-for="layer in current.layers" :key="layer.id" :item="layer" :time-interval="timescale"/>
            <v-btn @click="saveFile">Save</v-btn>
        </div>
        <div class="block-data">
            {{currentBlock.description}}
        </div>
        <v-row class="diagram-footer" v-if="current.id">
            <v-col class="add-layer">
                <AddLayer/>
            </v-col>
            <v-col class="add-block-wrap" v-if="currentLayer.id">
                <AddBlock/>
            </v-col>
        </v-row>
    </div>
</template>

<script lang='ts'>
	import { mapGetters, mapMutations } from 'vuex'
    import { Vue } from 'vue-property-decorator'
	import AddBlock from './AddBlock.vue'
	import Timescale from './Timescale.vue'
    import Layer from './Layer.vue'
	import AddLayer from './AddLayer.vue'

    export default Vue.extend({
        components: {
            AddLayer,
            AddBlock,
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
                const data = JSON.stringify({ text: this.text })
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
	.diagram-body{
		overflow: hidden;
	}

</style>

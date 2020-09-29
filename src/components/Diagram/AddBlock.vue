<template>
    <div class="add-block">
        <v-color-picker class="ma-2" :swatches="swatches" show-swatches v-model="color"></v-color-picker>
        <v-slider
            v-model="intensity"
            min="0"
            max="100"
            label="Intensity"
        />
        <v-text-field v-model="name" :rules="[() => !!name || 'This field is required']" label="Name"/>
        <v-textarea v-model="description" label="Description"/>
        start
        <v-row>
            <v-col class="col-6"><v-time-picker v-model="timeStart" format="24hr" :allowed-hours="allowedHours" :allowed-minutes="allowedMinutes"></v-time-picker></v-col>
            <v-col class="col-6"><v-time-picker v-model="timeEnd" format="24hr" :allowed-hours="allowedHours" :allowed-minutes="allowedMinutes"></v-time-picker></v-col>
        </v-row>
        end
        <v-row>
            <v-col class="col-6">
                <div class="error-label" v-show="dateIsWrong">Date interval shouldn't conflict with other blocks</div>
                <div class="error-label" v-show="dateWasSelected && !dateStart[1]">Select date interval</div>
                {{dateStart}}
                <v-date-picker v-model="dateStart" :allowed-dates="allowedDatesStart" range @input="dateWasSelected = true"></v-date-picker>
            </v-col>
            <!-- <v-col class="col-6"><v-date-picker v-model="dateEnd" :allowed-dates="allowedDatesEnd"></v-date-picker></v-col> -->
        </v-row>
        <v-btn @click="addBlock" :disabled="!isValidated">ADD BLOCK</v-btn>
    </div>
</template>

<script lang='ts'>
    import { Vue } from 'vue-property-decorator'
    import { mapGetters, mapMutations } from 'vuex'
    import TimeInterval from '@/types/TimeInterval'
    import Block from '@/types/Block'

    const NOW = new Date()

    export default Vue.extend({
        components: {

        },
        data() {
            return {
                name: '',
                description: '',
                color: '#FF0000',
                swatches: [
                    ['#FF0000', '#AA0000', '#550000'],
                    ['#FFFF00', '#AAAA00', '#555500'],
                    ['#00FF00', '#00AA00', '#005500'],
                    ['#00FFFF', '#00AAAA', '#005555'],
                    ['#0000FF', '#0000AA', '#000055'],
                ],
                intensity: 100,
                timescale: {
                    start: new Date(),
                    end: new Date(NOW.getFullYear() + 1),
                },
                timeStart: `${NOW.getHours()}:${NOW.getMinutes()}`,
                dateStart: [`${NOW.getFullYear()}-${NOW.getMonth() + 1}-${NOW.getDate()}`],
                timeEnd: '23:59',
                // dateEnd: `${NOW.getFullYear() + 1}-${1}-${1}`,
                dateWasSelected: false,
            }
        },
        computed: {
            ...mapGetters(['current', 'currentLayer']),
            allowedDates(): TimeInterval[] {
                if (!this.currentLayer) return []
                return this.currentLayer.blocks.map((el: Block) => {
                    return { start: el.start, end: el.end }
                })
            },
            isValidated(): boolean {
                return !!this.name.length && !this.dateIsWrong && !!this.dateStart[1]
            },
            dateIsWrong(): boolean {
                const sorted = [+new Date(this.dateStart[0]), +new Date(this.dateStart[1])].sort()
                const dateStart = sorted[0]
                const dateEnd = sorted[1]
                const allDates = this.allowedDates.map(el => [el.start, el.end]).flat()
                return allDates.some(el => (+el > dateStart && +el < dateEnd))
            },
        },
        methods: {
			allowedDatesStart(val: string) {
                const date = new Date(val)
                return this.allowedDates.every(el => !(+el.start < +date && +el.end > +date))
			},
			allowedDatesEnd(val: string) {
                const date = new Date(val)
                return this.allowedDates.every(el => !(+el.start < +date && +el.end > +date))
			},
			addBlock() {
                const sorted = [this.dateStart[0], this.dateStart[1]].sort((a, b) => +new Date(a) - +new Date(b))
                const dateStart = sorted[0]
                const dateEnd = sorted[1]
                this.ADD_BLOCK({
                    data: {
                        name: this.name,
                        description: this.description,
                        color: this.color,
                        intensity: this.intensity,
                        start: new Date(`${dateStart} ${this.timeStart}`),
                        end: new Date(`${dateEnd} ${this.timeEnd}`),
                    },
                })
                this.dateStart = [`${NOW.getFullYear()}-${NOW.getMonth() + 1}-${NOW.getDate()}`]
            },
            ...mapMutations(['ADD_LAYER', 'ADD_BLOCK', 'SET_CURRENT_LAYER']),
        },
    })

    </script>

<style lang="scss" scoped>
	.error-label{
		color: red;
	}

</style>

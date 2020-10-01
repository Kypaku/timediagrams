<template>
    <div class="add-block">
        <v-btn-toggle v-model="mode" tile color="deep-purple accent-3" group>
            <v-btn value="edit" v-show="!currentBlock">Edit block</v-btn>
            <v-btn value="add">Add block</v-btn>
        </v-btn-toggle>
        <v-text-field v-model="name" :rules="[() => !!name || 'This field is required']" label="Name"/>
        <v-textarea v-model="description" label="Description"/>
        <v-color-picker class="ma-2" :swatches="swatches" show-swatches v-model="color"></v-color-picker>
        <v-slider
            v-model="intensity"
            min="0"
            max="100"
            label="Intensity"
        />
        start
        <v-row>
            <v-col class="col-6"><v-time-picker v-model="timeStart" format="24hr" :allowed-hours="allowedHoursStart" :allowed-minutes="allowedMinutesStart"></v-time-picker></v-col>
            <v-col class="col-6"><v-time-picker v-model="timeEnd" format="24hr" :allowed-hours="allowedHoursEnd" :allowed-minutes="allowedMinutesEnd"></v-time-picker></v-col>
        </v-row>
        end
        <v-row>
            <v-col class="col-6">
                <div class="error-label" v-show="dateIsWrong">Date interval shouldn't conflict with other blocks</div>
                <v-date-picker v-model="dateStart" :allowed-dates="allowedDatesStart" range @input="dateWasSelected = true"></v-date-picker>
            </v-col>
        </v-row>
        <v-btn @click="addBlock" :disabled="!isValidated">ADD BLOCK</v-btn>
    </div>
</template>

<script lang='ts'>
    import { Vue } from 'vue-property-decorator'
    import { mapGetters, mapMutations } from 'vuex'
    import { dates } from '@/helpers';
    import TimeInterval from '@/types/TimeInterval'
    import Block from '@/types/Block'

    const NOW = new Date()

    function defaultData() {
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
            dateWasSelected: false,
            mode: 'add',
        }
    }

    export default Vue.extend({
        components: {

        },
        data: defaultData,
        computed: {
            ...mapGetters(['current', 'currentLayer', 'currentBlock']),
            allowedDates(): TimeInterval[] {
                if (!this.currentLayer) return []
                return this.currentLayer.blocks.map((el: Block) => {
                    return { start: el.start, end: el.end }
                })
            },
            sortedDates(): string[] {
                return this.dateStart[1] ? [this.dateStart[0], this.dateStart[1]].sort((a, b) => +new Date(a) - +new Date(b)) : [this.dateStart[0], this.dateStart[0]]
            },
            isValidated(): boolean {
                return !!this.name.length && !this.dateIsWrong
            },
            dateIsWrong(): boolean {
                const dateStart = +new Date(this.sortedDates[0])
                const dateEnd = +new Date(this.sortedDates[1])
                const allDates = this.allowedDates.map(el => [el.start, el.end]).flat()
                return allDates.some(el => (+el > dateStart && +el < dateEnd))
            },
            start(): Date {
                const dateStart = this.sortedDates[0]
                return new Date(`${dateStart} ${this.timeStart}`)
            },
            end(): Date {
                const dateEnd = this.sortedDates[1]
                return new Date(`${dateEnd} ${this.timeEnd}`)
            },
        },
        methods: {
			allowedHoursStart(val: string) {
                const date = new Date(`${this.sortedDates[0]} ${val}:00`)
                return this.allowedDates.every(el => !(+el.start < +date && +el.end > +date && +el.start < +date + dates.hour - 1 && +el.end > +date + dates.hour - 1)) && +this.end > +date
			},
			allowedMinutesStart(val: string) {
                const date = new Date(`${this.sortedDates[0]} ${this.timeStart.split(':')[0]}:${val}`)
                console.log(111);
                return this.allowedDates.every(el => !(+el.start < +date && +el.end > +date))
			},
			allowedHoursEnd(val: string) {
                const date = new Date(`${this.sortedDates[1]} ${val}:00`)
                return this.allowedDates.every(el => !(+el.start < +date && +el.end > +date && +el.start < +date + dates.hour - 1 && +el.end > +date + dates.hour - 1)) && +this.start < +date
			},
			allowedMinutesEnd(val: string) {
                const date = new Date(`${this.sortedDates[1]} ${this.timeEnd.split(':')[0]}:${val}`)
                return this.allowedDates.every(el => !(+el.start < +date && +el.end > +date))
			},
			allowedDatesStart(val: string) {
                const date = new Date(val)
                return this.allowedDates.every(el => !(+el.start < +date && +el.end > +date && +el.start < +date + dates.day - 1 && +el.end > +date + dates.day - 1))
			},
			addBlock() {
                this.ADD_BLOCK({
                    data: {
                        name: this.name,
                        description: this.description,
                        color: this.color,
                        intensity: this.intensity,
                        start: this.start,
                        end: this.end,
                    },
                })
                Object.assign(this.$data, defaultData())
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

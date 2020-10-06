<template>
    <div class="add-block">
        <v-btn-toggle v-model="mode" tile color="deep-purple accent-3" group>
            <v-btn :value="1" :disabled="!currentBlock.id">Edit block</v-btn>
            <v-btn :value="0">Add block</v-btn>
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
        <div class="overflow-hidden">
            <v-btn @click="apply" :disabled="!isValidated" class="right">{{mode ? 'EDIT' : 'ADD'}} BLOCK</v-btn>
        </div>
    </div>
</template>

<script lang='ts'>
    import { Vue } from 'vue-property-decorator'
    import { mapGetters, mapMutations } from 'vuex'
    import { dates, formatDate } from '@/helpers';
    import TimeInterval from '@/types/TimeInterval'
    import Block from '@/types/Block'
    import { formModes } from '@/types/Misc';

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
            timeStart: `${NOW.getHours()}:${NOW.getMinutes()}`,
            dateStart: [formatDate(NOW)],
            timeEnd: '23:59',
            dateWasSelected: false,
            id: '',
        }
    }

    export default Vue.extend({
        components: {

        },
        data: defaultData,
        computed: {
            ...mapGetters(['current', 'currentLayer', 'currentBlock', 'addBlockMode']),
            allowedDates(): TimeInterval[] {
                if (!this.currentLayer) return []
                const blocks = this.currentLayer.blocks.filter((el: Block) => el.id !== this.id)
                return blocks.map((el: Block) => {
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
                console.log(allDates.filter(el => (+el > dateStart && +el < dateEnd)));
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
            mode: {
                get(): formModes {
                    return this.addBlockMode
                },
                set(newVal: formModes) {
                    if (!newVal) {
                        Object.assign(this.$data, defaultData())
                    }
                    this.SET_ADD_BLOCK_MODE(newVal)
                },
            } as any,
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
			apply() {
                const f = this.mode ? this.UPD_BLOCK : this.ADD_BLOCK
                const data = {
                        name: this.name,
                        description: this.description,
                        color: this.color,
                        intensity: this.intensity,
                        start: this.start,
                        end: this.end,
                } as any
                if (this.mode) {
                    data.id = this.id
                }
                f({ data })
                Object.assign(this.$data, defaultData())
            },
            ...mapMutations(['ADD_LAYER', 'ADD_BLOCK', 'SET_CURRENT_LAYER', 'SET_ADD_BLOCK_MODE', 'UPD_BLOCK']),
        },
        watch: {
            currentBlock(newVal, old) {
                if (newVal.id) {
                    this.name = newVal.name
                    this.description = newVal.description
                    this.color = newVal.color
                    this.intensity = newVal.intensity
                    this.id = newVal.id
                    this.timeStart = `${newVal.start.getHours()}:${newVal.start.getMinutes()}`
                    this.dateStart = [formatDate(newVal.start), formatDate(newVal.end)]
                    this.timeEnd = `${newVal.end.getHours()}:${newVal.end.getMinutes()}`
                    this.dateWasSelected = false
                }
            },
        },
    })

    </script>

<style lang="scss" scoped>
	.error-label{
		color: red;
	}

</style>

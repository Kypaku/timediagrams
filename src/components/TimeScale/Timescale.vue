<template>
    <div class="time-scale"
    @wheel="scale"
    @mousedown="dragToScrollStart"
    @mouseup="dragToScrollEnd"
    @mousemove="dragToScroll"
    ref="timescale"
    >
        <div class="switches">
            <v-btn-toggle tile color="deep-purple accent-3" class="right" group>
                <v-btn @click="setScale(new Date(+new Date() + dates.day))">DAY</v-btn>
                <v-btn @click="setScale(new Date(+new Date() + dates.week))">WEEK</v-btn>
                <v-btn @click="setScale(new Date(+new Date() + dates.month))">MONTH</v-btn>
                <v-btn @click="setScale(new Date(+new Date() + dates.year))">YEAR</v-btn>
            </v-btn-toggle>
        </div>
        <div class="scale-line" :class="{drag: isDrag}" ref="scale_line">
            <!-- |{{value.start}}
            |{{value.end}}
            |{{currentScale}} -->
            <div class="scalemark" v-for="(scalemark, i) in scalemarks" :key="i" :class="'scalemark-' + scalemark.scale" :style="scalemark.style">
                <div class="scalemark-body"></div>
                <div class="scalemark-label">
                    {{scalemark.label}}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
    import pinch from 'touch-pinch';
    import { Vue } from 'vue-property-decorator'
    import { PropType } from 'vue';
    import { dates } from '@/helpers';
    import TimeInterval from '../../types/TimeInterval';

    const MIN_SCALE = 86400000
    const MAX_SCALE = 86400000 * 10 * 365

    enum Scales {
        Hour,
        Day,
        Week,
        Mount,
        Year,
    }

    interface ScaleMark {
        date: Date;
        scale: Scales;
        style: {
            left: string;
        };
        label: string;
    }

    const touchMove = (el: any, cb: Function) => {
        let oldX = 0;

        el.addEventListener('touchstart', (e: TouchEvent) => {
            oldX = e.targetTouches[0].clientX;
        }, false)

        el.addEventListener('touchcancel', (e: TouchEvent) => {
            oldX = e.targetTouches[0].clientX;
        }, false)
        /* eslint-disable */
        el.addEventListener('touchmove', (e: TouchEvent) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                cb(touch.clientX - oldX)
                oldX = touch.clientX;
                e.preventDefault();
                return false;
            }
        }, { passive: false });
        /* eslint-enable */
    }

    export default Vue.extend({
        props: {
            start: {
                type: Date,
            },
            end: {
                type: Date,
            },
            scrollable: {
                type: Boolean,
                default: true,
            },
            value: {
                type: Object as PropType<TimeInterval>,
            },
        },
        components: {

        },
        data() {
            return {
                startScale: (this.start || this.value.start) as Date,
                endScale: (this.end || this.value.end) as Date,
                isDrag: false,
                startDragPos: 0,
                dates,
                scaleWidth: 0,
            }
        },
        computed: {
            currentScale(): Scales {
                let i = 0
                const numScales = Math.ceil(this.scaleWidth / 50)
                for (const date of Object.values(dates).slice(2)) {
                    i++
                    if ((+this.endScale - +this.startScale) / date < numScales) {
                        return i - 1
                    }
                }
                return 0
            },
            scalemarks(): Array<ScaleMark> {
                const res: ScaleMark[] = []
                const final: ScaleMark[] = []
                const start = this.startScale
                const toFirstMillisecond = 1000 - start.getMilliseconds()
                const toFirstSecond = 59 - start.getSeconds()
                const toFirstMinute = 59 - start.getMinutes()
                const toFirstHour = 23 - start.getHours()
                const day = start.getDay()
                const toFirstDayOfWeek = day ? 7 - day : 0
                const firstMinute = +start + toFirstMillisecond + toFirstSecond * dates.second + toFirstMinute * dates.minute
                const firstHour = firstMinute + toFirstHour * dates.hour
                const firstDayOfWeek = firstHour + toFirstDayOfWeek * dates.day
                const firstDayOfMonth = +new Date(start.getFullYear(), start.getMonth() + 1, 1)
                const firstMonth = +new Date(start.getFullYear() + 1, 0);

                [firstMinute, firstHour, firstDayOfWeek, firstDayOfMonth, firstMonth].forEach((date, i) => {
                    if (date < +this.endScale && i >= this.currentScale) {
                        let nextDate: number = date
                        // console.log(this.currentScale, nextDate, +this.endScale, res);
                        // while (nextDate === date) {
                        while (nextDate < +this.endScale) {
                            // console.log(new Date(nextDate), +this.endScale - nextDate);
                            res.push({
                                date: new Date(nextDate),
                                scale: i,
                                style: { left: Math.floor(((nextDate - +this.startScale) / (+this.endScale - +this.startScale)) * this.scaleWidth) + 'px' },
                                label: [
                                    `${new Date(nextDate).getHours() + 1} : 00`,
                                    `${String(new Date(nextDate)).split(' ').slice(0, 3).join(' ')}`,
                                    `${String(new Date(nextDate)).split(' ').slice(0, 3).join(' ')}`,
                                    `${String(new Date(nextDate)).split(' ')[1]}`,
                                    `${new Date(nextDate).getFullYear()}`,
                                ][i],
                            })
                            if (i === 3) {
                                nextDate = +new Date(new Date(nextDate).getFullYear(), new Date(nextDate).getMonth() + 1, 1)
                            } else if (i === 4) {
                                nextDate = +new Date(new Date(nextDate).getFullYear() + 1, 0)
                            } else {
                                nextDate += Object.values(dates)[2 + i]
                            }
                        }
                    }
                })
                res.sort((a, b) => (a.date > b.date ? 1 : -1))
                let prev = res[0]
                final.push(prev)
                res.forEach((el, i) => {
                    if (i) {
                        if (+el.date === +prev.date) {
                            if (el.scale > prev.scale) {
                                final.pop()
                                final.push(el)
                            }
                        } else {
                            final.push(el)
                        }
                    }
                    prev = el
                })
                return final.filter(Boolean)
            },
        },
        methods: {
			dragToScrollStart(e: any) {
                this.isDrag = true
                this.startDragPos = e.clientX
			},
			dragToScrollEnd() {
                this.isDrag = false
			},
			dragToScroll(e: any) {
                if (this.isDrag) {
                    const dx = e.clientX - this.startDragPos
                    const dxRel = -(dx / this.scaleWidth)
                    const dxTime = dxRel * (+this.endScale - +this.startScale)
                    const start = new Date(+this.startScale + dxTime)
                    const end = new Date(+this.endScale + dxTime)
                    this.setScale(start, end)
                    this.startDragPos = e.clientX
                }
			},
			scale(e: Event) {
                e.preventDefault()
                const diff = +this.endScale - +this.startScale
                const delta = -(e as any).deltaY
                if ((diff > MIN_SCALE || delta < 0) && (diff < MAX_SCALE || delta > 0)) {
                    const k = Math.floor(diff * (delta / 2000))
                    const start = new Date(+this.startScale + k)
                    const end = new Date(+this.endScale - k)
                    this.setScale(start, end)
                }
            },
            setScale(start: Date, end: Date) {
                if (end) {
                    this.startScale = start
                    this.endScale = end
                } else {
                    this.startScale = new Date()
                    this.endScale = start
                }
                if (this.value) {
                    this.$emit('input', { start: this.startScale, end: this.endScale })
                }
            },
        },
        created() {
            if (!this.value && (!this.start || !this.end)) {
                throw new Error('Vue Timescale: value and one of time borders were not defined')
            }
            if (+this.start >= +this.end) {
                throw new Error('start parametr must be less than end')
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.scaleWidth = this.$refs.scale_line && (this.$refs.scale_line as any).clientWidth
                pinch(this.$refs.timescale).on('change', (dist: number, prev: number) => {
                    const diff = +this.endScale - +this.startScale
                    const delta = dist - prev
                    if ((diff > MIN_SCALE || delta < 0) && (diff < MAX_SCALE || delta > 0)) {
                        const k = Math.floor(diff * (delta / 200))
                        const start = new Date(+this.startScale + k)
                        const end = new Date(+this.endScale - k)
                        this.setScale(start, end)
                    }
                })
                touchMove(this.$refs.timescale as Element, (dx: number) => {
                    const dxRel = -(dx / this.scaleWidth)
                    const dxTime = dxRel * (+this.endScale - +this.startScale)
                    const start = new Date(+this.startScale + dxTime)
                    const end = new Date(+this.endScale + dxTime)
                    this.setScale(start, end)
                })
            })
        },
    })

    </script>

<style lang="scss" scoped>
	.time-scale{
		position: relative;
        .switches{
            overflow: hidden;
        }
        .scale-line{
            cursor: grab;
            height: 100px;
            border-top: 3px solid #1976d2;
            .scalemark{
                position: absolute;
                .scalemark-body{
                    background: #1976d2;
                }
                &.scalemark-1{
                    .scalemark-body{
                        width: 1px;
                        height: 10px;
                    }
                }
                &.scalemark-2{
                    .scalemark-body{
                        width: 1px;
                        height: 30px;
                    }
                }
                &.scalemark-3{
                    .scalemark-body{
                        width: 2px;
                        height: 50px;
                    }
                }
                &.scalemark-4{
                    .scalemark-body{
                        width: 2px;
                        height: 70px;
                    }
                }
                &.scalemark-5{
                    .scalemark-body{
                        width: 3px;
                        height: 90px;
                    }
                }
            }
            &.drag{
                cursor:grabbing;
                user-select: none;
            }
        }
	}

</style>

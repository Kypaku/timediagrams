<template>
    <div class="time-scale" @wheel="scale" @mousedown="dragToScrollStart" @mouseup="dragToScrollEnd" @mousemove="dragToScroll">
        <div class="scale-line" :class="{drag: isDrag}" ref="scale_line">
            |{{value.start}}
            |{{value.end}}
            |{{currentScale}}
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
                isCreated: false,
            }
        },
        computed: {
            scaleWidth(): number {
                if (this.isCreated) {
                    return this.$refs.scale_line && (this.$refs.scale_line as any).clientWidth
                }
                return 0
            },
            currentScale(): Scales {
                let i = 0
                for (const date of Object.values(dates).slice(2)) {
                    i++
                    if ((+this.endScale - +this.startScale) / date < 30) {
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
                    this.startScale = start
                    this.endScale = end
                    if (this.value) {
                        this.$emit('input', { start, end })
                    }
                    this.startDragPos = e.clientX
                }
			},
			scale(e: Event) {
                e.preventDefault()
                const diff = +this.endScale - +this.startScale
                const delta = (e as any).deltaY
                if ((diff > MIN_SCALE || delta < 0) && (diff < MAX_SCALE || delta > 0)) {
                    const k = Math.floor(diff * (delta / 2000))
                    const start = new Date(+this.startScale + k)
                    const end = new Date(+this.endScale - k)
                    this.startScale = start
                    this.endScale = end
                    if (this.value) {
                        this.$emit('input', { start, end })
                    }
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
            this.isCreated = true
        },
    })

    </script>

<style lang="scss" scoped>
	.time-scale{
		position: relative;
        .scale-line{
            cursor: grab;
            height: 100px;
            .scalemark{
                position: absolute;
                .scalemark-body{
                    background: #333;
                }
                &.scalemark-1{
                    .scalemark-body{
                        width: 1px;
                        height: 20px;
                    }
                }
                &.scalemark-2{
                    .scalemark-body{
                        width: 1px;
                        height: 40px;
                    }
                }
                &.scalemark-3{
                    .scalemark-body{
                        width: 2px;
                        height: 60px;
                    }
                }
                &.scalemark-4{
                    .scalemark-body{
                        width: 2px;
                        height: 80px;
                    }
                }
                &.scalemark-5{
                    .scalemark-body{
                        width: 3px;
                        height: 100px;
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

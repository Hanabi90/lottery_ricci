<template>
    <div class="container flip-clock">
        <template v-for="(data,index) in timeData">
            <span
                v-if="index"
                v-bind:key="data.label"
                class="flip-clock__piece"
                :id="data.elementId"
            >
                <span class="flip-clock__card flip-card">
                    <b class="flip-card__top">{{data.current | twoDigits}}</b>
                    <b class="flip-card__bottom" v-bind:data-value="data.current | twoDigits"></b>
                    <b class="flip-card__back" v-bind:data-value="data.previous | twoDigits"></b>
                    <b class="flip-card__back-bottom" v-bind:data-value="data.previous | twoDigits"></b>
                </span>
            </span>
        </template>
    </div>
</template>

<script>
let interval = null
const uuidv4 = require('uuid/v4')

export default {
    name: 'flipCountdown',
    props: {
        deadline: {
            type: String,
            default: '2019-5-26 00:00:00'
        },
        difftime: {
            default: 0
        },
        stop: {
            type: Boolean
        },
        labels: {
            type: Object,
            required: false,
            default: function() {
                return {
                    days: 'Days',
                    hours: 'Hours',
                    minutes: 'Minutes',
                    seconds: 'Seconds'
                }
            }
        }
    },
    data() {
        const uuid = uuidv4()
        return {
            now: Math.trunc(new Date().getTime() / 1000),
            interval: null,
            diff: 0,
            show: false,
            timeData: [
                {
                    current: 0,
                    previous: 0,
                    label: this.labels.days,
                    elementId: 'flip-card-days-' + uuid
                },
                {
                    current: 0,
                    previous: 0,
                    label: this.labels.hours,
                    elementId: 'flip-card-hours-' + uuid
                },
                {
                    current: 0,
                    previous: 0,
                    label: this.labels.minutes,
                    elementId: 'flip-card-minutes-' + uuid
                },
                {
                    current: 0,
                    previous: 0,
                    label: this.labels.seconds,
                    elementId: 'flip-card-seconds-' + uuid
                }
            ]
        }
    },
    computed: {
        seconds() {
            return Math.trunc(this.difftime) % 60
        },
        minutes() {
            return Math.trunc(this.difftime / 60) % 60
        },
        hours() {
            return Math.trunc(this.difftime / 60 / 60) % 24
        },
        days() {
            return Math.trunc(this.difftime / 60 / 60 / 24)
        }
    },
    watch: {
        difftime(value) {
            this.updateTime(0, this.days)
            this.updateTime(1, this.hours)
            this.updateTime(2, this.minutes)
            this.updateTime(3, this.seconds)
        }
    },
    filters: {
        twoDigits(value) {
            if (value.toString().length <= 1) {
                return '0' + value.toString()
            }
            return value.toString()
        }
    },
    methods: {
        updateTime(idx, newValue) {
            if (idx >= this.timeData.length || newValue === undefined) {
                return
            }

            if (window['requestAnimationFrame']) {
                this.frame = requestAnimationFrame(this.updateTime.bind(this))
            }

            const d = this.timeData[idx]
            const val = newValue < 0 ? 0 : newValue

            if (val !== d.current) {
                d.previous = d.current
                d.current = val

                const el = document.querySelector(`#${d.elementId}`)
                if (el) {
                    el.classList.remove('flip')
                    void el.offsetWidth
                    el.classList.add('flip')
                }
            }
        }
    },
    updated() {
        this.updateTime(0, this.days)
        this.updateTime(1, this.hours)
        this.updateTime(2, this.minutes)
        this.updateTime(3, this.seconds)
    }
}
</script>

<style scoped lang="css">
.flip-clock {
    text-align: center;
    perspective: 600px;
    margin: 0 auto;
}
.flip-clock *,
.flip-clock *:before,
.flip-clock *:after {
    box-sizing: border-box;
}
.flip-clock__piece {
    display: inline-block;
    margin: 0 0.2vw;
    box-shadow: 0px 2px 3px #310808;
}
@media (min-width: 1000px) {
    .flip-clock__piece {
        margin: 0 5px;
    }
}
.flip-clock__slot {
    font-size: 1rem;
    line-height: 1.5;
    display: block;
}
.flip-card {
    display: block;
    position: relative;
    padding-bottom: 0.72em;
    font-size: 2.25rem;
    line-height: 0.95;
}

.flip-clock__slot {
    font-size: 33px;
}
.flip-card {
    font-size: 33px;
}

.flip-card__top,
.flip-card__bottom,
.flip-card__back-bottom,
.flip-card__back::before,
.flip-card__back::after {
    display: block;
    height: 0.72em;
    color: #cca900;
    background: #820001;
    padding: 0.23em 0.15em 0.4em;
    border-radius: 0.15em 0.15em 0 0;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
    width: 2.1em;
    height: 0.72em;
}
.flip-card__bottom,
.flip-card__back-bottom {
    color: #ffdc00;
    position: absolute;
    top: 50%;
    left: 0;
    border-top: solid 1px #000;
    background: #9e0102;
    border-radius: 0 0 0.15em 0.15em;
    pointer-events: none;
    overflow: hidden;
    z-index: 2;
}
.flip-card__back-bottom {
    z-index: 1;
}
.flip-card__bottom::after,
.flip-card__back-bottom::after {
    display: block;
    margin-top: -0.72em;
}
.flip-card__back::before,
.flip-card__bottom::after,
.flip-card__back-bottom::after {
    content: attr(data-value);
}
.flip-card__back {
    position: absolute;
    top: 0;
    height: 100%;
    left: 0%;
    pointer-events: none;
}
.flip-card__back::before {
    position: relative;
    overflow: hidden;
    z-index: -1;
}
.flip .flip-card__back::before {
    z-index: 1;
    animation: flipTop 0.3s cubic-bezier(0.37, 0.01, 0.94, 0.35);
    animation-fill-mode: both;
    transform-origin: center bottom;
}
.flip .flip-card__bottom {
    transform-origin: center top;
    animation-fill-mode: both;
    animation: flipBottom 0.6s cubic-bezier(0.15, 0.45, 0.28, 1);
}
@keyframes flipTop {
    0% {
        transform: rotatex(0deg);
        z-index: 2;
    }
    0%,
    99% {
        opacity: 1;
    }
    100% {
        transform: rotatex(-90deg);
        opacity: 0;
    }
}
@keyframes flipBottom {
    0%,
    50% {
        z-index: -1;
        transform: rotatex(90deg);
        opacity: 0;
    }
    51% {
        opacity: 1;
    }
    100% {
        opacity: 1;
        transform: rotatex(0deg);
        z-index: 5;
    }
}
</style>

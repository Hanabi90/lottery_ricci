<template>
    <ul class="lottery_show">
        <li class="lottery_logo"></li>
        <li>
            <div>
                <p>第{{issue}}期</p>
                <p>投注剩余时间</p>
            </div>
        </li>
        <li>
            <CountDown :difftime="timercount"/>
        </li>
        <li>
            <p class="lottery_history_issue">
                <span>第{{lotteryNumber.issue}}期</span>
                <span>号码走势</span>
            </p>
            <p class="lottery_num_box">
                <span v-for="(item,index) of lotteryNumber.code.split(' ')" :key="index">{{item}}</span>
            </p>
        </li>
    </ul>
</template>
<script>
import CountDown from './countdown'
import { getissue, getprize } from '@/api/index'
import { EventBus } from '@/api/eventBus.js'
export default {
    name: 'lottery_show',
    data() {
        return {
            issue: '',
            timercount: 0,
            lotteryNumber: {
                code: ''
            }, //开奖结果
            opentimeList: [], //开奖时间
            openTimeOnOff: true, //开奖函数只执行一次
            count: 0,
            timerDown: '', //倒计时定时器
            timerOpenTime: '' //倒计时开奖
        }
    },
    mounted() {
        let lotteryid = sessionStorage.getItem('lotteryId')
        this.handleIssues()
        getprize({ lotteryid, size: 7 }).then(res => {
            for (const key in res.data[0]) {
                this.$set(this.lotteryNumber, key, res.data[0][key])
                this.$store.dispatch('handleOpenList', res.data)
            }
        })
    },
    methods: {
        down() {
            if (this.timercount) {
                this.timerDown = setTimeout(() => {
                    this.timercount -= 1
                    this.down()
                }, 1000)
            } else {
                this.timerDown = setTimeout(() => {
                    this.handleIssues()
                }, 1000)
            }
        },
        handleOpenTime() {
            let lotteryid = sessionStorage.getItem('lotteryId')
            let opentime = this.opentimeList[0].opentime,
                current = this.opentimeList[0].current
            if (opentime) {
                this.timerOpenTime = setTimeout(() => {
                    this.$set(this.opentimeList[0], 'opentime', opentime - 1)
                    this.handleOpenTime()
                }, 1000)
            } else {
                getprize({ lotteryid, size: 7 }).then(res => {
                    let getCurrent = res.data[0].issue.split('-')[1]
                    let nowissue = this.issue.split('-') //当前的奖期
                    if (current == getCurrent) {
                        this.count = 0 //从新计数
                        for (const key in res.data[0]) {
                            this.$set(this.lotteryNumber, key, res.data[0][key]) //开奖
                        }
                        this.$store.dispatch('handleOpenList', res.data)
                        this.opentimeList.shift()
                    }
                    if (current != getCurrent) {
                        this.count += 1
                        if (this.count > 3) {
                            this.opentimeList.shift()
                            this.opentimeList[0].opentime -= 3
                            this.openTimeOnOff = true
                            this.count = 0
                            //开奖失败
                            this.$set(
                                this.lotteryNumber,
                                'issue',
                                `${nowissue[0]}-${nowissue[1] - 1}`
                            ) //开奖
                            this.$set(this.lotteryNumber, 'code', '- - - - -')
                        }
                    }
                    this.timerOpenTime = setTimeout(() => {
                        this.handleOpenTime()
                    }, 1000)
                })
            }
        },
        handleIssues() {
            let lotteryid = sessionStorage.getItem('lotteryId')
            getissue({
                lotteryid
            }).then(res => {
                this.saleend = res.data.saleend
                this.issue = res.data.issue
                let now = Math.trunc(
                        Date.parse(res.data.nowtime.replace(/-/g, '/')) / 1000
                    ),
                    date = Math.trunc(
                        Date.parse(res.data.saleend.replace(/-/g, '/')) / 1000
                    ),
                    open = (date = Math.trunc(
                        Date.parse(res.data.opentime.replace(/-/g, '/')) / 1000
                    )),
                    opentime = open - now
                this.timercount = date - now
                this.opentimeList.push({ current: res.data.current, opentime })
                this.down()
                if (this.openTimeOnOff) {
                    this.handleOpenTime()
                }
                this.openTimeOnOff = false
                //奖期更新 处理 追号列表更新
                this.$Message.info({
                    content: '当前奖期已售完，请购买下一期',
                    duration: 4
                })
                this.$store.dispatch('handleIssue', res.data.issue)
                EventBus.$emit('updateTraceList')
            })
        }
    },
    beforeDestroy() {
        //销毁时，清除定时器循环
        clearTimeout(this.timerDown)
        clearTimeout(this.timerOpenTime)
    },
    components: {
        CountDown
    }
}
</script>

<style lang="stylus" scoped>
.lottery_show
    height 92px
    border 5px solid #5a5a5a
    border-radius 16px
    background url('../../assets/images/ssc-repeat_001.jpg')
    overflow hidden
    box-shadow Boxshaow
    li
        height 100%
        float left
    .lottery_logo
        width 141px
        margin-left 16px
        border-right 1px solid #545454
        background url('../../assets/images/lottery_logo.png') left center no-repeat
    li:nth-child(2)
        width 140px
        font-size 12px
        color #fff
        line-height 26px
        div
            margin-left 20px
            margin-top 11px
    li:nth-child(3)
        width 259px
        text-align center
        font-size 26px
        padding-top 16px
        color #fff
        border-right 1px solid #545454
        span
            border 4px solid #fff
            padding 10px
            border-radius 6px
            margin-right 10px
        i
            margin-right 10px
    li:nth-child(4)
        width 342px
        font-size 12px
        .lottery_history_issue
            margin-top 4px
            overflow hidden
            span:first-child
                float left
                margin-left 14px
                color #b5b5b5
            span:last-child
                float right
                color #fdf707
        .lottery_num_box
            font-size 24px
            font-weight bold
            color #8c5a8e
            line-height 62px
            margin-left 20px
            span
                width 40px
                height 40px
                line-height 40px
                text-align center
                display inline-block
                border 1px solid #fff
                border-radius 40px
                margin-right 28px
                color #fff
                box-shadow 0 0 0 #000
                &:first-child
                    margin-left 5px
                &:last-child
                    margin-right 0
</style>

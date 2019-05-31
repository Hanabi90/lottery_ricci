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
            <CountDown :difftime="timercount" :deadline="saleend"/>
        </li>
        <li>
            <p class="lottery_history_issue">
                <span>第20190502-042期</span>
                <span>号码走势</span>
            </p>
            <p class="lottery_num_box">
                <span>1</span>
                <span>1</span>
                <span>1</span>
                <span>1</span>
                <span>1</span>
            </p>
        </li>
    </ul>
</template>
<script>
import CountDown from './countdown'
import { getissue } from '@/api/index'
export default {
    name: 'lottery_show',
    data() {
        return {
            saleend: '0000-00-00 00:00:00',
            issue: '',
            timercount: 0
        }
    },
    mounted() {
        this.handleIssues()
    },
    methods: {
        down() {
            if (this.timercount) {
                setTimeout(() => {
                    this.timercount -= 1
                    this.down()
                }, 1000)
            } else {
                setTimeout(() => {
                    this.handleIssues()
                }, 1000)
            }
        },
        handleIssues() {
            getissue({
                lotteryid: sessionStorage.getItem('lotteryId')
            }).then(res => {
                this.$store.dispatch('handleIssue', res.data.issue)
                this.saleend = res.data.saleend
                this.issue = res.data.issue
                let now = Math.trunc(new Date().getTime() / 1000),
                    date = Math.trunc(
                        Date.parse(res.data.saleend.replace(/-/g, '/')) / 1000
                    )
                this.timercount = date - now
                this.down()
            })
        }
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

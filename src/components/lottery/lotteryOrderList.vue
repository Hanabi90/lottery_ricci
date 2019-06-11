<template>
    <div class="lotteryOrderList">
        <ul class="orderTitle">
            <li>玩法</li>
            <li>投注号码</li>
            <li>模式</li>
            <li>资金模式</li>
            <li>倍率</li>
            <li>注数</li>
            <li>金额</li>
            <li>
                <Button @click="handleClear" type="primary">清空</Button>
            </li>
        </ul>
        <div class="content">
            <ul
                v-for="(item,value) of this.$store.state.orderList "
                :key="value"
                class="orderContent"
            >
                <li>{{item.desc}}</li>
                <li>{{item.codes}}</li>
                <li>现金</li>
                <li>元</li>
                <li>{{item.times}}倍</li>
                <li>{{item.nums}}注</li>
                <li>{{item.money}}元</li>
                <li>
                    <Button @click="handleDelete(value,$event)" type="error">删除</Button>
                </li>
            </ul>
        </div>
        <ul class="orderNow">
            <li>
                <span>已选</span>
                <span>0</span>
                <span>单</span>
                <span>共计</span>
                <span>0</span>
                <span>注</span>
                <span>总金额</span>
                <span>0.000</span>
                <span>元</span>
            </li>
            <li>
                <span @click="handleTrace">
                    <i class="icon" :class="{active:trace}"></i>
                    <span>发起追号</span>
                </span>
                <span>取消追号</span>
                <button @click="submint">立即投注</button>
            </li>
            <li>
                <i class="icon"></i>
                <span>开启中奖通知</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { Button, Checkbox } from 'iview'
import { betting } from '@/api/index'
export default {
    name: 'lotteryOrderList',
    data() {
        return {
            trace: false
        }
    },
    methods: {
        //是否追号
        handleTrace() {
            if (this.$store.state.orderList.length) {
                this.$parent.$data.trace = this.trace = !this.trace
            } else {
                this.trace = false
                this.$Message.error('请添加注单')
            }
        },

        handleClear() {
            this.$store.dispatch('handleOrderList', { type: 'clear' })
        },
        handleDelete(value) {
            let arr = [...this.$store.state.orderList]
            arr.splice(value, 1)
            this.$store.dispatch('handleOrderList', {
                data: arr,
                type: 'delete'
            })
        },
        submint() {
            if (!this.$store.state.orderList.length) {
                this.$Message.error('号码不完整')
                return
            }
            this.$parent.$data.trace = this.trace = false //关闭追号
            let postdata = {
                betparams: {
                    iWalletType: 1, // 钱包类型
                    curmid: this.$route.query.menuId, //菜單ID,
                    lt_issue_start: this.$store.state.issue, //购买的彩票奖期
                    lt_project: [...this.$store.state.orderList]
                },
                bettraceparams: {
                    lt_trace_if: 'no', //是否追号
                    lt_trace_stop: 'no', //中奖后是否停止追号 no-中奖后继续追号
                    zhuihao: 2, //1：利潤率追號；2：同倍追號；3：翻倍追號；
                    lt_trace_count_input: 10, //追号期数，指要追多少期
                    lt_trace_money: 0.1, //追号总金额
                    lt_trace_times_margin: 1, //起始倍数
                    lt_trace_margin: 50, //最低收益
                    lt_trace_times_same: 1, //固定值1
                    lt_trace_diff: 1, //固定值1
                    lt_trace_times_diff: 2, //固定值2
                    lt_trace_issues: [
                        {
                            lt_trace_issues: '20190531-048', //期数
                            lt_trace_times: 1 //
                        }
                    ]
                }
            }
            betting({ postdata: JSON.stringify(postdata) }).then(res => {
                this.$Message.success('投注成功')
                this.$store.dispatch('handleOrderHistory', [...res.data.betlog])
                this.$store.dispatch('handleOrderList', { type: 'clear' })
            })
        }
    },
    components: {
        Button
    }
}
</script>

<style lang="stylus" scoped>
.lotteryOrderList
    clear both
    background url('../../assets/images/ssc-repeat_001.jpg')
    .content
        max-height 200px
        overflow-y scroll
        text-align center
        .orderContent
            min-height 30px
            border-bottom 1px solid #4c4c4c
            background #383838
            display flex
            font-size 12px
            color #fff
            line-height 30px
            li
                padding 10px 0
                flex 1
                text-align center
                &:first-child
                    flex 1.5
    .orderTitle
        background #505050
        border-bottom 1px solid #313131
        display flex
        padding-right 18px
        li
            line-height 44px
            flex 1
            color #e8e8e8
            text-align center
            &:first-child
                flex 1.5
    .orderNow
        display flex
        li
            flex 1
            color #e8e8e8
            text-align center
            span
                margin 0 8px
                line-height 60px
            i.icon
                display inline-block
                width 14px
                height 14px
                border 1px solid #dcdcdc
                border-radius 3px
                margin-bottom -2px
            i.active
                background #ff632c
                border-color #ff632c
                position relative
                &::after
                    content '√'
                    position absolute
                    color #fff
                    left 2px
                    top -22px
            button
                height 42px
                border none
                background #ff6000
                margin 0 10px
                color #fff
                padding 0 20px
                font-size 14px
                border-radius 3px
                line-height 42px
                outline none
                box-shadow 0 3px 4px #1f1d1d
</style>

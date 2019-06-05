<template>
    <div class="lotteryOrderList">
        <ul class="orderTitle">
            <li>玩法与投注号码</li>
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
                <li>现金</li>
                <li>元</li>
                <li>{{item.times}}倍</li>
                <li>{{item.nums}}注</li>
                <li>{{item.money}}元</li>
                <li>
                    <Button @click="handleDelete(value)" type="error">删除</Button>
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
                <Checkbox @on-change="changeTrace(trace)" v-model="trace">发起追号</Checkbox>
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
        changeTrace(trace) {
            this.$parent.$data.trace = trace
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
            let postdata = {
                betparams: {
                    iWalletType: 1, // 钱包类型
                    curmid: this.$route.query.menuId, //菜單ID,
                    lt_issue_start: this.$store.state.issus, //购买的彩票奖期
                    lt_project: [...this.$store.state.orderList]
                },
                bettraceparams: {
                    lt_trace_if: 'no',
                    lt_trace_stop: '',
                    lt_trace_money: '',
                    lt_trace_issues: ''
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
        Button,
        Checkbox
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

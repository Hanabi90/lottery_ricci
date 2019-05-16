<template>
    <div class="lotteryOrderList">
        <ul class="orderTitle">
            <li>玩法与投注号码</li>
            <li>模式</li>
            <li>资金模式</li>
            <li>倍率</li>
            <li>注数</li>
            <li>金额</li>
            <li>清空</li>
        </ul>
        <ul class="orderContent">
            <li>[前三码_复式]56789,01234,13579,-,-</li>
            <li>1900.00</li>
            <li>
                <Select v-model="money1" style="width:60px" transfer>
                    <Option
                        v-for="item in money"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </li>
            <li>1倍</li>
            <li>125注</li>
            <li>2.500元</li>
            <li>删除</li>
        </ul>
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
                <i class="icon"></i>
                <span>发起追号</span>
                <span>取消追号</span>
                <button>立即投注</button>
            </li>
            <li>
                <i class="icon"></i>
                <span>开启中奖通知</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { Select, Option } from 'iview'
export default {
    name: 'lotteryOrderList',
    data() {
        return {
            money: [
                {
                    value: '元',
                    label: '元'
                },
                {
                    value: '角',
                    label: '角'
                },
                {
                    value: '分',
                    label: '分'
                }
            ],
            money1: '元'
        }
    },
    components: {
        Select,
        Option
    }
}
</script>

<style lang="stylus" scoped>
.lotteryOrderList
    clear both
    background url('../../assets/images/ssc-repeat_001.jpg')
    .orderTitle
        background #505050
        border-bottom 1px solid #313131
        display flex
        li
            line-height 44px
            flex 1
            color #e8e8e8
            text-align center
            &:first-child
                flex 1.5
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

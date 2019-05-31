<template>
    <div class="order">
        <div class="order_left">
            <ul>
                <li
                    :class="{'active':unitActive==value}"
                    @click="chosenUnit(item,value)"
                    v-for="(item,value) of modes"
                    :key="item.modeid"
                >{{item.name}}</li>
            </ul>
            <div class="multiple">
                <input v-model="multiple" type="text">
                <span class="multiple_text">倍</span>
                <div>
                    <span @click="changeMultiple('+')">+</span>
                    <span @click="changeMultiple('-')">-</span>
                </div>
            </div>
        </div>
        <div class="order_right">
            <span>已选</span>
            <span>{{orders}}</span>
            <span>注</span>
            <span>共</span>
            <span>{{money}}</span>
            <span>元</span>
            <span>奖金</span>
            <span>{{bonus}}</span>
            <button class="buttonColor" @click="submint">一键投注</button>
            <button @click="addOrder">添加投注</button>
        </div>
    </div>
</template>

<script>
import { getissue, betting } from '@/api/index'
import math from '@/assets/js/lib.js'
export default {
    name: 'order',
    props: {
        methodList: {},
        iWalletType: {},
        methodid: {},
        rebate: {},
        nowPrizeGroup: {},
        lotterynumber: {},
        prize: {},
        modes: {
            default: function() {
                return [
                    {
                        modeid: 1,
                        name: '元',
                        rate: 1
                    }
                ]
            }
        }
    },
    data() {
        return {
            unitActive: 0, //当前
            multiple: 1 //倍数
        }
    },
    computed: {
        //投注单数
        orders() {
            let arr = this.$store.state.lotteryNumber,
                nums = 0
            if (
                arr.methods === '五星直选复式' &&
                arr.list.every(item => item.size > 0)
            ) {
                nums = arr.list.reduce(
                    (preValue, curValue) => preValue * curValue.size,
                    1
                )
            }
            if (arr.methods === '五星直选单式' && arr.list) {
                nums = arr.list.length
            }
            if (arr.methods === '五星组选组120' && arr.list[0].size >= 5) {
                nums = math.combo(Array.from(arr.list[0]), 5).length
            }
            if (
                arr.methods === '五星组选组60' &&
                arr.list[0].size >= 1 &&
                arr.list[1].size >= 3
            ) {
                for (let item of arr.list[0].values()) {
                    if (arr.list[1].has(item)) {
                        let element = new Set([...arr.list[1]])
                        element.delete(item)
                        nums += math.combo(Array.from(element), 3).length
                    } else {
                        nums += math.combo(Array.from(arr.list[1]), 3).length
                    }
                }
            }
            if (
                arr.methods === '五星组选组30' &&
                arr.list[0].size >= 2 &&
                arr.list[1].size >= 1
            ) {
                for (let item of arr.list[1].values()) {
                    if (arr.list[0].has(item)) {
                        let element = new Set([...arr.list[0]])
                        element.delete(item)
                        nums += math.combo(Array.from(element), 2).length
                    } else {
                        nums += math.combo(Array.from(arr.list[0]), 2).length
                    }
                }
            }
            if (
                arr.methods === '五星组选组20' &&
                arr.list[0].size >= 1 &&
                arr.list[1].size >= 2
            ) {
                for (let item of arr.list[0].values()) {
                    if (arr.list[1].has(item)) {
                        let element = new Set([...arr.list[1]])
                        element.delete(item)
                        nums += math.combo(Array.from(element), 2).length
                    } else {
                        nums += math.combo(Array.from(arr.list[1]), 2).length
                    }
                }
            }
            if (
                (arr.methods === '五星组选组10' ||
                    arr.methods === '五星组选组5') &&
                arr.list[0].size >= 1 &&
                arr.list[1].size >= 1
            ) {
                for (let item of arr.list[0].values()) {
                    if (arr.list[1].has(item)) {
                        let element = new Set([...arr.list[1]])
                        element.delete(item)
                        nums += element.size
                    } else {
                        nums += arr.list[1].size
                    }
                }
            }
            if (
                arr.methods === '特殊一帆风顺' ||
                arr.methods === '特殊好事成双' ||
                arr.methods === '特殊三星报喜' ||
                arr.methods === '特殊四季发财'
            ) {
                nums = arr.list[0].size
            }
            return nums
        },
        //投注金额
        money() {
            return parseFloat(
                (
                    this.modes[this.unitActive].rate *
                    this.multiple *
                    this.orders *
                    2
                ).toPrecision(12)
            )
        },
        bonus() {
            let prize =
                (this.nowPrizeGroup / 2000) *
                this.prize *
                this.modes[this.unitActive].rate *
                this.multiple
            return Math.floor(prize * 10000) / 10000
        }
    },
    methods: {
        //提交
        submint() {
            if (!this.orders) {
                this.$Message.error('号码选择不完整')
                return
            }
            let lt_project = this.handleOrder()
            let postdata = {
                betparams: {
                    iWalletType: 1, // 钱包类型
                    curmid: Number(this.$route.query.menuId), //菜單ID,
                    lt_issue_start: this.$store.state.issus, //购买的彩票奖期
                    lt_project: [lt_project]
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
            })
        },
        //添加投注单
        addOrder() {
            if (!this.orders) {
                this.$Message.error('号码选择不完整')
                return
            }
            let lt_project = this.handleOrder()
            let repeat = this.$store.state.orderList.some(
                item => item.desc == lt_project.desc
            )
            if (!repeat) {
                this.$Message.success(`添加成功${lt_project.desc}`)
                this.$store.dispatch('handleOrderList', {
                    data: lt_project,
                    type: 'add'
                })
            } else {
                this.$Message.error(`确认区有相同的投注内容${lt_project.desc}`)
            }
            this.$store.dispatch('handleLotteryNumber', '')
            this.lotterynumber.reset()
        },
        handleOrder() {
            let singleList = [] //单式
            if (this.$store.state.lotteryNumber.methods == '五星直选单式') {
                singleList = this.$store.state.lotteryNumber.list
            }
            let codes = [...this.$store.state.lotteryNumber.list].map(item =>
                Array.from(item)
                    .sort((a, b) => a - b)
                    .join('&')
            )
            //设置组合变量
            let codesSplice = codes[0],
                codesDesc = codes[0]
            //拼接组合投注号码
            for (let index = 1; index < codes.length; index++) {
                if (codes[index]) {
                    codesSplice = codesSplice + '|' + codes[index]
                    codesDesc = codesDesc + ',' + codes[index]
                }
            }
            let handleCodes = singleList.length
                ? singleList.join('&')
                : codesSplice
            let desc = singleList.length
                ? `[${this.methodList.title}_${
                      this.methodList.desc
                  }] ${singleList.join(' ')}`
                : `[${this.methodList.title}_${
                      this.methodList.desc
                  }] ${codesDesc}`

            let lt_project = {
                type: this.$store.state.lotteryNumber.type, //彩种类型
                methodid: Number(this.methodid),
                point: this.rebate.slice(0, -1) / 100,
                codes: handleCodes,
                nums: this.orders, //投注数
                times: this.multiple, //倍数
                money: this.money, //金额,
                mode: this.modes[this.unitActive].modeid,
                desc: desc,
                buqsno: 'buqsno5ce3a094c4706'
            }
            return lt_project
        },
        chosenUnit(item, value) {
            this.unitActive = value
        },
        changeMultiple(item) {
            if (item == '+') {
                this.multiple++
            } else {
                this.multiple--
            }
            if (this.multiple < 1) {
                this.multiple = 1
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.order
    background url('../../assets/images/ssc-repeat_001.jpg')
    height 100px
    border-top 1px solid #464646
    overflow hidden
    .order_left
        float left
        padding 20px
        overflow hidden
        ul
            height 26px
            float left
        li
            float left
            background #7b7b7b
            width 26px
            height 26px
            line-height 26px
            border-radius 6px
            text-align center
            margin-right 10px
            color #d2d2d2
            box-shadow 0 3px 4px #1f1d1d
            &.active
                color #fff
                background #ff632c
        .multiple
            float left
            margin-left 20px
            position relative
            overflow hidden
            box-shadow 0 3px 4px #1f1d1d
            input, div
                float left
            input
                background #312e2e
                border 1px solid #ff632c
                color #fff
                height 26px
                width 80px
                border-top-left-radius 3px
                border-bottom-left-radius 3px
                padding-right 20px
                text-align center
                border-right none
            .multiple_text
                position absolute
                color #fff
                background none
                right 40px
                top 7px
                width 20px
            span
                display block
                height 13px
                line-height 13px
                width 40px
                text-align center
                background #ff632c
                &:first-child
                    border-bottom 1px solid #e24c17
    .order_right
        float right
        padding 15px
        overflow hidden
        span
            font-size 14px
            margin 0 6px
            line-height 26px
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
            &.buttonColor
                background #e02569
</style>

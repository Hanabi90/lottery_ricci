<template>
    <div class="trace">
        <div class="content">
            <span>
                <span style="margin-right:10px">追号</span>
                <RadioGroup
                    @on-change="handleList('zhuihao',zhuihao)"
                    style="margin-top:-4px"
                    v-model="zhuihao"
                    size="small"
                >
                    <Radio label="1">利润率追号</Radio>
                    <Radio label="2">同倍追号</Radio>
                    <Radio label="3">翻倍追号</Radio>
                </RadioGroup>
            </span>
            <span>
                <span style="margin-right:10px">追号期数</span>
                <Select
                    @on-change="handleList"
                    v-model="qissueno"
                    style="width:70px"
                    :transfer="true"
                    size="small"
                >
                    <Option
                        v-for="item in qissuenoList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </span>
            <span>
                <span style="margin-right:10px">起始倍数</span>
                <InputNumber
                    @on-change="handleList"
                    :max="10"
                    :min="1"
                    v-model="multiple"
                    size="small"
                    style="width:50px"
                ></InputNumber>
            </span>
            <span v-if="zhuihao==1">
                <span style="margin-right:10px">最低收益</span>
                <InputNumber
                    @on-change="handleList"
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    :min="1"
                    v-model="lt_trace_margin"
                    size="small"
                    style="width:50px"
                ></InputNumber>
            </span>
            <span>
                <i>追号总金额</i>
                <i>{{total.totalMoney}}</i>
                <i>元</i>
                <i style="margin-left:10px">总期数</i>
                <i>{{total.totalIssue}}</i>
                <i>期</i>
            </span>
        </div>
        <ul class="listTitle">
            <li>选项</li>
            <li>序号</li>
            <li>追号期数</li>
            <li>倍数</li>
            <li>金额</li>
            <li>累计金额</li>
            <li v-if="zhuihao==1">奖金</li>
            <li v-if="zhuihao==1">盈利金额</li>
            <li v-if="zhuihao==1">盈利率</li>
        </ul>
        <ul class="listContent" v-for="(item,index) of list" :key="index">
            <li>
                <div>
                    <Checkbox @on-change="test(index)" v-model="item.active"></Checkbox>
                </div>
                <div>
                    <span>{{item.index}}</span>
                </div>
                <div>
                    <span>{{item.issue}}</span>
                </div>
                <div>
                    <InputNumber
                        @on-change="handleMoney(item,index)"
                        size="small"
                        v-model="item.multiple"
                        :style="{width:'80px'}"
                        :min="1"
                    ></InputNumber>
                </div>
                <div>{{item.money}}</div>
                <div>{{item.totalNowMoney}}</div>
                <div v-if="zhuihao==1">{{item.bonues}}</div>
                <div v-if="zhuihao==1">{{item.profit}}</div>
                <div v-if="zhuihao==1">{{item.Profitability}}</div>
            </li>
        </ul>
    </div>
</template>

<script>
import { RadioGroup, Radio, Select, Option, InputNumber, Checkbox } from 'iview'
import { getcreateissues } from '@/api/index'
import { EventBus } from '@/api/eventBus.js'
export default {
    name: 'trace',
    props: ['orderList'],
    data() {
        return {
            zhuihao: '2', //1：利潤率追號；2：同倍追號；3：翻倍追號；,
            qissueno: 10, //期数
            multiple: 1, //倍数
            lt_trace_margin: 50, //最低收益
            qissuenoList: [
                {
                    value: 5,
                    label: '5期'
                },
                {
                    value: 10,
                    label: '10期'
                },
                {
                    value: 15,
                    label: '15期'
                },
                {
                    value: 20,
                    label: '20期'
                },
                {
                    value: 25,
                    label: '25期'
                },
                {
                    value: 50,
                    label: '全部'
                }
            ],
            list: [] //奖期列表
        }
    },
    mounted() {
        this.handleList()
        EventBus.$on('updateTraceList', () => {
            this.handleList()
        })
    },
    computed: {
        total() {
            let total = {
                totalMoney: 0,
                totalIssue: 0
            }
            if (this.list.length) {
                for (let index = 0; index < this.list.length; index++) {
                    const item = this.list[index]
                    if (item.active) {
                        total.totalIssue++
                        total.totalMoney += item.money
                    }
                }
            }
            return total
        }
    },
    methods: {
        test(index) {
            let count = 0
            for (let i = 0; i < this.list.length; i++) {
                const item = this.list[i]
                if (item.active) {
                    count += item.money
                    this.list[i].totalNowMoney = count
                } else {
                    this.list[i].totalNowMoney = 0
                }
            }
        },
        handleList(typevalue, value) {
            let issue = '', //当前期数
                leg = this.qissueno, //期数
                multiple = this.multiple, //倍数
                list = [], //列表存放
                total = 0 //累计奖金
            getcreateissues({
                //获取奖期
                lotteryid: sessionStorage.getItem('lotteryId'),
                currissue: this.$store.state.issue
            }).then(res => {
                issue = res.data
                if (typevalue && value == 3) {
                    this.multiple = 2
                }
                if (this.zhuihao != 1) {
                    for (let index = 0; index < leg; index++) {
                        if (this.zhuihao == 3) {
                            //翻倍追号
                            multiple =
                                multiple * index ? multiple * this.multiple : 1
                        }
                        total += this.orderList.totalMoney * multiple
                        list.push({
                            active: true,
                            index: index + 1,
                            issue: issue[index],
                            multiple: multiple,
                            money: this.orderList.totalMoney * multiple,
                            totalNowMoney: total //累计金额
                        })
                    }
                    this.list = [...list]
                }
                if (this.zhuihao == 1) {
                    //随机拿数组里面的方法id
                    let methodid = this.$store.state.orderList[0].methodid,
                        //判定是否为同一种玩法
                        ifSame = this.$store.state.orderList.every(
                            item => item.methodid == methodid
                        )
                    if (ifSame) {
                        //如果是同一种玩法，在判断是否有利润空间
                        let itemMoney = this.orderList.totalMoney,
                            totalBonues = 0
                        this.$store.state.orderList.forEach(item => {
                            totalBonues += this.$store.state.bonues * item.times
                        })
                        if (totalBonues > itemMoney) {
                            this.handleProfitMargin(issue, leg, multiple, 0, [])
                        } else {
                            this.$Message.error(
                                '您设置的参数无法达到盈利，请重新设置'
                            )
                            this.zhuihao = '2'
                        }
                    } else {
                        this.$Message.error(
                            '利润率追号不支持混投,请确保您的投注都为同一玩法类型,且元角模式一致。'
                        )
                        this.zhuihao = '2'
                    }
                }
            })
        },
        //倍数变动-money 从新计算
        handleMoney(item, index) {
            let money = item.multiple * this.orderList.totalMoney //修改金额
            this.item.this.$set(item, 'money', money)
        },
        //处理利润路追号
        handleProfitMargin(issue, leg, multiple, index, list) {
            //单笔金额
            let itemMoney = this.orderList.totalMoney,
                //利润率
                lt_trace_margin = this.lt_trace_margin,
                //累计总金额
                totalNowMoney = list.length
                    ? list[index - 1].totalNowMoney
                    : itemMoney,
                times = 0
            this.$store.state.orderList.forEach(item => {
                times += item.times
            })
            let //单笔奖金
                bonues = this.$store.state.bonues * times,
                //单笔利润
                profit = (bonues - itemMoney).toFixed(2)
            //需要获得的钱
            if (leg > 0) {
                //计算倍率
                if (index == 0) {
                    //单笔利润率
                    let singleBonues = (bonues - itemMoney) / itemMoney
                    while (singleBonues <= lt_trace_margin / 100) {
                        multiple++
                        bonues += bonues
                        itemMoney += itemMoney
                        singleBonues = (
                            (bonues - itemMoney) /
                            itemMoney
                        ).toFixed(2)
                    }
                } else {
                    multiple = Math.ceil(
                        ((lt_trace_margin / 100) * totalNowMoney +
                            totalNowMoney) /
                            (bonues -
                                itemMoney -
                                (lt_trace_margin / 100) * itemMoney)
                    )
                }
                let itemTotalNowMoney = index
                        ? itemMoney * multiple + list[index - 1].totalNowMoney
                        : itemMoney * multiple,
                    itemProfit = index
                        ? bonues * multiple -
                          (itemMoney * multiple + list[index - 1].totalNowMoney)
                        : bonues * multiple - itemMoney * multiple
                list[index] = {
                    active: true,
                    index: index + 1,
                    issue: issue[index],
                    multiple: multiple,
                    bonues: (bonues * multiple).toFixed(2),
                    money: itemMoney * multiple,
                    totalNowMoney: itemTotalNowMoney,
                    profit: itemProfit.toFixed(2),
                    Profitability: `${(
                        (itemProfit / itemTotalNowMoney) *
                        100
                    ).toFixed(2)}%`
                }
                leg--
                index++
                this.handleProfitMargin(issue, leg, multiple, index, list)
            } else {
                this.list = list
            }
        }
    },
    components: {
        RadioGroup,
        Radio,
        Select,
        Option,
        InputNumber,
        Checkbox
    }
}
</script>

<style lang="stylus" scoped>
.trace
    clear both
    background url('../../assets/images/ssc-repeat_001.jpg')
    .content
        overflow hidden
        padding 10px 0
        background #505050
        translateZ(0)
        position relative
        z-index 1
        >span
            float left
            color #fff
            line-height 28px
            margin 0 10px
            font-size 12px
            label
                font-size 12px
    .listContent
        color #fff
        display flex
        li
            flex 1
            line-height 40px
            border-top 1px solid #464646
            border-bottom 1px solid #1a1a1a
            text-align center
            display flex
            div
                flex 1
    .listTitle
        display flex
        text-align center
        line-height 30px
        color #fff
        li
            flex 1
</style>

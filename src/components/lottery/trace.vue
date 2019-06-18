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
        <ul class="listContent">
            <li v-for="(item,index) of list" :key="index">
                <Checkbox @on-change="test(index)" v-model="item.active"></Checkbox>
                <span style="margin:0 50px">{{item.index}}</span>
                <span style="margin:0 50px;margin-right:100px">{{item.issue}}</span>
                <InputNumber
                    @on-change="handleMoney(item)"
                    size="small"
                    v-model="item.multiple"
                    :style="{width:'80px'}"
                    :min="1"
                ></InputNumber>
                <span style="margin-left:10px">倍</span>
                <span style="margin:0 100px">{{item.money}}元</span>
                <span>{{item.totalNowMoney}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { RadioGroup, Radio, Select, Option, InputNumber, Checkbox } from 'iview'
import { EventBus } from '@/api/eventBus.js'
export default {
    name: 'trace',
    props: ['orderList'],
    data() {
        return {
            zhuihao: '1', //1：利潤率追號；2：同倍追號；3：翻倍追號；,
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
        EventBus.$on('updateIssue', () => {
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
            let issue = this.$store.state.issue.split('-'), //当前期数
                leg = this.qissueno, //期数
                multiple = this.multiple, //倍数
                list = [] //列表存放
            if (typevalue && value == 3) {
                this.multiple = 2
            }
            for (let index = 0; index < leg; index++) {
                if (this.zhuihao == 3) {
                    //翻倍追号
                    multiple = multiple * index ? multiple * this.multiple : 1
                }
                list.push({
                    active: true,
                    index: index + 1,
                    issue: issue[0] + '-' + (issue[1] * 1 + index),
                    multiple: multiple,
                    money: this.orderList.totalMoney * multiple,
                    totalNowMoney:
                        this.orderList.totalMoney * multiple * (index + 1)
                })
            }
            this.list = [...list]
        },
        //倍数变动-money 从新计算
        handleMoney(item) {
            let money = item.multiple * this.orderList.totalMoney
            this.$set(item, 'money', money)
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
        li
            padding 10px
            padding-left 40px
            border-top 1px solid #464646
            border-bottom 1px solid #1a1a1a
            span
                display inline-block
                width 80px
                text-align center
</style>

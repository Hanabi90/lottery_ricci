<template>
    <div class="trace">
        <div class="content">
            <span>
                <span style="margin-right:10px">追号</span>
                <RadioGroup style="margin-top:-4px" v-model="zhuihao" size="small">
                    <Radio label="1">利润率追号</Radio>
                    <Radio label="2">同倍追号</Radio>
                    <Radio label="3">翻倍追号</Radio>
                </RadioGroup>
            </span>
            <span>
                <span style="margin-right:10px">追号期数</span>
                <Select v-model="qissueno" style="width:70px" :transfer="true" size="small">
                    <Option
                        v-for="item in qissuenoList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </span>
            <span>
                <span style="margin-right:10px">起始倍数</span>
                <InputNumber :max="10" :min="1" v-model="multiple" size="small" style="width:50px"></InputNumber>
            </span>
            <span>
                <i>追号总金额</i>
                <i>0</i>
                <i>元</i>
                <i style="margin-left:10px">总期数</i>
                <i>0</i>
                <i>期</i>
            </span>
            <span>
                <Button @click="getissuesList" type="primary">生成号码</Button>
            </span>
        </div>
        <ul class="listContent">
            <li v-for="(item,index) of handleList" :key="index">
                <Checkbox v-model="item.active"></Checkbox>
                <span style="margin:0 50px">{{item.index}}</span>
                <span style="margin:0 50px;margin-right:100px">{{item.issue}}</span>
                <InputNumber size="small" :style="{width:'80px'}" :min="1"></InputNumber>
                <span style="margin-left:10px">倍</span>
                <span style="margin:0 100px">{{item.money}}</span>
            </li>
        </ul>
    </div>
</template>

<script>
import { getcreateissues } from '@/api/index'
import {
    RadioGroup,
    Radio,
    Select,
    Option,
    InputNumber,
    Button,
    Checkbox
} from 'iview'
export default {
    name: 'trace',
    data() {
        return {
            zhuihao: '1', //1：利潤率追號；2：同倍追號；3：翻倍追號；,
            qissueno: 0, //期号
            multiple: 1, //倍数
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
            ]
        }
    },
    computed: {
        handleList() {
            let issue = this.$store.state.issue.split('-'), //当前期数
                leg = this.qissueno, //期数
                multiple = this.multiple, //倍数
                list = [] //列表存放
            for (let index = 0; index < leg; index++) {
                list.push({
                    active: true,
                    index: index + 1,
                    issue: issue[0] + '-' + (issue[1] * 1 + index),
                    multiple,
                    money: 10
                })
            }
            return list
        }
    },
    methods: {
        getissuesList() {
            let lotteryid = sessionStorage.getItem('lotteryId')
            getcreateissues({ lotteryid }).then(res => {})
        }
    },
    components: {
        RadioGroup,
        Radio,
        Select,
        Option,
        InputNumber,
        Button,
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

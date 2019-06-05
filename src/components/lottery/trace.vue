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
                <Button type="primary">生成号码</Button>
            </span>
        </div>
    </div>
</template>

<script>
import { RadioGroup, Radio, Select, Option, InputNumber, Button } from 'iview'
export default {
    name: 'trace',
    data() {
        return {
            zhuihao: '1', //1：利潤率追號；2：同倍追號；3：翻倍追號；,
            qissueno: '',
            multiple: 1, //倍数
            qissuenoList: [
                {
                    value: '5',
                    label: '5期'
                },
                {
                    value: '10',
                    label: '10期'
                },
                {
                    value: '15',
                    label: '15期'
                },
                {
                    value: '20',
                    label: '20期'
                },
                {
                    value: '25',
                    label: '25期'
                },
                {
                    value: 'all',
                    label: '全部'
                }
            ]
        }
    },
    components: {
        RadioGroup,
        Radio,
        Select,
        Option,
        InputNumber,
        Button
    }
}
</script>

<style lang="stylus" scoped>
.trace
    clear both
    background url('../../assets/images/ssc-repeat_001.jpg')
    margin-top 10px
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
</style>

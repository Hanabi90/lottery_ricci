<template>
    <div class="lotteryGroup">
        <ul class="nav">
            <li
                v-for="(item,value) of methodCrowd"
                :key="value"
                :class="value==methodCrowdActive?'active':''"
                @click="getMethodId(item,value)"
            >{{item.crowdname}}</li>
            <li class="special_play">
                <i></i>
                <span>特殊玩法</span>
            </li>
        </ul>
        <ul class="navTwo">
            <li v-for="(item,value) of getmethod" :key="value">
                <i>{{item.menuName}}</i>
                <span
                    v-for="(list,index) of item.data"
                    :key="index+'a'"
                    :class="index==0&&value==0?'active':''"
                >{{list.title}}</span>
            </li>
            <li class="bonusGroup">
                <span>单注奖金</span>
                <Select v-model="bonus" style="width:130px" transfer>
                    <Option
                        v-for="item in bonusList"
                        :value="item.value"
                        :key="item.value"
                    >{{ item.label }}</Option>
                </Select>
            </li>
        </ul>
        <Lotterynumber/>
        <Order/>
    </div>
</template>

<script>
import { Select, Option } from 'iview'
import Lotterynumber from './lotteryNumber'
import Order from '@/components/lottery/order.vue'
import { MethodCrowd, getmethod } from '@/api/index.js'
export default {
    name: 'lotteryGroup',
    data() {
        return {
            methodCrowd: [], //大组
            getmethod: [], //二级组
            methodCrowdActive: 0,
            activeNow: {
                navOne: 0,
                navTwo: {
                    col: 0,
                    index: 0
                }
            },
            bonusList: [
                {
                    value: 'bonus1',
                    label: '奖金 18.00-5.0%'
                },
                {
                    value: 'bonus2',
                    label: '奖金 19.00-0.0%'
                }
            ],
            bonus: 'bonus1'
        }
    },
    mounted() {
        MethodCrowd(this.$store.state.lotteryId).then(res => {
            this.methodCrowd = res.data
            getmethod(
                `${this.$store.state.lotteryId}/${res.data[0].crowdid}`
            ).then(res => {
                this.getmethod = res.data
            })
        })
        this.$router.afterEach(() => {
            MethodCrowd(this.$store.state.lotteryId).then(res => {
                this.methodCrowd = res.data
                getmethod(
                    `${this.$store.state.lotteryId}/${res.data[0].crowdid}`
                ).then(res => {
                    this.getmethod = res.data
                })
            })
        })
    },
    methods: {
        getMethodId(item, value) {
            getmethod(`${this.$store.state.lotteryId}/${item.crowdid}`).then(
                res => {
                    this.methodCrowdActive = value
                    this.getmethod = res.data
                }
            )
        }
    },
    components: {
        Select,
        Option,
        Lotterynumber,
        Order
    }
}
</script>
<style lang="stylus" scoped>
.lotteryGroup
    color #fff
    cursor pointer
    .nav
        overflow hidden
        background #505050
        display flex
        li
            height 44px
            text-align center
            border-right 1px solid #5a5a5a
            border-left 1px solid #3e3d3d
            line-height 44px
            flex 1
            &.special_play
                i
                    display inline-block
                    background url('../../assets/images/icon_play.png') no-repeat
                    margin-bottom -8px
                    width 18px
                    height 18px
            &.active
                background #ff8f00
                border-top 1px solid #ffe0b8
    .navTwo
        padding-top 20px
        font-size 12px
        position relative
        padding-right 190px
        background #383838
        overflow hidden
        li
            margin-bottom 10px
            margin-left 10px
            span, i
                text-align center
                min-width 66px
                padding 5px 4px
                display inline-block
                border 1px solid #383838
            i
                color #a78c6a
            span.active
                color #ffa700
                border 1px solid #ffa700
                border-radius 3px
            &.bonusGroup
                position absolute
                right 20px
                top 30px
</style>

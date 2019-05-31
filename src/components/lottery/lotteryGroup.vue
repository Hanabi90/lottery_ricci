<template>
    <div class="lotteryGroup">
        <ul class="nav">
            <li
                v-for="(item,value) of infoList"
                :key="value"
                :class="value==methodCrowdActive?'active':''"
                @click="getMethodId(item,value)"
            >{{item.title}}</li>
        </ul>
        <ul class="navTwo">
            <li v-for="(item,value) of getmethod" :key="value">
                <i>{{item.gtitle}}</i>
                <span
                    v-for="(list,index) of item.label"
                    :key="index+'a'"
                    :class="index==itemActive.index&&value==itemActive.value?'active':''"
                    @click="getItem(item.gtitle,list,value,index)"
                >{{list.name}}</span>
            </li>
            <li class="bonusGroup">
                <div>
                    <span>单注奖金:</span>
                    <InputNumber
                        size="small"
                        :parser="value => value"
                        :step="2"
                        :max="prizeGroup"
                        v-model="nowPrizeGroup"
                    ></InputNumber>
                </div>
                <div>
                    <span>单注返点:</span>
                    <span>{{rebate}}</span>
                </div>
                <div>
                    <span>单注返点:</span>
                    <RadioGroup v-model="iWalletType">
                        <Radio label="1">现金</Radio>
                        <Radio label="2">信用</Radio>
                    </RadioGroup>
                </div>
            </li>
        </ul>
        <Lotterynumber ref="lotterynumber" :method-list="methodList"/>
        <Order
            :methodid="methodid"
            :i-wallet-type="iWalletType"
            :method-list="methodList"
            :rebate="rebate"
            :modes="methodList.modes"
            :now-prize-group="nowPrizeGroup"
            :lotterynumber="this.$refs.lotterynumber"
            :prize="this.prize"
        />
    </div>
</template>

<script>
import { InputNumber, RadioGroup, Radio } from 'iview'
import Lotterynumber from './lotteryNumber'
import Order from '@/components/lottery/order.vue'
import { MethodCrowd, getmethod, getLotteryInfo } from '@/api/index.js'
export default {
    name: 'lotteryGroup',
    data() {
        return {
            infoList: '',
            getmethod: [], //二级组
            methodCrowdActive: 0,
            methodList: {}, //最终玩法
            itemActive: {
                value: 0,
                index: 0
            },
            activeNow: {
                navOne: 0,
                navTwo: {
                    col: 0,
                    index: 0
                }
            },
            prizeGroup: 0, //返点
            nowPrizeGroup: 1984, //当前选择返点
            iWalletType: '1', //1-现金 2-信用
            methodid: '', //具体玩法id
            bonus: 'bonus1',
            prize: 0 //彩票奖金
        }
    },
    computed: {
        rebate() {
            return (this.prizeGroup - this.nowPrizeGroup) / 20 + '%'
        }
    },
    mounted() {
        getLotteryInfo({ memnuid: this.$store.state.menuId }).then(res => {
            this.infoList = res.data
            this.getmethod = res.data[0].label
            this.methodList = {
                ...res.data[0].label[0].label[0],
                title: res.data[0].label[0].gtitle
            }
            this.prize = res.data[0].label[0].label[0].prize_level_special[0]
            this.nowPrizeGroup = res.data[0].label[0].label[0].nowPrizeGroup
            this.prizeGroup = res.data[0].label[0].label[0].nowPrizeGroup
            this.methodid = res.data[0].label[0].label[0].methodid
        })
    },
    methods: {
        getMethodId(item, value) {
            this.methodCrowdActive = value
            this.getmethod = item.label
            this.methodList = {
                ...item.label[0].label[0],
                title: item.label[0].gtitle
            }
            this.itemActive = { value: 0, index: 0 }
            this.$nextTick(() => {
                this.$refs.lotterynumber.reset()
            })
        },
        //获取最终玩法
        getItem(title, item, value, index) {
            this.$store.dispatch('handleLotteryNumber', '')
            //重置选号区域
            this.$nextTick(() => {
                this.$refs.lotterynumber.reset()
            })
            //item最终选项，value-行 index-列
            this.methodid = item.methodid
            this.itemActive = { value, index }
            this.methodList = { ...item, title }
            this.prize = item.prize_level_special[0]
            this.nowPrizeGroup = item.nowPrizeGroup
            this.prizeGroup = item.nowPrizeGroup
        }
    },
    components: {
        Lotterynumber,
        Order,
        InputNumber,
        RadioGroup,
        Radio
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
        height 140px
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
                top 16px
</style>

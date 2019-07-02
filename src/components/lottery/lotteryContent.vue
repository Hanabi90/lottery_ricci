<template>
    <div class="lottery">
        <Sidebar v-if="false"/>
        <div class="container">
            <div>
                <div class="lottery_show_container">
                    <LotteryShow/>
                </div>
                <div class="tools_container">
                    <Tool/>
                </div>
                <div class="lottery_show_container">
                    <LotteryGroup ref="lotteryGroup"/>
                </div>
                <div class="tools_container">
                    <PrizeList/>
                    <Bulletin/>
                </div>
            </div>
            <LotteryOrderList ref="orderList"/>
            <Trace
                ref="traceList"
                :order-list="this.$refs.orderList"
                v-if="this.$store.state.trace"
            />
            <OrderHistory/>
        </div>
    </div>
</template>

<script>
import Sidebar from '@/components/lottery/sidebar.vue'
import LotteryShow from '@/components/lottery/lotteryShow.vue'
import Tool from '@/components/lottery/tool.vue'
import LotteryGroup from '@/components/lottery/lotteryGroup.vue'
import PrizeList from '@/components/lottery/prizeList.vue'
import Bulletin from '@/components/lottery/bulletin.vue'
import LotteryOrderList from '@/components/lottery/lotteryOrderList.vue'
import OrderHistory from '@/components/lottery/orderHistory.vue'
import Trace from '@/components/lottery/trace.vue'
export default {
    name: 'lottery',
    data() {
        return {}
    },
    components: {
        Sidebar,
        LotteryShow,
        Tool,
        LotteryGroup,
        PrizeList,
        Bulletin,
        LotteryOrderList,
        OrderHistory,
        Trace
    }
}
</script>

<style lang="stylus" scoped>
.lottery
    overflow hidden
    padding-bottom 40px
    background url('../../assets/images/main_bg_001.png')
.container
    width 1200px
    margin auto
    margin-top 20px
    >div:first-child
        height 92px
.lottery_show_container
    width 912px
    float left
    margin-right 10px
    margin-bottom 16px
.tools_container
    width 276px
    float left
    margin-bottom 16px
</style>

<template>
    <div class="mask" v-if="this.$store.state.userCenter">
        <div class="userCenter">
            <div class="title">
                <Icon @click="close" :class="'close'" size="20" type="md-close-circle"/>
            </div>
            <Tabs :style="{'padding':'0 20px 20px'}" v-model="active">
                <TabPane
                    v-for="item of tableList"
                    :key="item.name"
                    :label="item.name"
                    :name="item.name"
                >
                    <component v-if="active==item.name" :is="item.content"/>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>

<script>
import Bank from './userCenter/bank'
import Notice from './userCenter/notice'
import Loginpassword from './userCenter/loginPassword'
import Information from './userCenter/information'
import Bindquestion from './userCenter/bindquestion'
import GameHistory from './userCenter/gameHistory'
import BettingRecord from './userCenter/bettingRecord'
import { Tabs, TabPane, Icon } from 'iview'
export default {
    name: 'userCenter',
    data() {
        return {
            active: '投注记录',
            tableList: [
                {
                    name: '投注记录',
                    content: 'BettingRecord'
                },
                {
                    name: '游戏帐变记录',
                    content: 'GameHistory'
                },
                {
                    name: '银行卡',
                    content: 'Bank'
                },
                {
                    name: '修改登录密码',
                    content: 'Loginpassword'
                },
                {
                    name: '密保',
                    content: 'Bindquestion'
                },
                {
                    name: '消息',
                    content: 'Information'
                },
                {
                    name: '公告',
                    content: 'Notice'
                }
            ]
        }
    },
    methods: {
        close() {
            this.$store.dispatch('handleUserCenter', false)
        }
    },
    components: {
        Tabs,
        TabPane,
        Bank,
        Notice,
        Icon,
        Loginpassword,
        Bindquestion,
        GameHistory,
        BettingRecord,
        Information
    }
}
</script>

<style lang="stylus" scoped>
.mask
    background rgba(0, 0, 0, 0.6)
    position fixed
    z-index 100
    top 0
    left 0
    width 100%
    height 100%
    justify-content center
    overflow hidden
    overscroll-behavior none
    .userCenter
        width 782px
        height 676px
        margin auto
        margin-top 160px
        overflow hidden
        border-radius 10px
        background #fff
        position relative
        overscroll-behavior none
        .title
            height 20px
            .close
                position absolute
                right 0
                top 0
</style>

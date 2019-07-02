<template>
    <div class="userCenterBox" v-if="this.$store.state.userCenter">
        <div class="userCenter">
            <div class="title">
                <Icon @click="close" :class="'close'" size="20" type="md-close-circle"/>
            </div>
            <Tabs :style="{'padding':'0 20px 20px'}" v-model="active">
                <TabPane
                    v-for="item of tableList"
                    :key="item.name"
                    :label="item.name=='消息'?Information:item.name"
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
import ChangePassword from './userCenter/changePassword'
import Information from './userCenter/information'
import Bindquestion from './userCenter/bindquestion'
import GameHistory from './userCenter/gameHistory'
import TraceHistory from './userCenter/traceHistory'
import BettingRecord from './userCenter/bettingRecord'
import NoGameHistory from './userCenter/noGameHistory'
import AgentManagement from './userCenter/agentManagement'
import { Tabs, TabPane, Icon, Badge } from 'iview'
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
                    name: '游戏追号记录',
                    content: 'TraceHistory'
                },
                {
                    name: '游戏帐变记录',
                    content: 'GameHistory'
                },
                {
                    name: '非游戏帐变记录',
                    content: 'NoGameHistory'
                },

                {
                    name: '银行卡',
                    content: 'Bank'
                },
                {
                    name: '修改密码',
                    content: 'ChangePassword'
                },
                {
                    name: '代理管理',
                    content: 'AgentManagement'
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
            ],
            Information: h => {
                let count = this.$store.state.unReadAmount
                if (count != 0) {
                    return h('div', [
                        h('span', '消息'),
                        h(Badge, {
                            props: {
                                count: Number(count)
                            }
                        })
                    ])
                } else {
                    return h('div', [h('span', '消息')])
                }
            }
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
        ChangePassword,
        Bindquestion,
        GameHistory,
        BettingRecord,
        Information,
        TraceHistory,
        NoGameHistory,
        Badge,
        AgentManagement
    }
}
</script>

<style lang="stylus" scoped>
.userCenterBox
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
        width 1200px
        height 676px
        margin auto
        margin-top 80px
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

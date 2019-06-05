<template>
    <div class="nav">
        <div class="nav_top fixed_layout">
            <ul class="flag">
                <li>
                    <i></i>
                    <span>中国-简体中文</span>
                </li>
            </ul>
            <ul class="line_help">
                <li class="nowDate">{{nowDate}}</li>
                <li>切换手机显示</li>
                <li>牌照显示</li>
                <li>线路中心</li>
            </ul>
            <ul class="nav_top_right">
                <li v-if="this.$store.state.loginCode==0" class="login_content">
                    <button @click="open('login')">登录</button>
                    <button @click="open('registered')">注册</button>
                    <Login ref="login"/>
                    <Registered ref="registered"/>
                </li>
                <li v-else-if="this.$store.state.loginCode==1" class="money_content">
                    <p>
                        <span>用户名:</span>
                        <span>{{this.$store.state.nickname}}</span>
                    </p>
                    <p>
                        <span>现金金额:</span>
                        <span>{{this.$store.state.money.availablebalance}}</span>
                        <span>信誉金额:</span>
                        <span>{{this.$store.state.money.creditavailable}}</span>
                    </p>
                    <button class="refresh" @click="refresh">刷新</button>
                    <button @click="loginOut">退出</button>
                </li>
                <li class="border_style">
                    <i class="phone"></i>
                    <span>手机版</span>
                </li>
                <li class="border_style">
                    <i class="live_chat"></i>
                    <span>线上客服</span>
                </li>
                <li class="border_style">
                    <i class="free_call"></i>
                    <span>客服回拨</span>
                </li>
            </ul>
        </div>
        <div style="border-top: 1px solid #424141">
            <div class="nav_bottom fixed_layout">
                <div class="logo_left">
                    <img id="logo" src="../assets/images/page_logo.png">
                    <img id="vwin-logo" src="../assets/images/vwin-logo-acmiland-cn.png">
                </div>
                <ul class="nav_list">
                    <router-link tag="li" to="/">首页</router-link>
                    <router-link tag="li" to="/test">体育</router-link>
                    <li>沙巴体育</li>
                    <router-link
                        ref="routerLink"
                        :to="`/lottery?menuId=${this.$store.state.menuId}`"
                        tag="li"
                        data-lottery="ture"
                        event="none"
                    >
                        彩票
                        <Icon type="ios-arrow-down"></Icon>
                        <div class="lotteryList">
                            <ul v-for="(item,keys) of this.$store.state.lotteryMenue" :key="keys">
                                <h5>{{item.title}}</h5>
                                <li v-for="(element,index) of item.lottery_data" :key="index">
                                    <span
                                        @click="jump(element.lotteryid,element.menuid)"
                                    >{{element.title}}</span>
                                </li>
                            </ul>
                        </div>
                    </router-link>
                    <li>电子游戏</li>
                    <li>棋牌</li>
                    <li>最新优惠</li>
                    <li class="btn-sign">
                        <button @click="openCenter">
                            <i></i>
                            <span>个人中心</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import Login from '../components/home/login'
import Registered from '../components/home/registered'
import { getbalance, loginOut, getMenu } from '@/api/index.js'
import { Icon } from 'iview'
export default {
    name: 'lobby_nav',
    data() {
        return {
            nowDate: '',
            spinShow: true,
            nickname: '',
            id: ''
        }
    },
    mounted() {
        this.getTime()
        if (sessionStorage.getItem('token')) {
            this.$store.dispatch('handleLogin', 1)
            this.$store.dispatch(
                'handleNickName',
                sessionStorage.getItem('nickname')
            )
            getbalance().then(res => {
                this.$store.dispatch('handleMoney', res.data)
            })
            getMenu().then(res => {
                this.$store.dispatch('handleLotteryMenue', { ...res.data })
            })
        }
        this.$router.onReady(() => {
            this.$store.dispatch('handleMenuId', this.$route.query.menuId)
        })
    },
    methods: {
        //个人中心
        openCenter() {
            let onOff = this.$store.state.userCenter
            this.$store.dispatch('handleUserCenter', !onOff)
        },
        //跳转
        jump(lotteryId, menuId) {
            this.$store.dispatch('handleMenuId', menuId)
            this.$router.push({ path: 'lottery', query: { menuId: menuId } })
            sessionStorage.setItem('lotteryId', lotteryId)
            this.$store.dispatch('handleHackReset', false)
            this.$nextTick(() => {
                this.$store.dispatch('handleHackReset', true)
                this.$store.dispatch('handleOrderList', { type: 'clear' })
            })
        },
        //刷新金额
        refresh() {
            getbalance().then(res => {
                this.spinShow = true
                this.$store
                    .dispatch('handleMoney', res.data)
                    .then(res => (this.spinShow = false))
            })
        },
        //退出登录
        loginOut() {
            loginOut().then(res => {
                if (res.code == 0) {
                    sessionStorage.clear()
                    this.$Message.success('退出成功')
                    this.$store.dispatch('handleReset')
                    this.$router.push('/')
                }
            })
        },
        //打开登录页面
        open(target) {
            for (const iterator in this.$refs) {
                this.$refs[iterator].onOff = false
            }
            this.$refs[target].onOff = true
        },
        //获取当前时间
        getTime() {
            let date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                day = date.getDate(),
                hours = date.getHours(),
                minutes = date.getMinutes(),
                seconds = date.getSeconds()
            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            if (hours < 10) {
                hours = '0' + hours
            }
            if (minutes < 10) {
                minutes = '0' + minutes
            }
            if (seconds < 10) {
                seconds = '0' + seconds
            }
            this.nowDate =
                year +
                '-' +
                month +
                '-' +
                day +
                ' ' +
                hours +
                ':' +
                minutes +
                ':' +
                seconds
            setTimeout(this.getTime, 1000)
        }
    },
    components: {
        Login,
        Registered,
        Icon
    }
}
</script>

<style lang="stylus" scoped>
.nav
    position fixed
    background mainColor
    cursor pointer
    line-height 40px
    top 0
    width 100%
    z-index 99
.nav_top
    width 1200px
    margin auto
    height 40px
.flag
    color defaultColor
    font-size 13px
    line-height 40px
    float left
    i
        background url('../assets/images/flag.png')
        display inline-block
        height 17px
        width 17px
        margin-bottom -4px
        margin-right 10px
        background-position -17px 0
.line_help
    float left
    color #fff
    display flex
    li
        flex 1
        white-space nowrap
        padding 0 7px
        font-size 12px
        border-right 1px solid #424141
        color defaultColor
.nav_top_right
    float right
    display flex
    li
        flex 1
        color #fff
        font-size 12px
        white-space nowrap
        span
            padding 0 6px
            color #f7e6b0
        i
            display inline-block
            height 23px
            width 14px
            margin-bottom -2px
            &.phone
                background url('../assets/images/icon-mobile.gif') no-repeat bottom right
            &.live_chat
                background url('../assets/images/icon-liveChat.gif') no-repeat bottom right
            &.free_call
                background url('../assets/images/icon-freeCall.png') no-repeat bottom right
    .money_content
        display flex
        p
            flex 1
            position relative
        button
            margin-top 6px
            &.refresh
                background #d49815
button
    background #d83f41
    border none
    color #fff
    border-radius 16px
    padding 0 20px
    margin 0 6px
    outline none
    height 26px
    line-height 26px
.border_style
    border-left 1px solid #424141
    padding-left 10px
.nav_bottom
    color #fff
    font-size 14px
    overflow hidden
    width 1200px
    margin auto
    line-height 80px
    .nav_list
        float right
        display flex
        &>li
            flex 1
            white-space nowrap
            padding 0 20px
            &:hover
                background #a92c2d
                color #fff
            &:last-child:hover
                background none
            &[data-lottery='ture']:hover
                div
                    display block
            &[data-lottery='ture']
                div
                    position absolute
                    background #000000bd
                    overflow hidden
                    line-height 26px
                    left 50%
                    display none
                    ul
                        float left
                        margin 10px
                        h5
                            font-size 14px
                            margin-bottom 10px
                        li
                            font-size 12px
                            color #e8e8e8
                            span
                                padding 6px 10px
                                border-radius 6px
                            &:hover
                                span
                                    background #a92c2d
                                    color #fff
.btn-sign
    button:hover
        i
            background url('../assets/images/ic-nav-gift-2.png') bottom no-repeat
            background-size 16px auto
        span
            color #ff0000
    button
        background #fff
        color #000
        padding 10px 14px
        height 36px
        line-height 0
        i
            display inline-block
            background url('../assets/images/ic-nav-gift.png') bottom no-repeat
            background-size 16px auto
            width 16px
            height 14px
            margin-right 4px
            margin-bottom -2px
.logo_left
    float left
    height 70px
    #logo
        width 140px
        height auto
        margin-top 6px
        margin-right 20px
    #vwin-logo
        width 182px
        height auto
.is-active
    background #a92c2d
.login_content
    position relative
</style>

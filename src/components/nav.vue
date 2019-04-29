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
                <li>
                    <button>登录</button>
                </li>
                <li>
                    <button>注册</button>
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
                    <li class="active">首页</li>
                    <li>体育</li>
                    <li>沙巴体育</li>
                    <li>彩票</li>
                    <li>电子游戏</li>
                    <li>棋牌</li>
                    <li>最新优惠</li>
                    <li class="btn-sign">
                        <button>
                            <i></i>
                            <span>签到</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'lobby_nav',
    data() {
        return {
            nowDate: ''
        }
    },
    methods: {
        getTime: function() {
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
    mounted() {
        this.getTime()
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
    overflow hidden
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
        padding 0 16px
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
            padding 0 10px
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
button
    background #d83f41
    border none
    color #fff
    border-radius 16px
    padding 4px 16px
    margin 0 6px
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
        li
            flex 1
            white-space nowrap
            padding 0 20px
            &:hover
                background #a92c2d
            &:last-child:hover
                background none
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
.active
    background #a92c2d
</style>

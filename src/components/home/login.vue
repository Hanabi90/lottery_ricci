<template>
    <div v-if="this.onOff" class="login">
        <div class="arrow"></div>
        <div class="container">
            <h5>登录您的账户</h5>
            <p>亚洲最好的博彩网站</p>
            <div class="form_list">
                <div class="list">
                    <label for="user"></label>
                    <input id="user" type="text" v-model="login.username" placeholder="用户名">
                </div>
                <div class="list">
                    <label for="password"></label>
                    <input id="password" v-model="login.loginpass" type="password" placeholder="密码">
                </div>
                <button class="submint_button" @click="handlelogin">立即登录</button>
                <div class="remanber">
                    <div @click="handleUser">
                        <i :class="{active:rememberUserName}"></i>
                        <span>记住用户名</span>
                    </div>
                    <div>
                        <i></i>
                        <span>免费注册</span>
                    </div>
                </div>
                <p class="discription">
                    <span>登录时有任何问题，请联系</span>
                    <a href="#">在线沟通协助</a>
                    <span>或</span>
                    <a href="#">联系我们</a>
                    <span>本网站采用Global Trust最先进的128/256 bit SSL服务器加密机制</span>
                </p>
            </div>
        </div>
        <div @click="close" class="close"></div>
    </div>
</template>

<script>
import { login, getbalance, getMenu } from '@/api/index.js'
export default {
    name: 'login',
    data() {
        return {
            onOff: false,
            login: {
                username: '',
                loginpass: ''
            },
            rememberUserName: false
        }
    },
    mounted() {
        if (localStorage.getItem('userName')) {
            this.rememberUserName = true
            this.$set(this.login, 'username', localStorage.getItem('userName'))
        }
    },
    methods: {
        close() {
            this.onOff = false
        },
        handleUser() {
            if (this.rememberUserName) {
                this.rememberUserName = false
                localStorage.removeItem('userName')
            } else {
                this.rememberUserName = true
                localStorage.setItem('userName', this.login.username)
            }
        },
        handlelogin() {
            if (this.rememberUserName && this.login.username) {
                localStorage.setItem('userName', this.login.username)
            }
            login(this.login).then(res => {
                sessionStorage.setItem('token', res.data.token)
                sessionStorage.setItem('nickname', res.data.nickname)
                this.onOff = false
                this.$store.dispatch('handleLogin', 1)
                this.$store.dispatch('handleNickName', res.data.nickname)
                this.$Message.info('登录成功')
                getbalance().then(res => {
                    this.$store.dispatch('handleMoney', res.data)
                })
                getMenu().then(res => {
                    this.$store.dispatch('handleLotteryMenue', {
                        ...res.data
                    })
                })
            })
        }
    }
}
</script>

<style lang="stylus" scoped>
.login
    width 378px
    position absolute
    right -89px
    top 45px
    line-height normal
    animation fadeInDown ease 1s
    .arrow
        width 0
        height 0
        border-style solid
        border-width 0 10px 10px 5px
        border-color transparent transparent #fff transparent
        margin auto
    .container
        border-radius 10px
        background #fff
        padding 10px
        h5
            text-align center
            font-size 20px
            color #000
        p
            text-align center
            font-size 13px
            color #ff0000
    .form_list
        overflow hidden
        margin-top 20px
        .list
            box-shadow inset -1px 1px 5px rgba(0, 0, 0, 0.35)
            margin-bottom 15px
            border-radius 10px
            overflow hidden
            &:first-child
                label
                    background url('../../assets/images/icon-user.png')
            &:nth-child(2)
                label
                    background url('../../assets/images/icon-lock.png')
            label
                display inline-block
                width 40px
                height 45px
                vertical-align top
            input
                display inline-block
                height 42px
                width calc(100% - 40px)
                border none
                vertical-align top
                background none
                outline none
                text-indent 20px
    .submint_button
        background linear-gradient(#c74546, #a92c2d)
        border none
        width 100%
        color #fff
        line-height 36px
        border-radius 10px
        display block
        outline none
        &:hover
            background linear-gradient(#a41c1d, #7c1212)
    .remanber
        color #000
        margin-top 10px
        overflow hidden
        &>div:first-child
            float left
            i
                display inline-block
                width 15px
                height 15px
                border 1px solid #dcdcdc
                border-radius 3px
                vertical-align bottom
                margin-right 5px
            i.active
                background #ff632c
                border-color #ff632c
                position relative
                &::after
                    content '√'
                    position absolute
                    color #fff
                    left 2px
                    top 2px
        &>div:last-child
            float right
        .arrow_right
            width 0
            height 0
            border-style solid
            border-width 7px 0 7px 6px
            border-color transparent transparent transparent #000000
            display inline-block
            vertical-align bottom
            margin-right 5px
    .discription
        margin-top 10px
        white-space normal
        font-size 12px
        line-height 26px
        span
            color #999
    .close
        width 24px
        height 24px
        position absolute
        right 20px
        top 24px
        background url('../../assets/images/btn-close.png') no-repeat 0 0
        background-size 24px
        filter grayscale(1) opacity(0.5)
        transition all 0.5s line
        &:hover
            filter grayscale(0) opacity(1)
@keyframes fadeInDown
    from
        transform translate3d(0, -100%, 0)
    to
        transform translate3d(0, 0, 0)
</style>




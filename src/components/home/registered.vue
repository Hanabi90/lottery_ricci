<template>
    <div v-if="this.onOff" class="registered">
        <div class="arrow"></div>
        <div class="container">
            <h5>注册您的账户</h5>
            <div class="form_list">
                <div class="list">
                    <label for="user"></label>
                    <input id="user" type="text" placeholder="用户名">
                </div>
                <div class="list">
                    <label for="password"></label>
                    <input id="password" type="password" placeholder="密码">
                </div>
                <div class="list">
                    <label for="repeatPassword"></label>
                    <input id="repeatPassword" type="password" placeholder="确认密码">
                </div>
                <div class="list">
                    <label for="contact"></label>
                    <input id="contact" type="text" placeholder="联系方式">
                </div>
                <div class="list">
                    <label for="proxy_code"></label>
                    <input id="proxy_code" type="password" placeholder="代码代码">
                </div>
                <button class="submint_button">立即注册</button>
                <div class="remanber">
                    <div>
                        <i></i>
                        <span>我确认我已年满18岁，并已阅读和接受本网站的</span>
                    </div>
                </div>
            </div>
        </div>
        <div @click="close" class="close"></div>
    </div>
</template>

<script>
export default {
    name: 'registered',
    data() {
        return {
            onOff: false
        }
    },
    methods: {
        close() {
            this.onOff = false
        }
    }
}
</script>

<style lang="stylus" scoped>
.registered
    width 378px
    position absolute
    right -157px
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
            &:nth-child(3)
                label
                    background url('../../assets/images/icon-openLock.png')
            &:nth-child(4)
                label
                    background url('../../assets/images/icon-mobile.png')
            &:nth-child(5)
                label
                    background url('../../assets/images/icon-agents.png')
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
        i
            display inline-block
            width 15px
            height 15px
            border 1px solid #dcdcdc
            border-radius 3px
            vertical-align bottom
            margin-right 5px
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




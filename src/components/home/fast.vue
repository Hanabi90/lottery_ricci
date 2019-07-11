<template>
    <div class="login">
        <div class="arrow"></div>
        <div class="container">
            <p>你好&nbsp;{{this.$store.state.nickname}}</p>
            <Button type="primary">立即充值</Button>
        </div>
        <div @click="close" class="close"></div>
    </div>
</template>

<script>
import { login, getbalance, getMenu } from '@/api/index.js'
import { Button } from 'iview'
export default {
    name: 'fast',
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
    components: {
        Button
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




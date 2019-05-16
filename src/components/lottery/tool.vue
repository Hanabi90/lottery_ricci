<template>
    <div class="tool">
        <div class="userMoney">
            <span>余额</span>
            <span>888888</span>
            <span>元</span>
        </div>
        <ul>
            <li class="recharge">
                <i></i>
                <span>充值</span>
            </li>
            <li class="withdrawal">
                <i></i>
                <span>提款</span>
            </li>
            <li>
                <p>
                    <i></i>
                    <span>投注记录</span>
                </p>
                <p>
                    <i></i>
                    <span>玩法介绍</span>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'tool',
    mounted() {}
}
</script>

<style lang="stylus" scoped>
.tool
    height 92px
    box-shadow Boxshaow
    border-radius 16px
    background url('../../assets/images/ssc-repeat_001.jpg')
    color #fff
    border 5px solid #5a5a5a
    overflow hidden
    cursor pointer
    .userMoney
        margin-left 10px
        margin-top 10px
        margin-bottom 6px
        span
            font-size 14px
            &:nth-child(2)
                margin 0 5px
                color #ffbe00
    ul
        overflow hidden
        li
            float left
            margin-right 15px
            &.recharge, &.withdrawal
                font-size 14px
                background #ff8f00
                border-radius 3px
                overflow hidden
                padding 8px
                i, span
                    display block
                    float left
                    margin-right 5px
                span
                    line-height 22px
                i
                    width 22px
                    height 22px
                    background url('../../assets/images/tools.png') no-repeat
            &.recharge
                margin-left 10px
            &.withdrawal
                i
                    background-position 0 -47px
            &:last-child
                font-size 12px
                margin-right 0
                i
                    display inline-block
                    width 12px
                    height 15px
                    margin-right 5px
                    background url('../../assets/images/tools.png') no-repeat
                    vertical-align top
                p
                    &:first-child
                        margin-bottom 5px
                        i
                            background-position -34px 3px
                    &:last-child
                        i
                            background-position -34px -19px
</style>

<template>
    <div class="page_footer">
        <div class="container">
            <div class="list">
                <h5>牌照</h5>
                <div></div>
            </div>
            <div class="list">
                <h5>赞助</h5>
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <h5>存款</h5>
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <h5>合作伙伴</h5>
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <h5>博彩责任</h5>
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <div></div>
            </div>
            <div class="list">
                <h5>信息安全</h5>
                <div></div>
            </div>
            <div class="footer_border"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'page_footer'
}
</script>

<style lang="stylus" scoped>
.page_footer
    background #232526
    overflow hidden
.container
    width 1200px
    margin auto
    margin-top 20px
    overflow hidden
.list
    color #fff
    font-size 12px
    float left
    height 82px
    margin-right 56px
    margin-bottom 30px
    overflow hidden
    &:nth-child(1)
        div
            width 152px
            background url('../assets/images/GAMING.png') no-repeat 0 0
    &:nth-child(2)
        div
            width 152px
            background url('../assets/images/ACmilan_hover.png') no-repeat 0 0
    &:nth-child(3)
        div
            margin-top 20px
            width 152px
            background url('../assets/images/juventus_hover.png') no-repeat 0 0
    &:nth-child(4)
        div
            width 84px
            background url('../assets/images/visa_hover.png') no-repeat 0 0
    &:nth-child(5)
        div
            width 66px
            margin-top 20px
            background url('../assets/images/mastercard_hover.png') no-repeat 0 0
    &:nth-child(6)
        div
            width 127px
            margin-top 20px
            background url('../assets/images/unionPay_hover.png') no-repeat 0 0
    &:nth-child(7)
        margin-right 0
        div
            width 127px
            margin-top 20px
            background url('../assets/images/bitcoin_hover.png') no-repeat 0 0
    &:nth-child(8)
        margin-right 29px
        div
            width 127px
            margin-top 20px
            background url('../assets/images/oneworks_hover.png') no-repeat 0 0
    &:nth-child(9)
        margin-right 29px
        div
            width 92px
            margin-top 35px
            background url('../assets/images/AG_hover.png') no-repeat 0 0
    &:nth-child(10)
        margin-right 29px
        div
            width 127px
            margin-top 35px
            background url('../assets/images/playtech_hover.png') no-repeat 0 0
    &:nth-child(11)
        margin-right 29px
        div
            width 154px
            margin-top 35px
            background url('../assets/images/entwinetech_hover.png') no-repeat 0 0
    &:nth-child(12)
        margin-right 29px
        div
            width 166px
            margin-top 35px
            background url('../assets/images/jockeyclub_hover.png') no-repeat 0 0
    &:nth-child(13)
        margin-right 29px
        div
            width 49px
            margin-top 25px
            background url('../assets/images/GAMCARE_hover.png') no-repeat 0 0
    &:nth-child(14)
        margin-right 29px
        div
            width 44px
            margin-top 35px
            background url('../assets/images/18_hover.png') no-repeat 0 0
    &:nth-child(15)
        margin-right 29px
        div
            width 44px
            margin-top 35px
            background url('../assets/images/stop_hover.png') no-repeat 0 0
    &:nth-child(16)
        margin-right 0
        div
            width 160px
            margin-top 25px
            background url('../assets/images/iovation_hover.png') no-repeat 0 0
    div
        height 50px
        margin-top 10px
        background-size auto 50px
        filter grayscale(1) opacity(0.5)
        transition all 0.2s linear
        &:hover
            filter grayscale(0) opacity(1)
.footer_border
    border-bottom 1px solid #fff
    width 100%
    margin-bottom 10px
</style>

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
            <ul class="about">
                <li>
                    <h5>产品下载</h5>
                    <p>EA铂金馆PC端</p>
                    <p>AG翡翠厅PC端</p>
                    <p>AG翡翠厅APP</p>
                    <p>PT小游戏PC端</p>
                </li>
                <li>
                    <h5>关于我们</h5>
                    <p>关于Vwin</p>
                    <p>责任博彩</p>
                    <p>优惠规则与条款</p>
                    <p>隐私权政策</p>
                    <p>联系我们</p>
                </li>
                <li>
                    <h5>使用帮助</h5>
                    <p>存款流程</p>
                    <p>提款流程</p>
                    <p>常见问题</p>
                    <p>体育规则</p>
                    <p>沙巴体育规则</p>
                    <p>娱乐场规则</p>
                </li>
                <li style="margin-top:24px">
                    <p>电子游戏规则</p>
                    <p>快乐彩规则</p>
                    <p>世界乐透规则</p>
                    <p>时时彩规则</p>
                    <p>PK拾规则</p>
                </li>
                <li>
                    <h5>关注我们</h5>
                    <div class="weichat">
                        <div class="icon"></div>
                        <p>微信</p>
                    </div>
                    <div class>
                        <div class="icon"></div>
                        <p>微博</p>
                    </div>
                </li>
            </ul>
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
    clear both
    border-bottom 1px dashed #545556
    width 100%
    margin-bottom 40px
.about
    overflow hidden
    li
        cursor pointer
        float left
        margin-right 80px
        overflow hidden
        h5
            font-size 14px
            color #fff
            margin-bottom 10px
        p
            font-size 13px
            color #717171
            line-height 30px
</style>

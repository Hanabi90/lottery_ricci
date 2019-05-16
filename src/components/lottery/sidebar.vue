<template>
    <ul class="sidebar">
        <li>
            <div class="point"></div>
            <div class="container">
                <h5>极速</h5>
                <p>00:12</p>
            </div>
        </li>
        <li>
            <div class="point"></div>
            <div class="container">
                <h5>重庆时时彩</h5>
                <p>00:12</p>
            </div>
        </li>
        <li>
            <div class="point"></div>
            <div class="container">
                <h5>重庆时时彩</h5>
                <p>00:12</p>
            </div>
        </li>
        <li>
            <div class="point"></div>
            <div class="container">
                <h5>重庆时时彩</h5>
                <p>00:12</p>
            </div>
        </li>
    </ul>
</template>

<script>
export default {}
</script>

<style lang="stylus" scoped>
.sidebar
    position fixed
    top 131px
    left 100px
    z-index 1
    color #fff
    border-left 2px solid #fff
    font-size 12px
    padding-top 20px
    &>li
        margin-left -14px
        margin-bottom 10px
        &>div
            display inline-block
        h5
            color #ff0000
        .point
            width 22px
            height 22px
            background url('../../assets/images/gb-game-icons.png') 0 0 no-repeat
            margin-right 10px
            vertical-align top
        .container
            margin-top 6px
            p
                background #fff
                color #000
                border-radius 20px
                padding 0 20px
                line-height 20px
                margin-top 10px
</style>

<template>
    <div class="bullentin">
        <h5>平台公告</h5>
        <ul>
            <li class="list">
                <div class="time">【公告】</div>
                <p class="content">重庆时时彩更名及开奖规则调整通知</p>
            </li>
            <li class="list">
                <div class="time">【公告】</div>
                <p class="content">重庆时时彩更名及开奖规则调整通知</p>
            </li>
            <li class="list">
                <div class="time">【公告】</div>
                <p class="content">重庆时时彩更名及开奖规则调整通知</p>
            </li>
            <li class="list">
                <div class="time">【公告】</div>
                <p class="content">重庆时时彩更名及开奖规则调整通知</p>
            </li>
            <li class="list">
                <div class="time">【公告】</div>
                <p class="content">重庆时时彩更名及开奖规则调整通知</p>
            </li>
            <li class="list">
                <div class="time">【公告】</div>
                <p class="content">重庆时时彩更名及开奖规则调整通知</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'bullentin'
}
</script>

<style lang="stylus" scoped>
.bullentin
    background #383737
    padding-bottom 20px
    margin-top 14px
    h5
        background #505050
        color #fff
        text-indent 20px
        line-height 44px
        margin-bottom 10px
        font-size 14px
    .list
        overflow hidden
        margin 0 20px
        color #dcdcdc
        border-bottom 1px dashed #555
        font-size 14px
        line-height 30px
        padding-top 4px
        .time, .content
            float left
        .time
            margin-right 10px
        .content
            width 170px
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
</style>

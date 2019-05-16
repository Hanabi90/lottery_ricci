<template>
    <div class="marquee">
        <div class="box">
            <p>公告栏</p>
            <p>
                <marquee-text :duration="10">{{this.test_text}}</marquee-text>
            </p>
        </div>
    </div>
</template>

<script>
import MarqueeText from 'vue-marquee-text-component'
export default {
    data() {
        return {
            test_text:
                '<<沙巴体育维护公告》沙巴体育将于 4 月 24 日 13:30 至 16:00 进行1维护>>'
        }
    },
    components: {
        MarqueeText
    }
}
</script>

<style lang="stylus" scoped>
.marquee
    background #000
    color #fff
    font-size 12px
    line-height 30px
    .box
        width 1200px
        margin auto
        overflow hidden
        p:nth-child(1)
            float left
            padding-right 14px
        p:nth-child(2)
            overflow hidden
            float left
            width 1150px
</style>

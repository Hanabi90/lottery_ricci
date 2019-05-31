<template>
    <div class="marquee">
        <div class="box">
            <p>公告栏</p>
            <p>
                <marquee-text :duration="speed">{{textList}}</marquee-text>
            </p>
        </div>
    </div>
</template>

<script>
import MarqueeText from 'vue-marquee-text-component'
import { getnotice } from '@/api/index'
export default {
    data() {
        return {
            textList: '',
            speed: 40
        }
    },
    mounted() {
        getnotice().then(res => {
            this.speed *= res.data.affects
            res.data.results.forEach(item => {
                this.textList += item.subject + item.content
            })
        })
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
    cursor pointer
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

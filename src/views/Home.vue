<template>
    <div class="home">
        <swiper :options="swiperOption" ref="mySwiper">
            <!-- slides -->
            <swiper-slide>
                <img src="../assets/images/demo.jpg">
            </swiper-slide>
            <swiper-slide>
                <img src="../assets/images/demo_one.jpg">
            </swiper-slide>
            <swiper-slide>
                <img src="../assets/images/demo_two.jpg">
            </swiper-slide>
            <!-- Optional controls -->
            <div class="swiper-pagination" slot="pagination"></div>
            <div class="swiper-button-prev" slot="button-prev"></div>
            <div class="swiper-button-next" slot="button-next"></div>
            <div class="swiper-scrollbar" slot="scrollbar"></div>
        </swiper>
        <div class="marquee">
            <div class="box">
                <p>公告栏</p>
                <p>
                    <marquee-text :duration="10">{{this.test_text}}</marquee-text>
                </p>
            </div>
        </div>
        <List/>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import MarqueeText from 'vue-marquee-text-component'
import List from '../components/home/list'
export default {
    name: 'home',
    data() {
        return {
            test_text:
                '<<沙巴体育维护公告》沙巴体育将于 4 月 24 日 13:30 至 16:00 进行维护>>',
            swiperOption: {
                slidesPerView: 1,
                loop: true,
                autoplay: {
                    delay: 2500,
                    disableOnInteraction: false
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                }
            }
        }
    },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    components: {
        MarqueeText,
        List,
        swiper,
        swiperSlide
    }
}
</script>
<style lang="stylus" scoped>
.home
    .swiper-container
        width 100%
        min-width 1200px
        height 500px
        position relative
    .swiper-slide
        text-align center
        font-size 18px
        color #fff
        background gray
        /* Center slide text vertically */
        display -webkit-box
        display -ms-flexbox
        display -webkit-flex
        display flex
        -webkit-box-pack center
        -ms-flex-pack center
        -webkit-justify-content center
        justify-content center
        -webkit-box-align center
        -ms-flex-align center
        -webkit-align-items center
        align-items center
        img
            width 100%
            height 100%
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

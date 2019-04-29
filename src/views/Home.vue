<template>
    <div class="home">
        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <img src="../assets/images/demo.jpg">
                </div>
                <div class="swiper-slide">
                    <img src="../assets/images/demo_one.jpg" alt>
                </div>
                <div class="swiper-slide">
                    <img src="../assets/images/demo_two.jpg" alt>
                </div>
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination"></div>
            <!-- Add Arrows -->
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
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
import Swiper from 'swiper'
import MarqueeText from 'vue-marquee-text-component'
import List from '../components/home/list'
export default {
    name: 'home',
    data() {
        return {
            test_text:
                '<<沙巴体育维护公告》沙巴体育将于 4 月 24 日 13:30 至 16:00 进行维护>>'
        }
    },
    mounted() {
        let swiper = new Swiper('.swiper-container', {
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
        })
    },
    components: {
        MarqueeText,
        List
    }
}
</script>
<style lang="css">
@import '../styles/swiper.css';
</style>
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

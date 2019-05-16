<template>
    <swiper :options="swiperOption" ref="mySwiper">
        <!-- slides -->
        <swiper-slide>
            <img src="@/assets/images/demo.jpg">
        </swiper-slide>
        <swiper-slide>
            <img src="@/assets/images/demo_one.jpg">
        </swiper-slide>
        <swiper-slide>
            <img src="@/assets/images/demo_two.jpg">
        </swiper-slide>
        <!-- Optional controls -->
        <div class="swiper-pagination" slot="pagination"></div>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
    </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
    data() {
        return {
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
        swiper,
        swiperSlide
    }
}
</script>

<style lang="stylus" scoped>
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
</style>

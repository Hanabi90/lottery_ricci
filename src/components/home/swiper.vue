<template>
    <Carousel
        :autoplay="setting.autoplay"
        :autoplay-speed="setting.autoplaySpeed"
        dots="inside"
        :radius-dot="setting.radiusDot"
        :trigger="setting.trigger"
        :arrow="setting.arrow"
        :height="500"
        ref="carousel"
        v-model="value1"
        loop
    >
        <CarouselItem>
            <div class="demo-carousel">
                <img src="@/assets/images/demo.jpg" />
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
                <img src="@/assets/images/demo_one.jpg" />
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
                <img src="@/assets/images/demo_two.jpg" />
            </div>
        </CarouselItem>
    </Carousel>
</template>

<script>
import { Carousel, CarouselItem } from 'iview'
export default {
    data() {
        return {
            value1: 0,
            setting: {
                autoplay: true,
                autoplaySpeed: 2000,
                radiusDot: false,
                trigger: 'click',
                arrow: 'hover'
            }
        }
    },
    mounted() {
        this.$refs.carousel.handleResize()
    },
    components: {
        Carousel,
        CarouselItem
    }
}
</script>


<style lang="stylus" scoped>
.demo-carousel
    height 100%
    img
        display block
        height 100%
        width 100%
        background #000
</style>

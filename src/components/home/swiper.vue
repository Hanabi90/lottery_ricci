<template>
    <Carousel
        :autoplay="setting.autoplay"
        :autoplay-speed="setting.autoplaySpeed"
        :dots="setting.dots"
        :radius-dot="setting.radiusDot"
        :trigger="setting.trigger"
        :arrow="setting.arrow"
        :height="setting.height"
        v-model="value1"
        loop
    >
        <CarouselItem>
            <div class="demo-carousel">
                <img src="@/assets/images/demo.jpg">
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
                <img src="@/assets/images/demo_one.jpg">
            </div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">
                <img src="@/assets/images/demo_two.jpg">
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
                height: 'auto',
                autoplay: true,
                autoplaySpeed: 2000,
                dots: 'inside',
                radiusDot: false,
                trigger: 'click',
                arrow: 'hover'
            }
        }
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
</style>

<template>
    <div class="home">
        <Oswiper/>
        <Marquee/>
        <List/>
    </div>
</template>

<script>
import Marquee from '@/components/home/marquee.vue'
import Oswiper from '@/components/home/swiper'
import List from '../components/home/list'
export default {
    name: 'home',
    components: {
        List,
        Oswiper,
        Marquee
    }
}
</script>
<style lang="stylus" scoped></style>

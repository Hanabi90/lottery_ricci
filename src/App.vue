<template>
    <div id="app" :class="{'adminHidden':this.$store.state.userCenter}">
        <Nav />
        <router-view />
        <Footer />
        <BackTop>
            <div class="backtop">返回顶端</div>
        </BackTop>
        <UserCenter />
    </div>
</template>
<script>
import Nav from '@/components/nav.vue'
import Footer from '@/components/footer.vue'
import UserCenter from '@/components/userCenter.vue'
import { BackTop } from 'iview'
export default {
    components: {
        Nav,
        Footer,
        BackTop,
        UserCenter
    }
}
</script>
<style lang="stylus">
@import 'styles/rest.styl'

#app
    padding-top 121px
    &.adminHidden
        height 100vh
        overflow hidden
    .backtop
        background #ff0000
        color #fff
        padding 10px
        border-radius 10px
</style>

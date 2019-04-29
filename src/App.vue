<template>
    <div id="app">
        <Nav/>
        <router-view/>
        <Footer/>
    </div>
</template>
<script>
import Nav from '@/components/nav.vue'
import Footer from '@/components/footer.vue'
export default {
    created() {},
    components: {
        Nav,
        Footer
    }
}
</script>
<style lang="stylus">
@import 'styles/rest.styl'

#app
    padding-top 121px
</style>

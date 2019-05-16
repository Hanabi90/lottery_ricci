<template>
    <div class="test">123123</div>
</template>

<script>
import {
    getsecpass,
    updatenickname,
    getMenu,
    getbankinfo,
    MethodCrowd
} from '../api'
export default {
    mounted() {
        MethodCrowd().then(res => {
            console.log(res)
        })
    }
}
</script>

<style lang="stylus" scoped>
.test
    height 1000px
    background #000000
    color #fff
</style>

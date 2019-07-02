<template>
    <div class="lottery">
        <LotteryContent v-if="this.$store.state.hackReset"></LotteryContent>
    </div>
</template>

<script>
import LotteryContent from '@/components/lottery/lotteryContent.vue'

export default {
    name: 'lottery',
    components: {
        LotteryContent
    }
}
</script>
<style lang="stylus" scoped></style>

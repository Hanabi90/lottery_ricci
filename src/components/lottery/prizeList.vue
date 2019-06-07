<template>
    <div class="prizeList">
        <h5>近期开奖</h5>
        <ul>
            <li v-for="(item,value) of this.$store.state.openList" :key="value" class="list">
                <div class="time">{{item.issue}}</div>
                <div class="prizeNumber">
                    <span v-for="(element,index) of item.code.split('')" :key="index">{{element}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'prizeList',
    mounted() {}
}
</script>

<style lang="stylus" scoped>
.prizeList
    background #383737
    padding-bottom 20px
    h5
        background #505050
        color #fff
        text-indent 20px
        line-height 44px
        margin-bottom 10px
        font-size 14px
    .list
        overflow hidden
        padding 0 20px
        color #dcdcdc
        border-bottom 1px dashed #555
        font-size 14px
        line-height 30px
        padding-top 2px
        &:first-child
            background #ff8f00
            font-size 14px
            font-weight bold
            color #000
        .time
            float left
            margin-right 20px
        .prizeNumber
            float right
            span
                margin-right 14px
</style>

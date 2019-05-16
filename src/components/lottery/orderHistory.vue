<template>
    <div class="orderHistory">
        <ul class="title">
            <li>投注时间</li>
            <li>彩种</li>
            <li>期号</li>
            <li>玩法</li>
            <li>投注内容</li>
            <li>投注金额</li>
            <li>奖金</li>
            <li>开奖号码</li>
            <li>状态</li>
        </ul>
        <p>暂无数据</p>
    </div>
</template>

<script>
export default {
    name: 'orderHistory'
}
</script>

<style lang="stylus" scoped>
.orderHistory
    margin-top 20px
    background url('../../assets/images/ssc-repeat_001.jpg')
    .title
        background #505050
        border-bottom 1px solid #313131
        display flex
        li
            line-height 44px
            flex 1
            color #e8e8e8
            text-align center
            &:first-child
                flex 1.5
    p
        text-align center
        line-height 60px
        color #ccc
</style>

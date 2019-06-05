<template>
    <div class="orderHistory">
        <ul class="title">
            <li>投注时间</li>
            <li>派奖时间</li>
            <li>玩法</li>
            <li>奖期</li>
            <li>模式</li>
            <li>投注内容</li>
            <li>倍数</li>
            <li>金额</li>
            <li>追号</li>
            <li>操作</li>
        </ul>
        <ul class="orderContent">
            <li v-for="(item,value) of this.$store.state.orderHistory" :key="value">
                <span>{{item.writetime}}</span>
                <span>{{item.bonustime}}</span>
                <span>{{item.methodname}}</span>
                <span>{{item.issue}}</span>
                <span>{{item.modes}}</span>
                <span class="code">{{item.code}}</span>
                <span>{{item.multiple}}</span>
                <span>{{item.totalprice}}</span>
                <span>{{}}</span>
                <Button
                    :disabled="!item.canCancel"
                    @click="handleCancel(item.projectid)"
                    type="warning"
                >撤单</Button>
            </li>
        </ul>
        <p>暂无数据</p>
    </div>
</template>

<script>
import { Button } from 'iview'
import { ordercancel } from '@/api/index'
export default {
    name: 'orderHistory',
    methods: {
        handleCancel(projectid) {
            ordercancel({ projectid }).then(res => {
                let arr = [...this.$store.state.orderHistory]
                arr = arr.filter(item => item.projectid != projectid)
                this.$store.dispatch('handleOrderHistory', arr)
                this.$Message.success('撤单成功')
            })
        }
    },
    components: {
        Button
    }
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
    .orderContent
        li
            display flex
            padding 10px 0
            text-align center
            border-bottom 1px solid #313131
            border-top 1px solid #464646
            span
                flex 1
                color #e8e8e8
                &:first-child
                    flex 1.5
            .code
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
            button
                flex 1
                padding 0
                line-height 26px
                margin-top -4px
    p
        text-align center
        line-height 60px
        color #ccc
</style>

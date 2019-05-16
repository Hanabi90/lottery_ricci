<template>
    <div class="order">
        <div class="order_left">
            <ul>
                <li
                    :class="{'active':unitActive==item}"
                    @click="chosenUnit(item)"
                    v-for="item of unit"
                    :key="item"
                >{{item}}</li>
            </ul>
            <div class="multiple">
                <input v-model="multiple" type="text">
                <span class="multiple_text">倍</span>
                <div>
                    <span @click="changeMultiple('+')">+</span>
                    <span @click="changeMultiple('-')">-</span>
                </div>
            </div>
        </div>
        <div class="order_right">
            <span>已选</span>
            <span>0</span>
            <span>注</span>
            <span>共</span>
            <span>0</span>
            <span>元</span>
            <button class="buttonColor">一键投注</button>
            <button>添加投注</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'order',
    data() {
        return {
            unit: ['元', '角', '分'],
            unitActive: '元',
            multiple: 1
        }
    },
    methods: {
        chosenUnit(item) {
            this.unitActive = item
        },
        changeMultiple(item) {
            if (item == '+') {
                this.multiple++
            } else {
                this.multiple--
            }
            if (this.multiple < 1) {
                this.multiple = 1
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.order
    background url('../../assets/images/ssc-repeat_001.jpg')
    height 100px
    border-top 1px solid #464646
    overflow hidden
    .order_left
        float left
        padding 20px
        overflow hidden
        ul
            height 26px
            float left
        li
            float left
            background #7b7b7b
            width 26px
            height 26px
            line-height 26px
            border-radius 6px
            text-align center
            margin-right 10px
            color #d2d2d2
            box-shadow 0 3px 4px #1f1d1d
            &.active
                color #fff
                background #ff632c
        .multiple
            float left
            margin-left 20px
            position relative
            overflow hidden
            box-shadow 0 3px 4px #1f1d1d
            input, div
                float left
            input
                background #312e2e
                border 1px solid #ff632c
                color #fff
                height 26px
                width 80px
                border-top-left-radius 3px
                border-bottom-left-radius 3px
                padding-right 20px
                text-align center
                border-right none
            .multiple_text
                position absolute
                color #fff
                background none
                right 40px
                top 7px
                width 20px
            span
                display block
                height 13px
                line-height 13px
                width 40px
                text-align center
                background #ff632c
                &:first-child
                    border-bottom 1px solid #e24c17
    .order_right
        float right
        padding 15px
        overflow hidden
        span
            font-size 14px
            margin 0 6px
            line-height 26px
        button
            height 42px
            border none
            background #ff6000
            margin 0 10px
            color #fff
            padding 0 20px
            font-size 14px
            border-radius 3px
            line-height 42px
            outline none
            box-shadow 0 3px 4px #1f1d1d
            &.buttonColor
                background #e02569
</style>

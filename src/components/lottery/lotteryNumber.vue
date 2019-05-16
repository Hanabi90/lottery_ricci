<template>
    <div class="lotteryNumber">
        <div class="numberTitle">
            <h5>五星复试</h5>
            <p class="switcher">
                <span
                    :class="value==switcherNow?'active':''"
                    v-for=" (item,value) of switcher"
                    :key="value"
                    @click="change(value)"
                >{{value}}</span>
            </p>
            <p class="switcherList">
                <span
                    :class="value==0?'activeList':''"
                    v-for="(item,value) of switcher[switcherNow]"
                    :key="item"
                >{{item}}</span>
            </p>
            <div>
                <p>
                    <i></i>
                    <Tooltip content="Here is the prompt text">说明</Tooltip>
                </p>
                <p>
                    <i></i>
                    <Tooltip content="Here is the prompt text">示例</Tooltip>
                </p>
                <p>
                    <i></i>
                    <Tooltip content="Here is the prompt text">帮助</Tooltip>
                </p>
                <p>
                    <button>经典版</button>
                </p>
            </div>
        </div>
        <ul class="number_container">
            <li v-for="(item,index) of groupNumber" :key="index">
                <div class="list">
                    <h5>{{index}}</h5>
                    <div>
                        <span
                            @click="chosenNumber"
                            v-for="number of item.value"
                            :key="number"
                            :class="{'active':handleActive(index,number)}"
                        >{{number}}</span>
                    </div>
                    <div>
                        <span
                            @click="chosenType(lable,index,$event)"
                            v-for="lable of item.lable"
                            :key="lable"
                            ref="numberType"
                        >{{lable}}</span>
                    </div>
                </div>
                <div class="supplement">
                    <h5>{{switcherNow}}</h5>
                    <div>
                        <span v-for="supple of item[switcherNow]" :key="supple">{{supple}}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { Tooltip } from 'iview'
export default {
    name: 'lotteryNumber',
    data() {
        return {
            groupNumber: {
                万位: {
                    value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    lable: ['全', '大', '小', '奇', '偶', '清'],
                    遗漏: [4, 5, 6, 41, 58, 45, 22, 44, 11, 10],
                    冷热: [3, 2, 5, 7, 68, 8, 36, 66, 11, 10]
                },
                千位: {
                    value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    lable: ['全', '大', '小', '奇', '偶', '清'],
                    遗漏: [4, 5, 6, 41, 58, 45, 22, 44, 11, 10],
                    冷热: [3, 2, 5, 7, 68, 8, 36, 66, 11, 10]
                },
                百位: {
                    value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    lable: ['全', '大', '小', '奇', '偶', '清'],
                    遗漏: [4, 5, 6, 41, 58, 45, 22, 44, 11, 10],
                    冷热: [3, 2, 5, 7, 68, 8, 36, 66, 11, 10]
                },
                十位: {
                    value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    lable: ['全', '大', '小', '奇', '偶', '清'],
                    遗漏: [4, 5, 6, 41, 58, 45, 22, 44, 11, 10],
                    冷热: [3, 2, 5, 7, 68, 8, 36, 66, 11, 10]
                },
                个位: {
                    value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                    lable: ['全', '大', '小', '奇', '偶', '清'],
                    遗漏: [4, 5, 6, 41, 58, 45, 22, 44, 11, 10],
                    冷热: [3, 2, 5, 7, 68, 8, 36, 66, 11, 10]
                }
            },
            switcher: {
                遗漏: ['当前遗漏', '最大遗漏'],
                冷热: ['30期', '50期', '100期']
            },
            switcherNow: '遗漏',
            activeGroup: {
                万位: [],
                千位: [],
                百位: [],
                十位: [],
                个位: []
            }
        }
    },
    computed: {},
    methods: {
        change(item) {
            this.switcherNow = item
        },
        chosenNumber(item) {
            item.path[2].lastElementChild
                .querySelectorAll('span')
                .forEach(item => (item.className = ''))
            if (item.toElement.className == 'active') {
                item.toElement.className = ''
            } else {
                item.toElement.className = 'active'
            }
        },
        chosenType(lable, index, $event) {
            $event.path[1]
                .querySelectorAll('span')
                .forEach(item => (item.className = ''))
            if ($event.toElement.className == 'active') {
                $event.toElement.className = ''
            } else {
                $event.toElement.className = 'active'
            }
            let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            switch (lable) {
                case '全':
                    this.$set(this.activeGroup, index, arr)
                    break
                case '大':
                    this.$set(this.activeGroup, index, arr.filter(i => i > 4))
                    break
                case '小':
                    this.$set(this.activeGroup, index, arr.filter(i => i < 5))
                    break
                case '奇':
                    this.$set(
                        this.activeGroup,
                        index,
                        arr.filter(i => i % 2 != 0)
                    )
                    break
                case '偶':
                    this.$set(
                        this.activeGroup,
                        index,
                        arr.filter(i => i % 2 === 0)
                    )
                    break
                default:
                    this.$set(this.activeGroup, index, [])
                    break
            }
        },
        handleActive(index, item) {
            return this.activeGroup[index].some(element => element == item)
        }
    },
    components: {
        Tooltip
    }
}
</script>

<style lang="stylus" scoped>
.lotteryNumber
    background url('../../assets/images/ssc-repeat_001.jpg')
    border-bottom 1px solid #1a1a1a
    .numberTitle
        padding 20px
        border-top 1px solid #424242
        overflow hidden
        h5
            float left
            background #ff632c
            color #fff
            padding 4px 10px
            border-radius 3px
            position relative
            &::after
                content ''
                display block
                position absolute
                width 0
                height 0
                border-style solid
                border-width 10px 10px 0 10px
                border-color #ff632c transparent transparent transparent
                bottom -8px
                left 23px
        .switcher
            display flex
            border-top 1px solid #191919
            border-bottom 1px solid #424242
            border-radius 3px
            background #313131
            float left
            margin-left 20px
            height 26px
            width 100px
            line-height 26px
            color #c4c4c4
            &>span
                flex 1
                text-align center
            &>span.active
                background #ff632c
                color #fff
        .switcherList
            float left
            height 26px
            line-height 26px
            margin-left 10px
            &>span
                margin-right 10px
            &>span.activeList
                color #ff632c
        &>div
            float right
            overflow hidden
            p
                float left
                .ivu-tooltip
                    color #ccc
                    margin-right 16px
                    display inline-block
                    line-height 28px
                    font-size 14px
                i
                    background url('../../assets/images/icon_sm_group.png') no-repeat
                    display inline-block
                    width 17px
                    height 17px
                    margin-bottom -4px
                    margin-right 5px
                button
                    background #a96b94
                    border none
                    padding 4px 10px
                    color #fff
                    border-radius 3px
    .number_container
        padding 0 20px 20px
        .list
            display flex
            height 30px
            line-height 30px
            font-size 14px
            h5
                flex 0.1
            &>div
                flex 1
                display flex
                margin-right 40px
                &:nth-child(3)
                    flex 0.5
                    margin-right 0
                span
                    flex 1
                    background #2b2a2a
                    box-shadow 0 0 0 1.8px #262626, 0 0 4px 0 rgba(255, 255, 255, 0.6), 0 2px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                    margin-right 8px
                    text-align center
                    &.active
                        background #3f74b5
        .supplement
            overflow hidden
            margin-bottom 10px
            margin-top 4px
            color #777
            h5, div
                float left
            div
                margin-left 27px
                width 521px
                display flex
                span
                    text-align center
                    flex 1
                    margin-right 8px
</style>

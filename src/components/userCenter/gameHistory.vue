<template>
    <div>
        <Form :model="orderHistoryList" :label-width="72" inline>
            <FormItem label="彩种名称">
                <Select v-model="orderHistoryList.lotteryid" style="width:110px">
                    <Option v-for="(item,value) of lotteryList" :key="value" :value="value">{{item}}</Option>
                </Select>
            </FormItem>
            <FormItem label="投注模式">
                <Select v-model="orderHistoryList.modes" style="width:120px">
                    <Option v-for="(item,key) of lotteryModes" :key="key" :value="key">{{item}}</Option>
                </Select>
            </FormItem>
            <FormItem label="帐变类型">
                <Select v-model="orderHistoryList.ordertypeid" style="width:100px">
                    <Option
                        v-for="item of ordertypeid"
                        :key="item.value"
                        :value="item.value"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
            <Button style="width:160px" @click="handleOrderHistory" type="primary">查询</Button>
            <FormItem label="请选择日期">
                <DatePicker
                    v-model="orderHistoryList.starttime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placeholder="请选择日期"
                    style="width: 280px"
                ></DatePicker>
            </FormItem>
            <FormItem label="下级用户名">
                <Select
                    placeholder="查询下级信息"
                    v-model="orderHistoryList.username"
                    style="width:120px"
                >
                    <Option
                        v-for="(item,value) of userList"
                        :key="value"
                        :value="item.username"
                    >{{item.username}}</Option>
                </Select>
            </FormItem>
            <FormItem label="下级">
                <Checkbox v-model="orderHistoryList.includechild"></Checkbox>
            </FormItem>
        </Form>
        <div class="content">
            <div class="title">
                <h5>用户名</h5>
                <h5>时间</h5>
                <h5>帐变类型</h5>
                <h5>彩种</h5>
                <h5>玩法</h5>
                <h5>投注模式</h5>
                <h5>余额变动</h5>
                <h5>余额</h5>
                <h5>状态</h5>
            </div>
            <Scroll
                v-if="scroll"
                :on-reach-bottom="handleReachBottom"
                :distance-to-edge="-200"
                height="410"
            >
                <ul class="list">
                    <li v-for="(item,value) of userHistory" :key="value">
                        <span>{{item.username}}</span>
                        <span>{{item.times}}</span>
                        <span>{{item.cntitle}}</span>
                        <span>{{item.cnname}}</span>
                        <span class="code">{{item.methodname}}</span>
                        <span>{{item.modes}}</span>
                        <span>{{item.amount}}</span>
                        <span>{{item.money}}</span>
                        <span>{{item.transferstatus}}</span>
                    </li>
                    <li v-if="pages<=orderHistoryList.p">
                        <span>{{datafinish}}</span>
                    </li>
                </ul>
            </Scroll>
            <div class="total">
                <span style="margin-left:20px;margin-right:420px">余额变动总计</span>
                <span>{{totalMoney}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import {
    Form,
    FormItem,
    Select,
    Option,
    DatePicker,
    Button,
    Checkbox,
    Scroll
} from 'iview'
import { getuserlottery, getchildlist, getorderhistory } from '@/api/index'
export default {
    name: 'gameHistory',
    data() {
        return {
            orderHistoryList: {
                includechild: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                ordertypeid: '', //帐变类型id
                issue: '', //彩种奖期
                modes: '', //投注模式
                lotteryid: '', //彩种名称
                starttime: '', //起始时间
                pn: 9, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            lotteryList: {}, //彩票id
            lotteryModes: {
                0: '所有模式',
                1: '元',
                2: '角',
                3: '分'
            }, //玩法id
            userList: [],
            ordertypeid: [
                { value: '-1', name: '所有类型' },
                { value: '3', name: '[-]加入游戏' },
                { value: '4', name: '[+]投注返点' },
                { value: '5', name: '[+]奖金派送' },
                { value: '6', name: '[-]追号扣款' },
                { value: '7', name: '[+]当期追号返款' },
                { value: '9', name: '[+]撤单返款' },
                { value: '11', name: '[-]撤销返点' },
                { value: '12', name: '[-]撤销派奖' }
            ],
            userHistory: [],
            pages: 1, //页数
            scroll: true, //把滚动条置顶
            datafinish: '数据已加载完'
        }
    },
    computed: {
        totalMoney() {
            let count = 0
            if (this.userHistory.length) {
                this.userHistory.forEach(item => {
                    if (item.cntitle.slice(1, 2) == '+') {
                        count += Number(item.amount)
                    } else {
                        count -= Number(item.amount)
                    }
                })
            }
            return parseFloat(count.toPrecision(12))
        }
    },
    methods: {
        handleOrderHistory() {
            this.scroll = false
            this.$nextTick(() => {
                this.scroll = true
            })
            let orderHistoryList = { ...this.orderHistoryList }
            orderHistoryList.starttime = this.dataformat(
                this.orderHistoryList.starttime[0]
            )
            orderHistoryList.endtime = this.dataformat(
                this.orderHistoryList.starttime[1]
            )
            orderHistoryList.p = 1
            this.$set(this.orderHistoryList, 'p', 1)
            getorderhistory({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.userHistory = [...res.data.page_data] //当前数据
                    this.pages = Math.ceil(res.data.total_count / 25) //页数
                } else {
                    this.userHistory = []
                    this.pages = 1
                }
            })
        },
        handleReachBottom() {
            let orderHistoryList = { ...this.orderHistoryList }
            orderHistoryList.starttime = this.dataformat(
                this.orderHistoryList.starttime[0]
            )
            orderHistoryList.endtime = this.dataformat(
                this.orderHistoryList.starttime[1]
            )
            if (orderHistoryList.p < this.pages) {
                return new Promise(resolve => {
                    orderHistoryList.p = this.orderHistoryList.p + 1
                    this.$set(
                        this.orderHistoryList,
                        'p',
                        this.orderHistoryList.p + 1
                    )
                    getorderhistory({ ...orderHistoryList }).then(res => {
                        this.userHistory = [
                            ...this.userHistory,
                            ...res.data.page_data
                        ]
                        resolve()
                    })
                })
            }
        },
        dataformat(str) {
            let time = new Date(str)
            time =
                time.getFullYear() +
                '-' +
                (time.getMonth() + 1 > 9
                    ? time.getMonth() + 1
                    : '0' + (time.getMonth() + 1)) +
                '-' +
                (time.getDate() > 9 ? time.getDate() : '0' + time.getDate()) +
                ' ' +
                (time.getHours() > 9
                    ? time.getHours()
                    : '0' + time.getHours()) +
                ':' +
                (time.getMinutes() > 9
                    ? time.getMinutes()
                    : '0' + time.getMinutes()) +
                ':' +
                (time.getSeconds() > 9
                    ? time.getSeconds()
                    : '0' + time.getSeconds())
            return time
        }
    },
    mounted() {
        getuserlottery().then(res => {
            this.lotteryList = { ...res.data }
            this.$set(this.lotteryList, 0, '所有游戏')
        })
        //获取用户下级
        getchildlist().then(res => {
            if (res.data) {
                this.userList = [...res.data]
            }
        })
    },
    components: {
        Form,
        FormItem,
        Select,
        Option,
        DatePicker,
        Button,
        Checkbox,
        Scroll
    }
}
</script>

<style lang="stylus" scoped>
.content
    box-shadow inset 0px 3px 20px 1px #d0d0d0
    border-radius 3px
    overflow hidden
    .title
        background #2d8cf0
        display flex
        padding-right 20px
        h5
            flex 1
            line-height 30px
            text-align center
            color #fff
    .list
        li
            display flex
            margin-bottom 10px
            span
                flex 1
                text-align center
                font-size 12px
            .code
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
    .total
        background #112840
        line-height 30px
        color #fff
</style>

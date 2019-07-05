<template>
    <div>
        <Form :model="orderHistoryList" :label-width="72" inline>
            <FormItem label="彩种名称">
                <Select v-model="orderHistoryList.lottery" style="width:110px">
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
                    <Option value="-1">所有类型</Option>
                    <Option
                        v-for="item of ordertypeid"
                        :key="item.id"
                        :value="item.id"
                    >{{item.cntitle}}</Option>
                </Select>
            </FormItem>
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
                <Checkbox true-value="1" false-value="0" v-model="orderHistoryList.includechild"></Checkbox>
            </FormItem>
            <Button style="width:160px" @click="handleOrderHistory" type="primary">查询</Button>
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
                :distance-to-edge="-10"
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
import {
    getuserlottery,
    getchildlist,
    getorderhistory,
    getallordertype
} from '@/api/index'
export default {
    name: 'gameHistory',
    props: ['username'],
    data() {
        return {
            orderHistoryList: {
                includechild: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                ordertypeid: '-1', //帐变类型id
                modes: '0', //投注模式
                lottery: '-1', //彩种名称
                starttime: '', //起始时间
                pn: 18, //请求的数据记录数量
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
            ordertypeid: [],
            userHistory: [],
            pages: 1, //页数
            scroll: true, //把滚动条置顶
            datafinish: '数据已加载完',
            totalMoney: 0 //余额变动
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
                    this.pages = Math.ceil(
                        res.data.total_count / this.orderHistoryList.pn
                    ) //页数
                    this.totalMoney = res.data.money_change.toFixed(2)
                } else {
                    this.userHistory = []
                    this.pages = 1
                    this.totalMoney = 0
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
        //获取游戏帐变类型
        getallordertype().then(res => {
            this.ordertypeid = [...res.data]
        })
        getuserlottery().then(res => {
            this.lotteryList = { ...res.data }
            this.$set(this.lotteryList, -1, '所有游戏')
        })
        //获取用户下级
        getchildlist().then(res => {
            if (res.data) {
                this.userList = [...res.data]
            }
        })
        this.orderHistoryList.username = this.username
        if (this.username) {
            this.handleOrderHistory()
        }
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
                line-height 18px
            .code
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
    .total
        background #112840
        line-height 30px
        color #fff
</style>

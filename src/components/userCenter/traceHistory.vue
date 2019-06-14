<template>
    <div>
        <Form :model="orderHistoryList" :label-width="72" inline>
            <FormItem label="彩种名称">
                <Select
                    v-model="orderHistoryList.lotteryid"
                    style="width:110px"
                    @on-change="getMethods"
                >
                    <Option v-for="(item,value) of lotteryList" :key="value" :value="value">{{item}}</Option>
                </Select>
            </FormItem>
            <FormItem label="游戏玩法">
                <Select v-model="orderHistoryList.methodid" style="width:120px">
                    <Option
                        v-for="(item,index) of lotteryMethodList"
                        :key="index"
                        :value="item.methodid"
                    >{{item.methodname}}</Option>
                </Select>
            </FormItem>
            <FormItem label="追号状态">
                <Select v-model="orderHistoryList.taskstatus" style="width:100px">
                    <Option
                        v-for="item of tasksList"
                        :key="item.value"
                        :value="item.value"
                    >{{item.text}}</Option>
                </Select>
            </FormItem>
            <Button style="width:160px" @click="handleOrderHistory" type="primary">查询</Button>
            <FormItem label="类型">
                <Select v-model="orderHistoryList.userpointtype" style="width:100px">
                    <Option
                        v-for="item of userpointtypeList"
                        :key="item.value"
                        :value="item.value"
                    >{{item.text}}</Option>
                </Select>
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
            <FormItem label="彩种奖期">
                <Input v-model="orderHistoryList.issue" placeholder="请选择"></Input>
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
            <FormItem label="下级">
                <Checkbox v-model="orderHistoryList.includechild"></Checkbox>
            </FormItem>
        </Form>
        <div class="content">
            <div class="title">
                <h5>追号时间</h5>
                <h5>用户</h5>
                <h5>彩种</h5>
                <h5>开始期数</h5>
                <h5>追号内容</h5>
                <h5>追号总金额</h5>
                <h5>完成金额</h5>
                <h5>取消金额</h5>
                <h5>中奖后终止</h5>
                <h5>追号状态</h5>
            </div>
            <Scroll
                v-if="scroll"
                :on-reach-bottom="handleReachBottom"
                :distance-to-edge="-200"
                height="410"
            >
                <ul class="list">
                    <li v-for="(item,value) of userHistory" :key="value">
                        <span>{{item.updatetime}}</span>
                        <span>{{item.username}}</span>
                        <span>{{item.cnname}}</span>
                        <span>{{item.beginissue}}</span>
                        <span class="code">{{item.codes}}</span>
                        <span>{{item.taskprice}}</span>
                        <span>{{item.finishprice}}</span>
                        <span>{{item.cancelprice}}</span>
                        <span>{{item.stoponwin==1?'是':'否'}}</span>
                        <span
                            :style="{color:item.status==0?'#018625':'#b9b9b9'}"
                        >{{item.status==0?'进行中':'已完成'}}</span>
                    </li>
                    <li v-if="pages<=orderHistoryList.p">
                        <span>{{datafinish}}</span>
                    </li>
                </ul>
            </Scroll>
            <!-- <div class="total">
                <span style="margin-left:20px;margin-right:420px">余额变动总计</span>
                <span>{{totalMoney}}</span>
            </div>-->
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
    Scroll,
    Input
} from 'iview'
import {
    getuserlottery,
    getchildlist,
    gettaskhistory,
    getuserlotterymethod
} from '@/api/index'
export default {
    name: 'traceHistory',
    data() {
        return {
            orderHistoryList: {
                includechild: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                taskstatus: '', //追号状态
                issue: '', //彩种奖期
                userpointtype: '',
                methodid: '', //游戏玩法
                lotteryid: '', //彩种名称
                starttime: '', //起始时间
                pn: 9, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            tasksList: [
                { value: -1, text: '所有状态' },
                { value: 0, text: '进行中' },
                { value: 1, text: '已取消' },
                { value: 2, text: '已完成' }
            ], //状态列表
            lotteryList: {}, //彩票列表
            userpointtypeList: [
                { value: -1, text: '不含超级2000' },
                { value: 1, text: '只有超级2000' },
                { value: 2, text: '所有类型' }
            ], //类型列表
            lotteryMethodList: [], //彩票玩法id
            userList: [],
            userHistory: [],
            pages: 1, //页数
            scroll: true, //把滚动条置顶
            datafinish: '数据已加载完'
        }
    },
    computed: {
        // totalMoney() {
        //     let count = 0
        //     if (this.userHistory.length) {
        //         this.userHistory.forEach(item => {
        //             if (item.cntitle.slice(1, 2) == '+') {
        //                 count += Number(item.amount)
        //             } else {
        //                 count -= Number(item.amount)
        //             }
        //         })
        //     }
        //     return parseFloat(count.toPrecision(12))
        // }
    },
    methods: {
        //获取玩法
        getMethods() {
            getuserlotterymethod({ lotteryid: arguments[0] }).then(res => {
                this.lotteryMethodList = [...res.data]
                this.lotteryMethodList.unshift({
                    methodid: 0,
                    methodname: '所有玩法'
                })
            })
        },
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
            gettaskhistory({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.userHistory = [...res.data.page_data] //当前数据
                    this.pages = Math.ceil(
                        res.data.total_count / this.orderHistoryList.pn
                    ) //页数
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
                    gettaskhistory({ ...orderHistoryList }).then(res => {
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
        Scroll,
        Input
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

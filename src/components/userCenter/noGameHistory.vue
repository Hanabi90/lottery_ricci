<template>
    <div>
        <Form :model="orderHistoryList" :label-width="72" inline>
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
                <h5>帐变编号</h5>
                <h5>用户名</h5>
                <h5>时间</h5>
                <h5>类型</h5>
                <h5>收入</h5>
                <h5>支出</h5>
                <h5>余额</h5>
                <h5>状态</h5>
                <h5>备注</h5>
            </div>
            <Scroll
                v-if="scroll"
                :on-reach-bottom="handleReachBottom"
                :distance-to-edge="-10"
                height="410"
            >
                <ul class="list">
                    <li v-for="(item,value) of noGameList" :key="value">
                        <span>{{item.orderno}}</span>
                        <span>{{item.username}}</span>
                        <span>{{item.times}}</span>
                        <span>{{item.cntitle}}</span>
                        <span class="code">{{item.operations>0?item.amount:0}}</span>
                        <span>{{item.operations==0?item.amount:0}}</span>
                        <span>{{item.money}}</span>
                        <span>{{(item.transferstatus==1||item.transferstatus==3)?'失败':'成功'}}</span>
                        <span>{{item.description?item.description:'---'}}</span>
                    </li>
                    <li v-if="pages<=orderHistoryList.p">
                        <span>{{datafinish}}</span>
                    </li>
                </ul>
            </Scroll>
            <div class="total">
                <span>总收入：{{`${Number(total_income).toFixed(2)}`}}</span>
                <span>总支出：{{`${Number(total_pay).toFixed(2)}`}}</span>
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
    getchildlist,
    getbankreporthistory,
    getallbankreporttype
} from '@/api/index'
export default {
    name: 'noGameHistory',
    data() {
        return {
            orderHistoryList: {
                includechild: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                ordertypeid: '-1', //帐变类型id
                starttime: '', //起始时间
                pn: 18, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            userList: [],
            ordertypeid: [],
            noGameList: [],
            pages: 1, //页数
            scroll: true, //把滚动条置顶
            datafinish: '数据已加载完',
            total_income: 0, //收入
            total_pay: 0 //支出
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
            getbankreporthistory({ ...orderHistoryList }).then(res => {
                if (res.data.page_data) {
                    this.noGameList = [...res.data.page_data] //当前数据
                    this.pages = Math.ceil(
                        res.data.total_count / this.orderHistoryList.pn
                    ) //页数
                    this.total_income = res.data.total_income //收入
                    this.total_pay = res.data.total_pay //支出
                } else {
                    this.noGameList = []
                    this.pages = 1
                    this.total_income = 0 //收入
                    this.total_pay = 0 //支出
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
                    getbankreporthistory({ ...orderHistoryList }).then(res => {
                        this.noGameList = [
                            ...this.noGameList,
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
        getallbankreporttype().then(res => {
            this.ordertypeid = { ...res.data }
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
                line-height 18px
            .code
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
    .total
        background #112840
        line-height 30px
        color #fff
        display flex
        text-align center
        span
            flex 1
</style>

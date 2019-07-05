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
                    <Option value="0">所有玩法</Option>
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
                <Checkbox true-value="1" false-value="0" v-model="orderHistoryList.include"></Checkbox>
            </FormItem>
            <Button style="width:160px" @click="handleOrderHistory" type="primary">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>追号时间</h5>
                <h5>用户</h5>
                <h5>彩种</h5>
                <h5>开始期数</h5>
                <h5>追号内容</h5>
                <h5>追号总金额</h5>
                <h5>中奖后终止</h5>
                <h5>追号状态</h5>
                <h5>操作</h5>
            </div>
            <Scroll
                v-if="scroll"
                :on-reach-bottom="handleReachBottom"
                :distance-to-edge="-10"
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
                        <span>{{item.stoponwin==1?'是':'否'}}</span>
                        <span
                            :style="{color:item.status==0?'#018625':'#b9b9b9'}"
                        >{{item.status==0?'进行中':'已完成'}}</span>
                        <Button
                            @click="getDetailed(item.taskid)"
                            style="height:30px;margin-top:-6px;padding:0"
                            type="primary"
                        >详情</Button>
                    </li>
                    <li v-if="pages<=orderHistoryList.p">
                        <span>{{datafinish}}</span>
                    </li>
                </ul>
            </Scroll>
            <div class="totalList">
                <span>取消总金额：{{total_cancelprice}}</span>
                <span>完成总金额：{{total_finishprice}}</span>
                <span>追号总金额：{{total_taskprice}}</span>
            </div>
        </div>
        <div v-if="detailedOnoff" class="listContent" style="height:560px">
            <Table width="100%" border :columns="columns2" :data="detailedTask"></Table>
            <Table border ref="selection" :columns="columns4" :data="detailedList"></Table>
        </div>
        <Button
            v-if="detailedOnoff"
            @click="back"
            style="float:right;margin-top:10px"
            type="primary"
        >返回</Button>
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
    Input,
    Table
} from 'iview'
import {
    getuserlottery,
    getchildlist,
    gettaskhistory,
    getuserlotterymethod,
    gettaskhistorydetail,
    traceordercancel
} from '@/api/index'
export default {
    name: 'traceHistory',
    data() {
        return {
            orderHistoryList: {
                include: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                taskstatus: '-1', //追号状态
                issue: '', //彩种奖期
                userpointtype: '2',
                methodid: '0', //游戏玩法
                lotteryid: '0', //彩种名称
                starttime: '', //起始时间
                pn: 18, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            tasksList: [
                { value: '-1', text: '所有状态' },
                { value: '0', text: '进行中' },
                { value: '1', text: '已取消' },
                { value: '2', text: '已完成' }
            ], //状态列表
            lotteryList: {}, //彩票列表
            userpointtypeList: [
                { value: '-1', text: '不含超级2000' },
                { value: '1', text: '只有超级2000' },
                { value: '2', text: '所有类型' }
            ], //类型列表
            lotteryMethodList: [], //彩票玩法id
            userList: [],
            userHistory: [],
            pages: 1, //页数
            scroll: true, //把滚动条置顶
            datafinish: '数据已加载完',
            detailedOnoff: false,
            columns2: [
                {
                    title: '游戏用户',
                    key: 'username',
                    width: 100,
                    fixed: 'left'
                },
                {
                    title: '追号编号',
                    key: 'taskid',
                    width: 100
                },
                {
                    title: '追号时间:',
                    key: 'begintime',
                    width: 100
                },
                {
                    title: '游戏',
                    key: 'cnname',
                    width: 100
                },
                {
                    title: '玩法',
                    key: 'methodname',
                    width: 200
                },
                {
                    title: '模式',
                    key: 'modes',
                    width: 100
                },
                {
                    title: '奖金组',
                    key: 'prizegroup',
                    width: 100
                },
                {
                    title: '追号内容',
                    key: 'codes',
                    width: 100
                },
                {
                    title: '开始期号',
                    key: 'beginissue',
                    width: 100
                },
                {
                    title: '追号期数',
                    key: 'issuecount',
                    width: 100
                },
                {
                    title: '完成期数',
                    key: 'finishedcount',
                    width: 100
                },
                {
                    title: '取消期数',
                    key: 'cancelcount',
                    width: 100
                },
                {
                    title: '完成金额',
                    key: 'finishprice',
                    width: 100
                },
                {
                    title: '取消金额',
                    key: 'cancelprice',
                    width: 100
                },
                {
                    title: '中奖后停止追号',
                    key: 'stoponwin',
                    width: 100
                },
                {
                    title: '追号状态',
                    key: 'status',
                    width: 100
                },
                {
                    title: '追号总金额',
                    key: 'taskprice',
                    fixed: 'right',
                    width: 120
                }
            ],
            detailedTask: [],
            detailedList: [],
            columns4: [
                {
                    title: '奖期',
                    key: 'issue'
                },
                {
                    title: '追号倍数',
                    key: 'multiple'
                },
                {
                    title: '追号状态',
                    key: 'traceText'
                },
                {
                    title: '状态',
                    key: 'statusText'
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        if (params.row.can != 0) {
                            let projectid = params.row.projectid
                            return h('div', [
                                h(
                                    Button,
                                    {
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                traceordercancel({
                                                    taskId: this.taskId,
                                                    detailsId: params.row.entry
                                                }).then(res => {
                                                    this.$store.dispatch(
                                                        'handleMoney',
                                                        res.data
                                                    )
                                                    this.$Message.success(
                                                        '撤单成功'
                                                    )
                                                    params.row.can = 0
                                                    params.row.traceText =
                                                        '已取消'
                                                    this.$set(
                                                        params.row,
                                                        'statusText',
                                                        '本人撤单'
                                                    )
                                                })
                                            }
                                        }
                                    },
                                    '撤单'
                                )
                            ])
                        }
                    }
                }
            ],
            taskId: '', //撤单使用
            total_cancelprice: '0', //取消总结
            total_finishprice: '0', //完成总金额
            total_taskprice: '0' //追号总金额
        }
    },
    computed: {},
    methods: {
        //返回
        back() {
            this.detailedOnoff = false
        },
        //获取详情
        getDetailed(id) {
            gettaskhistorydetail({ id }).then(res => {
                this.taskId = id
                this.detailedOnoff = true
                this.detailedTask[0] = res.data.task
                this.detailedList = res.data.aTaskdetail.map(item => {
                    let status
                    item.can == 0
                        ? (item._disabled = true)
                        : (item._disabled = false)

                    if (item.iscancel == 0) {
                        if (item.isgetprize == 0) {
                            status = '未开奖'
                        } else if (item.isgetprize == 2) {
                            status = '未中奖'
                        } else if (item.isgetprize == 1) {
                            if (item.prizestatus == 0) {
                                status = '未派奖'
                            } else {
                                status = '已派奖'
                            }
                        }
                    }
                    if (item.iscancel == 1) {
                        status = '本人撤单'
                    }
                    if (item.iscancel == 2) {
                        status = '平台撤单'
                    }
                    if (item.iscancel == 3) {
                        status = '错开撤单'
                    }
                    if (item.status == 0) {
                        item.traceText = '进行中'
                    }
                    if (item.status == 2) {
                        item.traceText = '已取消'
                    }
                    if (item.status == 1) {
                        if (item.can == 1) {
                            item.traceText = '已完成，可撤单'
                        } else {
                            item.traceText = '已完成，不可撤单'
                        }
                    }

                    item.statusText = status
                    return item
                })
            })
        },
        //获取玩法
        getMethods() {
            getuserlotterymethod({ lotteryid: arguments[0] }).then(res => {
                this.lotteryMethodList = [...res.data]
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
                    console.log(res.data.total_cancelprice)
                    this.total_cancelprice = res.data.total_cancelprice //取消总结
                    this.total_finishprice = res.data.total_finishprice //完成总金额
                    this.total_taskprice = res.data.total_taskprice //追号总金额
                } else {
                    this.userHistory = []
                    this.pages = 1
                    this.total_cancelprice = 0 //取消总结
                    this.total_finishprice = 0 //完成总金额
                    this.total_taskprice = 0 //追号总金额
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
        Input,
        Table
    }
}
</script>

<style lang="stylus" scoped>
.content
    box-shadow inset 0px 3px 20px 1px #d0d0d0
    border-radius 3px
    overflow hidden
    position relative
    padding-bottom 30px
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
            span, button
                flex 1
                text-align center
                font-size 12px
            .code
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
            .ivu-btn
                span
                    vertical-align initial
    .totalList
        background #112840
        height 30px
        line-height 30px
        width 100%
        position absolute
        bottom 0
        color #fff
        display flex
        text-align center
        span
            flex 1
.listContent
    width 100%
    height 100%
    position absolute
    top 0
    z-index 2
    overflow-y scroll
</style>

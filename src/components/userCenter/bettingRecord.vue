<template>
    <div>
        <Form :model="bettingRecord" :label-width="72" inline>
            <FormItem label="彩种名称">
                <Select
                    @on-change="getUserLotterymethod"
                    v-model="bettingRecord.lotteryid"
                    style="width:110px"
                >
                    <Option v-for="(item,value) of lotteryList" :key="value" :value="value">{{item}}</Option>
                </Select>
            </FormItem>
            <FormItem label="游戏玩法">
                <Select placeholder="请先选择彩种" v-model="bettingRecord.methodid" style="width:120px">
                    <Option value="0">所有玩法</Option>
                    <Option
                        v-for="item of lotteryMethodList"
                        :key="item.methodid"
                        :value="item.methodid"
                    >{{item.methodname}}</Option>
                </Select>
            </FormItem>
            <FormItem label="奖金组类型">
                <Select v-model="bettingRecord.userpointtype" style="width:100px">
                    <Option
                        v-for="item of userPointTypeList"
                        :key="item.value"
                        :value="item.value"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="请选择日期">
                <DatePicker
                    v-model="bettingRecord.starttime"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    placeholder="请选择日期"
                    style="width: 280px"
                ></DatePicker>
            </FormItem>
            <FormItem label="下级用户名">
                <Select placeholder="查询下级信息" v-model="bettingRecord.username" style="width:120px">
                    <Option
                        v-for="(item,value) of userList"
                        :key="value"
                        :value="item.username"
                    >{{item.username}}</Option>
                </Select>
            </FormItem>
            <FormItem label="彩种奖期">
                <Input v-model="bettingRecord.issue" placeholder="请选择"></Input>
            </FormItem>
            <FormItem label="下级">
                <Checkbox true-value="1" false-value="0" v-model="bettingRecord.include"></Checkbox>
            </FormItem>
            <Button style="width:160px" @click="getBetHistory" type="primary">查询</Button>
        </Form>
        <div class="content">
            <div class="title">
                <h5>投注时间</h5>
                <h5>用户</h5>
                <h5>彩种</h5>
                <h5>投注期号</h5>
                <h5>投注内容</h5>
                <h5>玩法名称</h5>
                <h5>投注金额</h5>
                <h5>奖金</h5>
                <h5>开奖号码</h5>
                <h5>状态</h5>
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
                        <span>{{item.writetime}}</span>
                        <span>{{item.username}}</span>
                        <span>{{item.cnname}}</span>
                        <span>{{item.issue}}</span>
                        <Tooltip
                            max-width="400"
                            :content="item.code"
                        >{{item.code.slice(0,16)}}{{item.code.length>16?"...":''}}</Tooltip>
                        <span>{{item.methodname}}</span>
                        <span>{{item.totalprice}}</span>
                        <span>{{item.bonus}}</span>
                        <Tooltip
                            max-width="400"
                            :content="item.nocode"
                        >{{item.nocode?item.nocode.slice(0,16):''}}{{(item.nocode&&item.nocode.length)>16?"...":''}}</Tooltip>
                        <span>{{handleStatus(item.iscancel,item.isgetprize,item.prizestatus)}}</span>
                        <span>
                            <Button
                                type="primary"
                                :disabled="!item.can"
                                @click="handleCancel(item.projectid,value)"
                            >撤单</Button>
                        </span>
                    </li>
                    <li v-if="pages<=bettingRecord.p">
                        <span>{{datafinish}}</span>
                    </li>
                </ul>
            </Scroll>
            <div class="totalList">
                <span>总投注金额：{{total_betmoney}}</span>
                <span>总奖金：{{total_bonus}}</span>
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
    Scroll,
    Input,
    Tooltip
} from 'iview'
import {
    getuserlottery,
    getuserlotterymethod,
    getchildlist,
    getbethistory,
    ordercancel
} from '@/api/index'
export default {
    name: 'bettingRecord',
    data() {
        return {
            bettingRecord: {
                include: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                userpointtype: '2', //投注类型
                issue: '', //彩种奖期
                methodid: '0', //游戏玩法
                lotteryid: '0', //彩种名称
                starttime: '', //起始时间
                pn: 18, //请求的数据记录数量
                p: 1 //请求的页面序号
            },
            lotteryList: {}, //彩票id
            lotteryMethodList: [], //玩法id
            userList: [],
            userPointTypeList: [
                { value: '2', name: '所有类型' },
                { value: '-1', name: '不含超级2000' },
                { value: '1', name: '只有超级2000' }
            ],
            userHistory: [],
            pages: 2, //页数
            scroll: true, //把滚动条置顶
            datafinish: '数据已加载完',
            total_betmoney: 0,
            total_bonus: 0
        }
    },
    methods: {
        handleCancel(projectid, value) {
            ordercancel({ projectid }).then(res => {
                this.$set(this.userHistory[value], 'can', 0)
                this.$Message.success('撤单成功')
            })
        },
        getUserLotterymethod() {
            getuserlotterymethod({
                lotteryid: this.bettingRecord.lotteryid
            }).then(res => {
                this.lotteryMethodList = [...res.data]
            })
        },
        getBetHistory() {
            this.scroll = false
            this.$nextTick(() => {
                this.scroll = true
            })
            let bettingRecord = { ...this.bettingRecord }
            bettingRecord.starttime = this.dataformat(
                this.bettingRecord.starttime[0]
            )
            bettingRecord.endtime = this.dataformat(
                this.bettingRecord.starttime[1]
            )
            bettingRecord.p = 1
            this.$set(this.bettingRecord, 'p', 1)
            getbethistory({ ...bettingRecord }).then(res => {
                if (res.data.page_data) {
                    this.userHistory = [...res.data.page_data]
                    this.pages = Math.ceil(
                        res.data.total_count / this.bettingRecord.pn
                    )
                    this.total_betmoney = res.data.total_betmoney
                    this.total_bonus = res.data.total_bonus
                } else {
                    this.userHistory = []
                    this.pages = 2
                    this.total_betmoney = 0
                    this.total_bonus = 0
                }
            })
        },
        handleReachBottom() {
            let bettingRecord = { ...this.bettingRecord }
            bettingRecord.starttime = this.dataformat(
                this.bettingRecord.starttime[0]
            )
            bettingRecord.endtime = this.dataformat(
                this.bettingRecord.starttime[1]
            )
            if (bettingRecord.p < this.pages) {
                return new Promise(resolve => {
                    bettingRecord.p = this.bettingRecord.p + 1
                    this.$set(this.bettingRecord, 'p', this.bettingRecord.p + 1)
                    getbethistory({ ...bettingRecord }).then(res => {
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
        },
        handleStatus(iscancel, isgetprize, prizestatus) {
            if (iscancel == 0) {
                if (isgetprize == 0) {
                    return '未开奖'
                } else if (isgetprize == 2) {
                    return '未中奖'
                } else if (isgetprize == 1) {
                    if (prizestatus == 0) {
                        return '未派奖'
                    } else {
                        return '已派奖'
                    }
                }
            }
            if (iscancel == 1) {
                return '本人撤单'
            }
            if (iscancel == 2) {
                return '平台撤单'
            }
            if (iscancel == 3) {
                return '错开撤单'
            }
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
        Tooltip
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
            span, >div
                flex 1
                text-align center
                font-size 12px
                line-height 18px
                height 100%
            .code
                overflow-x auto
    .totalList
        position absolute
        bottom 0
        width 100%
        height 30px
        color #fff
        background #112840
        display flex
        span
            flex 1
            text-align center
            line-height 30px
</style>

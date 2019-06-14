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
            <Button style="width:160px" @click="getBetHistory" type="primary">查询</Button>
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
                <Checkbox v-model="bettingRecord.include"></Checkbox>
            </FormItem>
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
            </div>
            <Scroll
                v-if="scroll"
                :on-reach-bottom="handleReachBottom"
                :distance-to-edge="-200"
                height="440"
            >
                <ul class="list">
                    <li v-for="(item,value) of userHistory" :key="value">
                        <span>{{item.writetime}}</span>
                        <span>{{item.username}}</span>
                        <span>{{item.cnname}}</span>
                        <span>{{item.issue}}</span>
                        <span class="code">{{item.code}}</span>
                        <span>{{item.methodname}}</span>
                        <span>{{item.totalprice}}</span>
                        <span>{{item.bonus}}</span>
                        <span>{{item.nocode}}</span>
                        <span>{{handleStatus(item.iscancel,item.isgetprize,item.prizestatus)}}</span>
                    </li>
                    <li v-if="pages<=bettingRecord.p">
                        <span>{{datafinish}}</span>
                    </li>
                </ul>
            </Scroll>
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
    getuserlotterymethod,
    getchildlist,
    getbethistory
} from '@/api/index'
export default {
    name: 'bettingRecord',
    data() {
        return {
            bettingRecord: {
                include: 0, //是否包含下級（0：不包含，1包含）
                username: '', //用户名
                userpointtype: '', //投注类型
                issue: '', //彩种奖期
                methodid: '', //游戏玩法
                lotteryid: '', //彩种名称
                starttime: '', //起始时间
                pn: '', //请求的数据记录数量
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
            datafinish: '数据已加载完'
        }
    },
    methods: {
        getUserLotterymethod() {
            getuserlotterymethod({
                lotteryid: this.bettingRecord.lotteryid
            }).then(res => {
                this.lotteryMethodList = [...res.data]
                this.lotteryMethodList.unshift({
                    methodid: 0,
                    methodname: '所有玩法'
                })
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
                this.userHistory = [...res.data.page_data]
                this.pages = Math.ceil(res.data.total_count / 25)
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
</style>

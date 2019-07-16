<template>
    <div class="teamProfitLossStatement">
        <div class="seach">
            <span>请选择日期</span>
            <DatePicker
                v-model="starttime"
                format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                placeholder="请选择日期"
                style="width: 280px;margin:0 10px"
            ></DatePicker>
            <RadioGroup v-model="quickDate" @on-change="changeDate">
                <Radio label="durationToday">今天</Radio>
                <Radio label="durationYesterday">昨天</Radio>
                <Radio label="durationThisWeek">7天</Radio>
                <Radio label="durationThisMonth">30天</Radio>
            </RadioGroup>
            <span>奖金组类型</span>
            <Select v-model="userpointtype" style="width:100px;margin:0 10px">
                <Option
                    v-for="item of userPointTypeList"
                    :key="item.value"
                    :value="item.value"
                >{{item.name}}</Option>
            </Select>
            <Button style="width:160px" @click="handleOrderHistory" type="primary">查询</Button>
        </div>
        <Table
            :border="!!detailedList.length"
            height="420"
            size="small"
            ref="selection"
            :columns="columns4"
            :data="detailedList"
        ></Table>
    </div>
</template>

<script>
import {
    DatePicker,
    Select,
    Option,
    Table,
    Button,
    RadioGroup,
    Radio
} from 'iview'
import { reallist } from '@/api/index'
export default {
    name: 'teamProfitLossStatement',
    data() {
        return {
            userpointtype: '2',
            starttime: '',
            userPointTypeList: [
                { value: '2', name: '所有类型' },
                { value: '-1', name: '不含超级2000' },
                { value: '1', name: '只有超级2000' }
            ],
            columns4: [
                {
                    title: '用户名',
                    key: 'user_name'
                },
                {
                    title: '所属组',
                    key: 'belong_group'
                },
                {
                    title: '充值总额',
                    key: 'deposit'
                },
                {
                    title: '提现总额',
                    key: 'withdraw'
                },
                {
                    title: '投注总额',
                    key: 'bonus_amount'
                },
                {
                    title: '派獎总额',
                    key: 'award_amount'
                },
                {
                    title: '返点',
                    key: 'rebate_amount'
                },
                {
                    title: '活动',
                    key: 'promotion'
                },
                {
                    title: '礼金1',
                    key: 'gift_money_1'
                },
                {
                    title: '礼金2',
                    key: 'gift_money_2'
                },
                {
                    title: '净盈亏',
                    key: 'profit'
                }
            ],
            quickDate: 'durationToday',
            detailedList: []
        }
    },
    mounted() {
        this.changeDate(this.quickDate)
    },
    methods: {
        changeDate(value) {
            let startTime = new Date(new Date().setHours(0, 0, 0, 0)),
                nowTime = new Date(),
                lastTime = new Date(
                    new Date(new Date().setHours(0, 0, 0, 0)).setDate(
                        new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 1
                    )
                ),
                lastWeek = new Date(
                    new Date(new Date().setHours(0, 0, 0, 0)).setDate(
                        new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 6
                    )
                ),
                lastMonth = new Date(
                    new Date(new Date().setHours(0, 0, 0, 0)).setDate(
                        new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 29
                    )
                )
            switch (value) {
                case 'durationToday':
                    this.starttime = [startTime, nowTime]
                    break
                case 'durationYesterday':
                    this.starttime = [lastTime, startTime]
                    break
                case 'durationThisWeek':
                    this.starttime = [lastWeek, nowTime]
                    break
                case 'durationThisMonth':
                    this.starttime = [lastMonth, nowTime]
                    break

                default:
                    break
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
        handleOrderHistory() {
            reallist({
                searchDuration: '',
                starttime: this.starttime,
                endtime: '',
                userpointtype: '',
                excludeNoBet: ''
            }).then(res => {
                this.detailedList = res.data.page_data.sub_agents
                console.log(res.data)
            })
        }
    },
    components: {
        DatePicker,
        Select,
        Option,
        Table,
        Button,
        RadioGroup,
        Radio
    }
}
</script>

<style lang="stylus" scoped>
.teamProfitLossStatement
    .seach
        margin-bottom 10px
</style>

<template>
    <div style="position:relative">
        <GameHistory v-if="gameHistory" :username="username" />
        <TeamAccount v-else-if="teamAccount" :uid="pointUserId" />
        <SetPoint v-else-if="setPoint" :uid="pointUserId" />
        <Reputation v-else-if="reputation" :uid="pointUserId" />
        <SubordinateRecharge v-else-if="subordinateRecharge" :uid="pointUserId" />
        <div v-else>
            <Menu
                mode="horizontal"
                active-name="1"
                @on-select="changeContent"
                style="margin-bottom:10px"
            >
                <MenuItem name="1">团队管理</MenuItem>
                <MenuItem name="2">开户中心</MenuItem>
                <MenuItem name="3">团队盈亏报表</MenuItem>
            </Menu>
            <div class="content" style="padding:15px">
                <div v-if="navIndex==1" class="team">
                    <Form ref="teamGroup" :model="teamGroup" :label-width="80" inline>
                        <FormItem label="用户名">
                            <Input
                                type="text"
                                :readonly="readonly"
                                @on-focus="removeInputReadonly"
                                v-model="teamGroup.username"
                                placeholder="请输入用户名"
                            ></Input>
                        </FormItem>
                        <FormItem label="用户余额">
                            <Input type="text" v-model="teamGroup.bank_min" placeholder="最少金额"></Input>
                        </FormItem>
                        <FormItem :label-width="0">
                            <Input type="text" v-model="teamGroup.bank_max" placeholder="最大金额"></Input>
                        </FormItem>
                        <Button type="primary" @click="getGroupList">查询</Button>
                        <FormItem :label-width="20">
                            <Breadcrumb separator="<b class='demo-breadcrumb-separator'>=></b>">
                                <BreadcrumbItem
                                    v-for="(item,index) of userTree"
                                    :key="index"
                                    @click.native="getGroupList({uid:item.userid})"
                                >{{item.username}}</BreadcrumbItem>
                            </Breadcrumb>
                        </FormItem>
                    </Form>
                    <div class="teamCenter">
                        <ul class="teamGroupListTitle">
                            <li>用户名</li>
                            <li>用户类型</li>
                            <li>奖金组</li>
                            <li>{{`${systemtype==0?'用户余额':'信用余额'}`}}</li>
                            <li style="flex:4">用户操作</li>
                        </ul>

                        <Scroll
                            :on-reach-bottom="handleReachBottom"
                            :distance-to-edge="-10"
                            height="400"
                        >
                            <ul class="teamList">
                                <li v-for="(item, index) in teamList" :key="index">
                                    <span>{{item.username}}</span>
                                    <span>{{item.groupname}}</span>
                                    <span>{{item.prizeGroup.toFixed()}}</span>
                                    <span>{{item.money}}</span>
                                    <span style="flex:4">
                                        <Button
                                            v-if="systemtype!=1"
                                            type="primary"
                                            size="small"
                                            :disabled="istop!=1"
                                            @click="handleSubordinateRecharge(item.userid)"
                                        >充值</Button>
                                        <Button
                                            type="primary"
                                            size="small"
                                            @click="handleTeamAccount(item.userid)"
                                        >团队余额</Button>
                                        <Button
                                            v-if="systemtype==1"
                                            type="primary"
                                            size="small"
                                            :disabled="systemtype!=1||item.userid!=item.parentid"
                                            @click="handleReputation(item.userid)"
                                        >信用设置</Button>
                                        <Button
                                            type="primary"
                                            size="small"
                                            :disabled="systemtype!=0||buttonPoint||item.userid!=item.parentid"
                                            @click="handlePoint(item.userid)"
                                        >返点设置</Button>
                                        <Button
                                            @click="getGameHistory(item.username)"
                                            type="primary"
                                            size="small"
                                        >游戏帐变</Button>
                                        <Button
                                            type="primary"
                                            size="small"
                                            :disabled="item.usertype!=1"
                                            @click="getGroupList({uid:item.userid})"
                                        >查询下级</Button>
                                    </span>
                                </li>
                            </ul>
                        </Scroll>
                    </div>
                </div>
                <div v-if="navIndex==2" class="addUser">
                    <OpenAccountLine />
                </div>
                <div v-if="navIndex==3" class="addUser">
                    <TeamProfitLossStatement />
                </div>
            </div>
        </div>
        <Button v-if="backOnoff" @click="back" type="primary" class="black">返回</Button>
    </div>
</template>
<script>
import {
    Menu,
    MenuItem,
    Form,
    FormItem,
    Input,
    Button,
    Scroll,
    Breadcrumb,
    BreadcrumbItem
} from 'iview'
import { getgrouplist } from '@/api/index'
import GameHistory from './gameHistory'
import SetPoint from './setPoint'
import TeamAccount from './teamAccount'
import Reputation from './reputation'
import SubordinateRecharge from './subordinateRecharge'
import OpenAccountLine from './openAccountLine'
import TeamProfitLossStatement from './teamProfitLossStatement'
export default {
    name: 'agentManagement',
    data() {
        return {
            subordinateRecharge: false, //充值
            reputation: false, //信誉设置
            buttonPoint: true, //按钮是否可以点击
            teamAccount: false, //显示团队余额
            backOnoff: false, //返回按钮开关
            pointUserId: '', //设置返点的id
            username: '', //游戏帐变查询使用
            setPoint: false, //游戏返点设置
            gameHistory: false, //游戏帐变开关
            loading: false,
            addUserType: '1', //选择添加类型
            readonly: true, //解决浏览器默认密码输入
            navIndex: 1, //导航下标位置
            teamGroup: {
                username: '',
                bank_min: '',
                bank_max: '',
                p: 1,
                pn: 15
            },
            teamList: [],
            istop: '', //是否是vip类型
            systemtype: JSON.parse(sessionStorage.getItem('userSeting'))
                .systemtype,
            teamGroupUpdate: true, //下拉是否加载完
            userTree: [] //用户树结构
        }
    },
    methods: {
        //查看团队余额
        handleTeamAccount(value) {
            this.pointUserId = value
            this.teamAccount = true
            this.backOnoff = true
        },
        //设置充值
        handleSubordinateRecharge(value) {
            this.backOnoff = true
            this.pointUserId = value
            this.subordinateRecharge = true
        },
        //设置返点
        handlePoint(value) {
            this.setPoint = true
            this.pointUserId = value
            this.backOnoff = true
        },
        //信誉设置
        handleReputation(value) {
            this.reputation = true
            this.pointUserId = value
            this.backOnoff = true
        },
        //返回
        back() {
            this.teamAccount = false
            this.gameHistory = false
            this.setPoint = false
            this.backOnoff = false
            this.buttonPoint = false
            this.reputation = false
            this.subordinateRecharge = false
        },
        //游戏帐变查询
        getGameHistory(value) {
            this.gameHistory = true
            this.username = value
            this.backOnoff = true
        },
        //查询团队列表
        getGroupList(obj) {
            let myself = JSON.parse(sessionStorage.getItem('userSeting')).userid
            if (obj.uid && obj.uid != myself) {
                //如果查看下级，关闭掉返点设置
                this.buttonPoint = true
            } else {
                this.buttonPoint = false
            }
            this.teamGroupUpdate = true //打开下拉加载
            getgrouplist({ ...this.teamGroup, ...obj }).then(res => {
                this.istop = res.data.istop
                this.teamList = res.data.page_data
                if (res.data.usertree) {
                    this.userTree = res.data.usertree
                } else {
                    this.teamGroup.p = 1
                    this.userTree = []
                }
            })
        },
        //下拉加载
        handleReachBottom() {
            if (
                this.teamGroupUpdate &&
                this.teamList.length >= this.teamGroup.pn
            ) {
                return new Promise(resolve => {
                    this.teamGroup.p += 1
                    getgrouplist(this.teamGroup).then(res => {
                        this.istop = res.data.istop
                        this.teamList = [
                            ...this.teamList,
                            ...res.data.page_data
                        ]
                        if (res.data.page_data.length != this.teamGroup.pn) {
                            this.teamGroupUpdate = false
                        }
                        resolve()
                    })
                })
            }
        },
        removeInputReadonly() {
            this.readonly = false
        },
        //切换内容
        changeContent(index) {
            this.navIndex = index
            if (index == 1) {
                this.teamGroup = {
                    username: '',
                    bank_min: '',
                    bank_max: '',
                    p: 1,
                    pn: 15
                }
            }
        }
    },
    components: {
        Menu,
        MenuItem,
        Form,
        FormItem,
        Input,
        Button,
        Scroll,
        Breadcrumb,
        BreadcrumbItem,
        GameHistory,
        SetPoint,
        TeamAccount,
        Reputation,
        SubordinateRecharge,
        OpenAccountLine,
        TeamProfitLossStatement
    }
}
</script>

<style lang="stylus" scoped>
.teamCenter
    box-shadow inset 0px 3px 20px 1px #d0d0d0
    border-radius 3px
    overflow hidden
    .teamGroupListTitle
        background #2d8cf0
        display flex
        color #fff
        line-height 30px
        text-align center
        li
            flex 1
    .teamList
        li
            display flex
            text-align center
            line-height 40px
            span
                flex 1
                button
                    margin 0 4px
.black
    position absolute
    top 0px
    right -15px
    width 40px
    padding 0
    line-height 30px
</style>

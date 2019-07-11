import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let oState = {
    lotteryMenue: {}, //彩票菜单
    loginCode: 0, // 0 未登录 1 登录
    money: '',
    nickname: '',
    drawerRight: true, //个人中心开关
    userCenter: false, //用户中心
    lotteryId: '', //彩种id
    menuId: '', //彩票菜单id
    lotteryNumber: '', //选择的号码
    hackReset: true, //利用v-if 重组组件lottery 组件
    issue: '', //当前奖期
    orderList: [], //投购篮
    orderHistory: [], //投注历史记录
    openList: [], //开奖历史
    unReadAmount: 0, //未读消息
    bonues: '', //奖金,
    trace: false //追号开关
}
export default new Vuex.Store({
    state: { ...oState },
    mutations: {
        reset(state) {
            for (const iterator in oState) {
                state[iterator] = oState[iterator]
            }
        },

        lotteryMenue(state, data) {
            state.lotteryMenue = { ...data }
        },
        login(state, data) {
            // 变更状态
            state.loginCode = data
        },
        money(state, data) {
            state.money = data
        },
        nickname(state, data) {
            state.nickname = data
        },
        lotteryId(state, data) {
            state.lotteryId = data
        },
        menuId(state, data) {
            state.menuId = data
        },
        userCenter(state, data) {
            state.userCenter = data
        },
        lotteryNumber(state, data) {
            state.lotteryNumber = { ...data }
        },
        hackReset(state, data) {
            state.hackReset = data
        },
        issue(state, data) {
            state.issue = data
        },
        orderList(state, data) {
            switch (data.type) {
                case 'add':
                    state.orderList.unshift(data.data)
                    break
                case 'delete':
                    state.orderList = [...data.data]
                    break
                case 'clear':
                    state.orderList = []
                    break
                default:
                    break
            }
        },
        orderHistory(state, data) {
            state.orderHistory = [...data]
        },
        openList(state, data) {
            state.openList = [...data]
        },
        unReadAmount(state, data) {
            state.unReadAmount = data
        },
        bonues(state, data) {
            state.bonues = data
        },
        trace(state, data) {
            state.trace = data
        }
    },
    actions: {
        handleReset(context) {
            context.commit('reset')
        },
        handleLotteryMenue(context, data) {
            context.commit('lotteryMenue', data)
        },
        handleLogin(context, data) {
            context.commit('login', data)
        },
        handleMoney(context, data) {
            context.commit('money', data)
        },
        handleNickName(context, data) {
            context.commit('nickname', data)
        },
        handleLotteryId(context, data) {
            context.commit('lotteryId', data)
        },
        handleMenuId(context, data) {
            context.commit('menuId', data)
        },
        handleUserCenter(context, data) {
            context.commit('userCenter', data)
        },
        handleLotteryNumber(context, data) {
            context.commit('lotteryNumber', data)
        },
        handleHackReset(context, data) {
            context.commit('hackReset', data)
        },
        handleIssue(context, data) {
            context.commit('issue', data)
        },
        handleOrderList(context, data) {
            context.commit('orderList', data)
        },
        handleOrderHistory(context, data) {
            context.commit('orderHistory', data)
        },
        handleOpenList(context, data) {
            context.commit('openList', data)
        },
        handleUnReadAmount(context, data) {
            context.commit('unReadAmount', data)
        },
        handleBonues(context, data) {
            context.commit('bonues', data)
        },
        handleTrace(context, data) {
            context.commit('trace', data)
        }
    }
})

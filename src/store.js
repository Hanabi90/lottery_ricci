import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let oState = {
    loginCode: 0, // 0 未登录 1 登录
    money: {
        availablebalance: '', //现金
        creditavailable: '' //信誉
    },
    nickname: '',
    lotteryId: '', //彩票id
    drawerRight: true //个人中心开关
}
export default new Vuex.Store({
    state: { ...oState },
    mutations: {
        reset(state) {
            for (const iterator in oState) {
                state[iterator] = oState[iterator]
            }
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
        }
    },
    actions: {
        handleReset(context) {
            context.commit('reset')
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
        }
    }
})

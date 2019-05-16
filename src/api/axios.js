import axios from 'axios'
import Vue from 'vue'
import store from '../store'
import { LoadingBar, Message } from 'iview'
Vue.use(LoadingBar, Message)
const service = axios.create({
    // 设置超时时间
    timeout: 6000,
    baseURL: process.env.VUE_APP_BASE_URL
})
service.defaults.headers.post['Content-Type'] =
    'application/x-www-form-urlencoded'
let loading = null
service.interceptors.request.use(
    config => {
        // 在请求先展示加载框
        const token = sessionStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = token
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
/**
 * 请求响应拦截
 * 用于处理需要在请求返回后的操作
 */
service.interceptors.response.use(
    response => {
        // 请求响应后关闭加载框
        LoadingBar.start()
        const responseCode = response.status
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
        // 否则的话抛出错误
        if (responseCode === 200) {
            LoadingBar.finish()
            let code = response.data.code
            switch (code) {
                //已从其他端口登录
                case 0:
                    return Promise.resolve(response.data)
                case -15:
                    Message.error(response.data.msg)
                    store.dispatch('handleLogin', false)
                    sessionStorage.clear()
                    return
                case -13:
                    Message.error(response.data.msg)
                    store.dispatch('handleReset')
                    sessionStorage.clear()
                    return
                default:
                    return
            }
        } else {
            LoadingBar.error()
            return Promise.resolve(response)
        }
    },
    error => {
        // 请求响应后关闭加载框
        LoadingBar.error()
        // 断网 或者 请求超时 状态
        if (!error.response) {
            // 请求超时状态
            if (error.message.includes('timeout')) {
                console.log('超时了')
                return Promise.resolve('超时了')
            } else {
                // 可以展示断网组件
                // return Promise.resolve('断网了')
            }
            return
        }
        // 服务器返回不是 2 开头的情况，会进入这个回调
        // 可以根据后端返回的状态码进行不同的操作
        const responseCode = error.response.status

        switch (responseCode) {
            // 401：未登录
            case 401:
                // 跳转登录页

                break
            // 403: token过期
            case 403:
                // 弹出错误信息
                console.log('错误')
                // 清除token
                localStorage.removeItem('token')
                // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面

                break
            // 404请求不存在
            case 404:
                break
            // 其他错误，直接抛出错误提示
            default:
        }
    }
)
export default service

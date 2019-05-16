import service from './axios'
import qs from 'qs'
//登录
export const login = formData =>
    service.request({
        method: 'post',
        url: 'UserLogin',
        data: qs.stringify(formData)
    })
//登出
export const loginOut = formData =>
    service.request({
        method: 'post',
        url: 'logout'
    })

//获取金额
export const getbalance = formData =>
    service.request({
        method: 'post',
        url: 'getbalance'
    })
//查询资金密码
export const getsecpass = formData =>
    service.request({
        method: 'post',
        url: 'getsecpass'
    })
//修改昵称
export const updatenickname = formData =>
    service.request({
        method: 'post',
        url: 'updatenickname',
        data: qs.stringify({ nickname: 'test001' })
    })
//查询银行卡

export const getbankinfo = formData =>
    service.request({
        method: 'post',
        url: 'getbankinfo'
    })
//获取彩票菜单
export const getMenu = formData =>
    service.request({
        method: 'get',
        url: 'menu/get/1'
    })
//獲取指定彩種的玩法羣組
export const MethodCrowd = formData =>
    service.request({
        method: 'get',
        url: `method/crowd/get/${formData}`
    })
//獲取指定羣組下的玩法
export const getmethod = formData =>
    service.request({
        method: 'get',
        url: `method/crowd/getmethod/1/${formData}`
    })

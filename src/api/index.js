import service from './axios'
import qs from 'qs'
import JsEncrypt from 'jsencrypt'
//公共key
const public_key = `-----BEGIN PUBLIC KEY-----
                MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGeBwE0bATN5j/AWlYAiAMRE+6FN
                JGxIXZmW2J7Qks1c+inXB4KQIuXK2a6DLfuGnxRWCTa0XJvHr6vLWvx1J8zVktOq
                1w7tA6yR5iwYfN5vS+aorsI8tcRxuNGpDtJsLS9kINGd7VH2ocmYSv8PDUKZMLqr
                i5Azz9DtRubvoQJFAgMBAAE=
                -----END PUBLIC KEY-----`
const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgGeBwE0bATN5j/AWlYAiAMRE+6FNJGxIXZmW2J7Qks1c+inXB4KQ
IuXK2a6DLfuGnxRWCTa0XJvHr6vLWvx1J8zVktOq1w7tA6yR5iwYfN5vS+aorsI8
tcRxuNGpDtJsLS9kINGd7VH2ocmYSv8PDUKZMLqri5Azz9DtRubvoQJFAgMBAAEC
gYAWf+fzWtlp/RTC1cXtsnaEM5KXP5OZTim6h0XTT/d5WKqwiaOCSB6t4OhsvOsz
79GItCMQlyhCXKfdKjk/A6CA6WG4DUhJywDsO9W56xp9wBBE047qukZioIHTKLbX
omsTCuIwalAKQ1uRd+9y1tf/pD/vSODBvAxOVXLvVPbJSQJBAKkm/wbz7uo9a1vV
Olu+olFHN361bygUlyA5L+pvviboXb47Bf4HemR/xENZez/rXcduCFuIkSZ+6TA3
oSXVacsCQQCcpnV0C4nCP9po0GaQImJPuQz4Yacol5nODuTxS/GjRl/BVWbEp/qo
tMjalmSuDXiiwjzYp43c3kk2Qx6v/QIvAkBAsCghmZIJxJlVElNyGJJssOaZL3um
AVHWQeiAKGG48W5APMRK5MM6wd3lv8expypDBWJu1uhjp284QF4BYP9HAkA+3R4t
X6P87Br+DQPbu7CwRZbK5oVqaMw0QQ3nN47U8xziPR9ss+yHX2VrMwdcQdOznTdF
ypfHlvzSZcUe4u3JAkBIGDs4HLojgf05f/c17zN/Zav+D7aMHAYr2ZM5PGmIv4MJ
rlPH5K63Mupv/Lb+2rVVI0os6nEeLo5v7sWQjoNG
-----END RSA PRIVATE KEY-----`
export const RSAencrypt = str => {
    let BLOCK_SIZE = 100,
        jse = new JSEncrypt(),
        ret = '',
        str_1 = ''
    jse.setPublicKey(public_key)
    while (str.length > 0) {
        var i = BLOCK_SIZE
        if (str.length < i) {
            i = str.length
        }
        str_1 = str.substr(0, i)
        str = str.substr(i, str.length - i)
        ret += jse.encrypt(str_1) + ' '
    }
    return ret
}
export const decryptData = data => {
    let decrypt = new JSEncrypt()

    // 设置私钥
    decrypt.setPrivateKey(privateKey)
    // 解密数据
    return decrypt.decrypt(data)
}

//登录
export const login = formData =>
    service.request({
        method: 'post',
        url: 'default/userlogin',
        data: qs.stringify(formData)
    })
//登出
export const loginOut = formData =>
    service.request({
        method: 'post',
        url: 'default/logout'
    })
//修改登录密码
export const changeuserloginpass = formData =>
    service.request({
        method: 'post',
        url: 'user/changeuserloginpass',
        data: qs.stringify(formData)
    })

//获取金额
export const getbalance = formData =>
    service.request({
        method: 'post',
        url: 'user/getbalance'
    })
//查询资金密码
export const getsecpass = formData =>
    service.request({
        method: 'post',
        url: 'security/checksecpassexist'
    })
//验证资金密码
export const checksecpass = formData =>
    service.request({
        method: 'post',
        url: 'security/checksecpass',
        data: qs.stringify(formData)
    })
//使用密保找回资金密码
export const changeusersecpass = formData =>
    service.request({
        method: 'post',
        url: 'user/changeusersecpass',
        data: qs.stringify(formData)
    })
//设置密保问题
export const setsequestion = formData =>
    service.request({
        method: 'post',
        url: 'user/setsequestion',
        data: qs.stringify(formData)
    })
//取得先前设置的密保问题
export const checksequestion = formData =>
    service.request({
        method: 'post',
        url: 'security/checksequestion',
        data: qs.stringify(formData)
    })
//修改昵称
export const updatenickname = formData =>
    service.request({
        method: 'post',
        url: 'user/adduserbank',
        data: qs.stringify({ nickname: 'test001' })
    })
//查询银行卡
export const getbankinfo = formData =>
    service.request({
        method: 'post',
        url: 'user/getuserbankinfo',
        data: qs.stringify(formData)
    })
//添加银行卡
export const adduserbank = formData =>
    service.request({
        method: 'post',
        url: 'user/adduserbank',
        data: qs.stringify(formData)
    })
//获取系统通知
export const getnotice = formData =>
    service.request({
        method: 'post',
        url: `getnotice`
    })
//获取行政区列表
export const getprovincelist = formData =>
    service.request({
        method: 'post',
        url: 'area/getprovincelist',
        data: qs.stringify(formData)
    })
//获取城市列表
export const getcitylist = formData =>
    service.request({
        method: 'post',
        url: 'area/getcitylist',
        data: qs.stringify(formData)
    })
//获取银行列表
export const getbanklist = formData =>
    service.request({
        method: 'post',
        url: 'bankmanage/getbanklist',
        data: qs.stringify(formData)
    })
//获取下级资讯
export const getchildlist = formData =>
    service.request({
        method: 'post',
        url: 'user/getchildlist'
    })
//获取使用者彩种
export const getuserlottery = formData =>
    service.request({
        method: 'post',
        url: 'user/getuserlottery'
    })
//获取用户彩种玩法
export const getuserlotterymethod = formData =>
    service.request({
        method: 'post',
        url: 'user/getuserlotterymethod',
        data: qs.stringify(formData)
    })

//查詢投注記錄
export const getbethistory = formData =>
    service.request({
        method: 'post',
        url: 'gameinfo/getbethistory',
        data: qs.stringify(formData)
    })
//获取所有游戏帐变类型
export const getallordertype = formData =>
    service.request({
        method: 'post',
        url: 'report/getallordertype'
    })
//游戏帐变记录
export const getorderhistory = formData =>
    service.request({
        method: 'post',
        url: 'report/getorderhistory',
        data: qs.stringify(formData)
    })
//查詢指定時間段內的追號投注記錄
export const gettaskhistory = formData =>
    service.request({
        method: 'post',
        url: 'gameinfo/gettaskhistory',
        data: qs.stringify(formData)
    })
//查询追号记录详情
export const gettaskhistorydetail = formData =>
    service.request({
        method: 'post',
        url: 'gameinfo/gettaskhistorydetail',
        data: qs.stringify(formData)
    })
//追號撤單接口
export const traceordercancel = formData =>
    service.request({
        method: 'post',
        url: 'traceordercancel',
        data: qs.stringify(formData)
    })
//非遊戲帳變記錄
export const getbankreporthistory = formData =>
    service.request({
        method: 'post',
        url: 'report/getbankreporthistory',
        data: qs.stringify(formData)
    })
//获取所有非游戏帐变类型
export const getallbankreporttype = formData =>
    service.request({
        method: 'post',
        url: 'report/getallbankreporttype',
        data: qs.stringify(formData)
    })

//获取彩票菜单
export const getMenu = formData =>
    service.request({
        method: 'post',
        url: 'lottery/getmenu'
    })
//獲取彩票信息獎金組及玩法等
export const getLotteryInfo = formData =>
    service.request({
        method: 'post',
        url: 'lottery/getinfo',
        data: qs.stringify(formData)
    })
//獲取当前彩种奖期
export const getissue = formData =>
    service.request({
        method: 'post',
        url: `getissue`,
        data: qs.stringify(formData)
    })
//獲取中獎號碼接口
export const getprize = formData =>
    service.request({
        method: 'post',
        url: `getprize`,
        data: qs.stringify(formData)
    })
//投注接口
export const betting = formData =>
    service.request({
        method: 'post',
        url: `lottery/betting`,
        data: qs.stringify(formData)
    })
//撤单接口
export const ordercancel = formData =>
    service.request({
        method: 'post',
        url: `ordercancel`,
        data: qs.stringify(formData)
    })
//獲取最近50條獎期信息
export const getcreateissues = formData =>
    service.request({
        method: 'post',
        url: `getcreateissues`,
        data: qs.stringify(formData)
    })
//获取收到的消息
export const getmessage = formData =>
    service.request({
        method: 'post',
        url: 'user/getmessage',
        data: qs.stringify(formData)
    })
//获取消息内容
export const getmessagecontent = formData =>
    service.request({
        method: 'post',
        url: 'user/getmessagecontent',
        data: qs.stringify(formData)
    })
//删除发送的消息
export const deletemessage = formData =>
    service.request({
        method: 'post',
        url: 'user/deletemessage',
        data: qs.stringify(formData)
    })
//获取已发送的消息
export const getSendMessage = formData =>
    service.request({
        method: 'post',
        url: 'user/getmessage',
        data: qs.stringify(formData)
    })
//发消息给下级
export const sendmessagetochild = formData =>
    service.request({
        method: 'post',
        url: 'user/sendmessagetochild',
        data: qs.stringify(formData)
    })
//发消息给上级
export const sendmessagetoparent = formData =>
    service.request({
        method: 'post',
        url: 'user/sendmessagetoparent',
        data: qs.stringify(formData)
    })
//回复信息
export const messagereply = formData =>
    service.request({
        method: 'post',
        url: 'user/messagereply',
        data: qs.stringify(formData)
    })
//获取未读消息数量
export const getunreadmessageamount = formData =>
    service.request({
        method: 'post',
        url: 'user/getunreadmessageamount',
        data: qs.stringify(formData)
    })
//获取推广链接奖金组可选范围
export const getreglink = formData =>
    service.request({
        method: 'post',
        url: 'user/getreglink'
    })
//获取推广链接奖金组可选范围
export const addnewuser = formData =>
    service.request({
        method: 'post',
        url: 'user/addnewuser',
        data: qs.stringify(formData)
    })
//删除推广链接
export const delreglink = formData =>
    service.request({
        method: 'post',
        url: 'user/delreglink',
        data: qs.stringify(formData)
    })
//代理设置推广链结
export const setreglink = formData =>
    service.request({
        method: 'post',
        url: 'user/setreglink',
        data: qs.stringify(formData)
    })
//获取团队管理清单
export const getgrouplist = formData =>
    service.request({
        method: 'post',
        url: 'user/getgrouplist',
        data: qs.stringify(formData)
    })
//获取返点设置条件-返点设置
export const setpoints = formData =>
    service.request({
        method: 'post',
        url: 'user/setpoints',
        data: qs.stringify(formData)
    })
//获取团队余额
export const getgroupbalance = formData =>
    service.request({
        method: 'post',
        url: 'user/getgroupbalance',
        data: qs.stringify(formData)
    })
//获取信用设置条件
export const setcredit = formData =>
    service.request({
        method: 'post',
        url: 'credit/setcredit',
        data: qs.stringify(formData)
    })
//取得充值条件
export const topup = formData =>
    service.request({
        method: 'post',
        url: 'user/topup',
        data: qs.stringify(formData)
    })
//获取联系信息管理清单
export const getemailbindlist = formData =>
    service.request({
        method: 'post',
        url: 'user/getemailbindlist'
    })
//設置联系信息
export const setemailbind = formData =>
    service.request({
        method: 'post',
        url: 'user/setemailbind',
        data: qs.stringify(formData)
    })
//获取活动列表
export const getactivitylist = formData =>
    service.request({
        method: 'post',
        url: 'activity/getactivitylist'
    })
//获取活动列表
export const getactivityinfo = formData =>
    service.request({
        method: 'post',
        url: 'activity/getactivityinfo',
        data: qs.stringify(formData)
    })

//注册-获取注册验证码
export const popularizereg = formData =>
    service.request({
        method: 'post',
        url: 'user/popularizereg',
        data: qs.stringify(formData)
    })
//团队盈亏报表
export const reallist = formData =>
    service.request({
        method: 'post',
        url: 'report/reallist',
        data: qs.stringify(formData)
    })
//修改银行卡
export const updateuserbankcard = formData =>
    service.request({
        method: 'post',
        url: 'user/updateuserbankcard',
        data: qs.stringify(formData)
    })

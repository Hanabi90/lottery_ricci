<template>
    <div>
        <RadioGroup style="margin-bottom:20px" v-model="addUserType">
            <Radio label="1">添加会员</Radio>
            <Radio label="0">会员链接开户</Radio>
        </RadioGroup>
        <Form
            v-show="addUserType==1"
            ref="addUserList"
            :model="addUserList"
            :rules="ruleAddUserList"
            :label-width="80"
        >
            <FormItem label="用户名" prop="userName">
                <Input
                    type="text"
                    ref="userInput"
                    v-model="addUserList.userName"
                    placeholder="请输入用户名"
                    :readonly="readonly"
                    @on-focus="removeInputReadonly"
                ></Input>
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input type="password" v-model="addUserList.password" placeholder="请输入密码"></Input>
            </FormItem>
            <FormItem label="奖金组">
                <Slider
                    :min="Number(bonusGroup.minodds)"
                    :max="Number(bonusGroup.maxodds)"
                    v-model="addUserList.bonus"
                    :step="2"
                    show-input
                    :active-change="false"
                    input-size="small"
                ></Slider>
            </FormItem>
            <FormItem label="用户类型">
                <RadioGroup v-model="addUserList.userType">
                    <Radio label="1">代理</Radio>
                    <Radio label="0">会员</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem>
                <Button type="primary" :loading="loading" @click="handleSubmit('addUserList')">
                    <span v-if="!loading">添加用户</span>
                    <span v-else>创建用户中...</span>
                </Button>
            </FormItem>
        </Form>
        <div v-show="addUserType==0">
            <Form ref="addUserLine" :model="addUserLine" :label-width="80">
                <FormItem label="奖金组">
                    <Slider
                        :min="Number(bonusGroup.minodds)"
                        :max="Number(bonusGroup.maxodds)"
                        v-model="addUserLine.keepodds"
                        :step="2"
                        show-input
                        input-size="small"
                    ></Slider>
                </FormItem>
                <FormItem label="用户类型">
                    <RadioGroup v-model="addUserLine.usertype">
                        <Radio label="1">代理</Radio>
                        <Radio label="0">会员</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('addUserLine')">生成链接</Button>
                </FormItem>
            </Form>
            <Table
                stripe
                v-if="userLineData.length"
                height="280"
                border
                ref="selection"
                :columns="columns4"
                :data="userLineData"
            ></Table>
        </div>
    </div>
</template>

<script>
import {
    Form,
    FormItem,
    Input,
    Button,
    Slider,
    RadioGroup,
    Radio,
    Table
} from 'iview'
import {
    getreglink,
    addnewuser,
    RSAencrypt,
    setreglink,
    delreglink
} from '@/api/index'
import QrcodeVue from 'qrcode.vue'
export default {
    name: 'openAccountLine',
    data() {
        return {
            loading: false,
            addUserType: '1', //选择添加类型
            readonly: true, //解决浏览器默认密码输入
            bonusGroup: {
                curodds: 0,
                maxodds: 2000,
                minodds: 1300,
                tuiguan: [],
                userid: 0
            }, //个人信息、奖金组，用户id
            addUserList: {
                bonus: 1500,
                userName: '',
                password: '',
                userType: '1' //1-代理| 0-会员
            },
            ruleAddUserList: {
                userName: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }
                ]
            },
            addUserLine: {
                keepodds: 1500,
                usertype: '1' //1-代理| 0-会员
            },
            userLineData: [
                //推广链接存放
            ],
            columns4: [
                {
                    title: '开户链接类型',
                    width: '110',
                    key: 'ztype'
                },
                {
                    title: '开户链接地址',
                    key: 'url'
                },
                {
                    title: '推广代码',
                    key: 'code'
                },
                {
                    title: '奖金组',
                    width: '70',
                    key: 'odds'
                },
                {
                    title: '二维码',
                    width: '130',
                    key: 'action',
                    render: (h, params) => {
                        let create = this.$createElement,
                            dom = create('QrcodeVue', {
                                ref: `img${params.index}`,
                                props: {
                                    value: params.row.url
                                }
                            })

                        return dom
                    }
                },
                {
                    title: '操作',
                    width: '250',
                    key: 'action',
                    render: (h, params) => {
                        let id = params.row.id,
                            index = params.index
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
                                            this.doCopy(params.row.url)
                                        }
                                    }
                                },
                                '复制链接'
                            ),
                            h(
                                Button,
                                {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        margin: '0 10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.downloadFile(
                                                params.index,
                                                params.row.odds
                                            )
                                        }
                                    }
                                },
                                '下载图片'
                            ),
                            h(
                                Button,
                                {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.handleDelreglink(id, index)
                                        }
                                    }
                                },
                                '删除'
                            )
                        ])
                    }
                }
            ]
        }
    },
    methods: {
        removeInputReadonly() {
            this.readonly = false
        },
        //复制到剪贴蒙版
        doCopy(value) {
            this.$copyText(value).then(e => {
                this.$Message.success('已复制到剪贴蒙版')
            })
        },
        //下载图片
        downloadFile(index, odds) {
            let qrcodeUrl = this.$refs.img0.$refs['qrcode-vue'].toDataURL(),
                aLink = document.createElement('a')
            aLink.download = `推广二维码:奖金${odds}`
            aLink.href = qrcodeUrl
            aLink.click()
        },
        //删除推广链接
        handleDelreglink(id, index) {
            delreglink({ id }).then(res => {
                this.userLineData.splice(index, 1)
                this.$Message.success(res.msg)
            })
        },
        //提交
        handleSubmit(name) {
            if (name == 'addUserLine') {
                setreglink(this.addUserLine).then(res => {
                    if (res.data.length) {
                        this.userLineData = []
                        res.data.forEach(item => {
                            let ztype = item.ztype == 1 ? '代理' : '会员',
                                url = item.url + item.urlparam,
                                odds = item.odds,
                                id = item.id,
                                code = item.code
                            this.userLineData.push({
                                ztype,
                                url,
                                odds,
                                id,
                                code
                            })
                        })
                    }
                })
                return
            }
            if (name == 'addUserList') {
                this.$refs[name].validate(valid => {
                    if (valid) {
                        this.loading = true
                        let dataJson = {
                            onekeyodds: this.addUserList.bonus, //奖金
                            usertype: this.addUserList.userType, //用户类型
                            username: this.addUserList.userName, //用户名
                            userpass: this.addUserList.password //密码
                        }
                        addnewuser({
                            ...dataJson,
                            pdata: RSAencrypt(JSON.stringify(dataJson))
                        })
                            .then(res => {
                                this.loading = false
                                this.$Message.success(res.msg)
                                this.$refs[name].resetFields()
                            })
                            .catch(error => {
                                this.loading = false
                                this.$Message.error(error.msg)
                            })
                    } else {
                        this.loading = false
                        this.$Message.error('信息输入不完整!')
                    }
                })
                return
            }
        }
    },
    mounted() {
        getreglink().then(res => {
            for (const key in res.data) {
                this.$set(this.bonusGroup, key, res.data[key])
            }
            if (res.data.tuiguan.length) {
                this.userLineData = []
                res.data.tuiguan.forEach(item => {
                    let ztype = item.ztype == 1 ? '代理' : '会员',
                        url = item.url + item.urlparam,
                        odds = item.odds,
                        id = item.id,
                        code = item.code
                    this.userLineData.push({ ztype, url, odds, id, code })
                })
            }
        })
    },
    components: {
        Form,
        FormItem,
        Input,
        Button,
        Slider,
        RadioGroup,
        Radio,
        Table,
        QrcodeVue
    }
}
</script>
<style lang="stylus" scoped>
>>>.ivu-table-cell
    span
        user-select all
</style>

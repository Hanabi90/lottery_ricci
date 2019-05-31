<template>
    <div class="bank">
        <div v-if="show" style="background:#eee;padding: 20px">
            <Card v-for="(item,value) of bankinfo" :key="value" :bordered="false">
                <p slot="title">
                    <Icon type="ios-card"></Icon>我的银行卡
                </p>
                <Button type="error" href="#" slot="extra" @click.prevent>锁定银行卡</Button>
                <p>
                    <span>银行账户：</span>
                    <span v-cloak>{{item.account}}</span>
                </p>
                <p>
                    <span>银行名称：</span>
                    <span v-cloak>{{item.bank_name}}</span>
                </p>
                <p>
                    <span>绑定时间：</span>
                    <span v-cloak>{{item.atime}}</span>
                </p>
                <p>
                    <span>修改时间：</span>
                    <span v-cloak>{{item.utime}}</span>
                </p>
            </Card>
            <p class="contentText">
                如果您选择银行卡锁定后,如需要删除或者新增银行卡,则需要联系在线客服审核后并解锁方可操作!
                * 友情提示：为提高账户安全性，建议您选择【锁定银行卡】信息；
                锁定后无法新增及修改提款银行卡信息；
                只能选择向在线客服提出申请并提交相关资料复核通过后方可解除锁定。
            </p>
        </div>
        <Form v-else ref="formInline" :model="formInline" :rules="ruleInline">
            <FormItem prop="account_name">
                <Input type="text" v-model="formInline.account_name" placeholder="银行卡用户名">
                    <Icon type="ios-card" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="account">
                <Input type="text" v-model="formInline.account" placeholder="银行卡号">
                    <Icon type="ios-card" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem prop="bank">
                <Select prefix="ios-card" v-model="formInline.bank" placeholder="请选择银行">
                    <Option
                        v-for="(item,value) of branchList"
                        :key="value"
                        :value="`${item.bank_id}#${item.bank_name}`"
                    >{{item.bank_name}}</Option>
                </Select>
            </FormItem>
            <FormItem prop="province">
                <Select
                    @on-change="changeCity"
                    prefix="ios-home"
                    v-model="formInline.province"
                    placeholder="请选择省份"
                >
                    <Option
                        v-for="(item,value) of provinceList"
                        :key="value"
                        :value="`${item.id}#${item.name}`"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem prop="city">
                <Select
                    @on-change="changeBranch"
                    prefix="ios-home"
                    v-model="formInline.city"
                    placeholder="请选择城市"
                >
                    <Option
                        v-for="(item,value) of cityList"
                        :key="value"
                        :value="`${item.id}#${item.name}`"
                    >{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem prop="branch">
                <Input type="text" v-model="formInline.branch" placeholder="请选择支行">
                    <Icon type="ios-card" slot="prepend"></Icon>
                </Input>
            </FormItem>
            <FormItem>
                <Button type="primary" long @click="handleSubmit('formInline')">添加银行卡</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import {
    getsecpass,
    getprovincelist,
    getcitylist,
    getbanklist,
    getbankinfo,
    adduserbank
} from '@/api/index.js'
import {
    Form,
    FormItem,
    Icon,
    Input,
    Button,
    Select,
    Option,
    Card
} from 'iview'
export default {
    name: 'bank',
    data() {
        return {
            show: false, //是否显示添加银行卡
            branchList: [], //获取银行列表
            provinceList: [], //省市列表
            cityList: [], //城市列表
            formInline: {
                account_name: '',
                account: '',
                bank: '',
                province: '',
                city: '',
                branch: ''
            },
            ruleInline: {
                account_name: [
                    {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }
                ],
                account: [
                    {
                        required: true,
                        message: '请输入16或19位银行卡号',
                        trigger: 'blur'
                    }
                ],
                bank: [
                    {
                        required: true,
                        message: '请输入银行名称',
                        trigger: 'blur'
                    }
                ],
                province: [
                    {
                        required: true,
                        message: '请选择省份',
                        trigger: 'blur'
                    }
                ],
                city: [
                    {
                        required: true,
                        message: '请选择城市',
                        trigger: 'blur'
                    }
                ],
                branch: [
                    {
                        required: true,
                        message: '请选择支行',
                        trigger: 'blur'
                    }
                ]
            },
            bankinfo: [
                {
                    account: '',
                    bank_name: '',
                    atime: '',
                    utime: ''
                }
            ]
        }
    },
    methods: {
        handleSubmit(name) {
            adduserbank(this.formInline).then(res => {
                this.bankinfo = res.data.banklist
                this.show = true
            })
        },
        changeCity(value) {
            getcitylist({ province: value.substr(0, value.indexOf('#')) }).then(
                res => {
                    this.cityList = res.data
                }
            )
        },
        changeBranch(value) {}
    },
    created() {
        //查询银行卡
        getbankinfo({ secpass: 'qwer1234' }).then(res => {
            this.show = !!Number(res.data.binded)
            this.bankinfo = res.data.banklist
        })
        //获取行政区域列表
        getprovincelist().then(res => {
            this.provinceList = res.data
        })
        //获取银行列表
        getbanklist().then(res => {
            this.branchList = res.data
        })
    },
    components: {
        Form,
        FormItem,
        Icon,
        Input,
        Button,
        Select,
        Option,
        Card
    }
}
</script>

<style lang="stylus" scoped>
.contentText
    padding 10px
</style>

<template>
    <div>
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
            <div class="team">
                <Form ref="teamGroup" :model="teamGroup" :label-width="80" inline>
                    <FormItem label="用户名">
                        <Input type="text" v-model="addUserList.userName" placeholder="请输入用户名"></Input>
                    </FormItem>
                    <FormItem label="用户余额">
                        <Input type="text" v-model="addUserList.userName" placeholder="最少金额"></Input>
                    </FormItem>
                    <FormItem :label-width="0">
                        <Input type="text" v-model="addUserList.userName" placeholder="最大金额"></Input>
                    </FormItem>
                    <Button type="primary" @click="handleSubmit('teamGroup')">查询</Button>
                </Form>
            </div>
            <div v-if="navIndex==2" class="addUser">
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
                            show-input
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
                        <Button type="primary" @click="handleSubmit('addUserList')">添加用户</Button>
                    </FormItem>
                </Form>
                <div v-if="addUserType==0">
                    <Form ref="addUserLine" :model="addUserLine" :label-width="80">
                        <FormItem label="奖金组">
                            <Slider
                                :min="Number(bonusGroup.minodds)"
                                :max="Number(bonusGroup.maxodds)"
                                v-model="addUserLine.keepodds"
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
                    <p>
                        <span>推广链接用户类型：</span>
                        <span>{{this.userLineData.ztype}}</span>
                        <span style="margin-left:20px">推广链接：</span>
                        <span>{{this.userLineData.url}}</span>
                    </p>
                </div>
            </div>
        </div>
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
    Slider,
    RadioGroup,
    Radio
} from 'iview'
import { getreglink, addnewuser, RSAencrypt, setreglink } from '@/api/index'
export default {
    name: 'agentManagement',
    data() {
        return {
            addUserType: '1', //选择添加类型
            readonly: true, //解决浏览器默认密码输入
            navIndex: 1, //导航下标位置
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
                        message: 'Please fill in the user name',
                        trigger: 'blur'
                    }
                ],
                password: [
                    {
                        required: true,
                        message: 'Please fill in the user name',
                        trigger: 'blur'
                    }
                ]
            },
            addUserLine: {
                keepodds: 1500,
                usertype: '1' //1-代理| 0-会员
            },
            teamGroup: {
                username: '',
                bank_min: '',
                bank_max: '',
                p: 1,
                pn: 15
            },
            userLineData: {
                //推广链接存放
                ztype: '暂无',
                url: '暂无'
            }
        }
    },
    methods: {
        changeContent(index) {
            this.navIndex = index
        },
        //提交
        handleSubmit(name) {
            if (name == 'addUserLine') {
                setreglink(this.addUserLine).then(res => {
                    this.userLineData.ztype =
                        res.data.tuiguan.ztype == 1 ? '代理' : '会员'
                    this.$set(
                        this.userLineData,
                        'url',
                        res.data.tuiguan.url + res.data.tuiguan.urlparam
                    )
                })
                return
            }
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (name == 'addUserList') {
                        let dataJson = {
                            onekeyodds: this.addUserList.bonus, //奖金
                            usertype: this.addUserList.userType, //用户类型
                            username: this.addUserList.userName, //用户名
                            userpass: this.addUserList.password //密码
                        }
                        addnewuser({
                            ...dataJson,
                            pdata: RSAencrypt(JSON.stringify(dataJson))
                        }).then(res => {
                            this.$Message.success(res.msg)
                            this.$refs[name].resetFields()
                        })
                    }
                } else {
                    this.$Message.error('信息输入不完整!')
                }
            })
        },
        removeInputReadonly() {
            this.readonly = false
        }
    },
    mounted() {
        getreglink().then(res => {
            for (const key in res.data) {
                this.$set(this.bonusGroup, key, res.data[key])
            }
            if (!(res.data.tuiguan instanceof Array)) {
                this.userLineData.ztype =
                    res.data.tuiguan.ztype == 1 ? '代理' : '会员'
                this.$set(
                    this.userLineData,
                    'url',
                    res.data.tuiguan.url + res.data.tuiguan.urlparam
                )
            }
        })
    },
    components: {
        Menu,
        MenuItem,
        Form,
        FormItem,
        Input,
        Button,
        Slider,
        RadioGroup,
        Radio
    }
}
</script>

<style lang="scss" scoped>
</style>

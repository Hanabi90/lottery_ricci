<template>
    <div>
        <Form
            style="width:400px"
            v-show="listIndex"
            ref="answerInline"
            :model="answerInline"
            :rules="ruleAnswer"
            :label-width="80"
            @submit.native.prevent
        >
            <FormItem label="问题">
                <p>{{question}}</p>
            </FormItem>
            <FormItem label="答案" prop="answer">
                <Input type="text" v-model="answerInline.answer" placeholder="请输入答案"></Input>
            </FormItem>
            <FormItem>
                <Button @click="handleSubmit('answerInline')" type="primary">确定</Button>
            </FormItem>
        </Form>
        <div v-show="!listIndex">
            <Menu
                mode="horizontal"
                active-name="1"
                @on-select="changeContent"
                style="margin-bottom:10px"
            >
                <MenuItem name="1">密保重置</MenuItem>
                <MenuItem name="2">资金密码重置</MenuItem>
            </Menu>
            <Form
                v-show="tableIndex==1"
                ref="formInline"
                :model="formInline"
                :rules="ruleValidate"
                :label-width="60"
            >
                <FormItem prop="dna_ques_1" label="问题一">
                    <Select v-model="formInline.dna_ques_1" placeholder="请选择密保问题">
                        <Option
                            v-for="item of questionList"
                            :key="item.value"
                            :value="item.value"
                        >{{item.content}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="ans1" label="答案">
                    <Input type="text" v-model="formInline.ans1" placeholder="请输入密保答案"></Input>
                </FormItem>
                <FormItem prop="dna_ques_2" label="问题二">
                    <Select v-model="formInline.dna_ques_2" placeholder="请选择密保问题">
                        <Option
                            v-for="item of questionList"
                            :key="item.value"
                            :value="item.value"
                        >{{item.content}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="ans2" label="答案">
                    <Input type="text" v-model="formInline.ans2" placeholder="请输入密保答案"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="handleSubmit('formInline')" type="primary">确定</Button>
                </FormItem>
            </Form>
            <Form
                style="width:400px"
                v-show="tableIndex==2"
                ref="resetPassword"
                :model="resetPassword"
                :rules="rulePassword"
                :label-width="160"
                @submit.native.prevent
            >
                <FormItem label="请输入要重置的资金密码" prop="answer">
                    <Input type="text" v-model="resetPassword.password" placeholder="请输入资金密码"></Input>
                </FormItem>
                <FormItem>
                    <Button @click="handleSubmit('resetPassword')" type="primary">确定</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import {
    Form,
    FormItem,
    Select,
    Option,
    Input,
    Button,
    Menu,
    MenuItem
} from 'iview'
import {
    setsequestion,
    checksequestion,
    changeusersecpass,
    RSAencrypt
} from '@/api/index'
import md5 from 'js-md5'
export default {
    name: 'bindquestion',
    data() {
        return {
            formInline: {
                dna_ques_1: '',
                ans1: '',
                dna_ques_2: '',
                ans2: ''
            },
            ruleValidate: {
                dna_ques_1: [
                    {
                        required: true,
                        message: '请选择问题',
                        trigger: 'change'
                    }
                ],
                ans1: [
                    {
                        required: true,
                        message: '请输入答案',
                        trigger: 'blur'
                    }
                ],
                dna_ques_2: [
                    {
                        required: true,
                        message: '请选择问题',
                        trigger: 'change'
                    }
                ],
                ans2: [
                    {
                        required: true,
                        message: '请输入答案',
                        trigger: 'blur'
                    }
                ]
            },
            questionList: [
                { value: '4', content: '您母亲的姓名是？' },
                { value: '8', content: '您配偶的生日是？' },
                { value: '13', content: '您的学号（或工号）是？' },
                { value: '5', content: '您母亲的生日是？' },
                { value: '12', content: '您高中班主任的名字是？' },
                { value: '1', content: '您父亲的姓名是？' },
                { value: '10', content: '您小学班主任的名字是？' },
                { value: '2', content: '您父亲的生日是？' },
                { value: '7', content: '您配偶的姓名是？' },
                { value: '11', content: '您初中班主任的名字是？' },
                { value: '16', content: '您最熟悉的童年好友名字是？' },
                { value: '17', content: '您最熟悉的学校宿舍室友名字是？' },
                { value: '18', content: '对您影响最大的人名字是？' }
            ],
            onOff: false,
            listIndex: '', //获取问题下标
            answerInline: {
                answer: ''
            },
            ruleAnswer: {
                answer: [
                    {
                        required: true,
                        message: '请输入答案',
                        trigger: 'change'
                    }
                ]
            },
            resetPassword: {
                password: ''
            },
            rulePassword: {
                password: [
                    {
                        required: true,
                        message: '请输入重置密码',
                        trigger: 'change'
                    }
                ]
            },
            tableIndex: 1
        }
    },
    computed: {
        question() {
            let count
            this.questionList.forEach(item => {
                if (item.value == this.listIndex.dna_ques) {
                    count = item.content
                }
            })
            return count
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    if (name == 'answerInline') {
                        checksequestion({
                            flag: 'check',
                            ...this.listIndex,
                            ans: this.answerInline.answer
                        }).then(res => {
                            this.listIndex = ''
                        })
                    }
                    if (name == 'formInline') {
                        setsequestion({ ...this.formInline }).then(res => {
                            this.$Message.success('Success!')
                        })
                    }
                    if (name == 'resetPassword') {
                        let oJosn = {
                            newpass: md5(this.resetPassword.password),
                            confirm_newpass: md5(this.resetPassword.password)
                        }

                        changeusersecpass({
                            flag: 'sequestion',
                            json: RSAencrypt(JSON.stringify(oJosn))
                        }).then(res => {
                            this.$Message.success('重置资金密码成功')
                        })
                    }
                } else {
                    this.$Message.error('信息填写不完整!')
                }
            })
        },
        changeContent(value) {
            this.tableIndex = value
        }
    },
    mounted() {
        checksequestion().then(res => {
            if (res.data) {
                this.listIndex = res.data
            }
        })
    },
    components: {
        Form,
        FormItem,
        Select,
        Option,
        Input,
        Button,
        Menu,
        MenuItem
    }
}
</script>

<style lang="stylus" scoped></style>


<template>
    <div>
        <Form ref="formInline" :model="formInline" :rules="ruleValidate" :label-width="60">
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
    </div>
</template>

<script>
import { Form, FormItem, Select, Option, Input, Button } from 'iview'
import { setsequestion } from '@/api/index'
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
            ]
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    setsequestion({ ...this.formInline }).then(res => {
                        this.$Message.success('Success!')
                        console.log(res)
                    })
                } else {
                    this.$Message.error('信息填写不完整!')
                }
            })
        }
    },
    components: {
        Form,
        FormItem,
        Select,
        Option,
        Input,
        Button
    }
}
</script>

<style lang="stylus" scoped></style>


<template>
    <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
        <FormItem label="旧密码" prop="oldPasswd">
            <Input type="password" v-model="formCustom.oldPasswd" number></Input>
        </FormItem>
        <FormItem label="新密码" prop="passwd">
            <Input type="password" v-model="formCustom.passwd"></Input>
        </FormItem>
        <FormItem label="重复新密码" prop="passwdCheck">
            <Input type="password" v-model="formCustom.passwdCheck"></Input>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit('formCustom')">修改</Button>
            <Button @click="handleReset('formCustom')" style="margin-left: 8px">清空</Button>
        </FormItem>
    </Form>
</template>

<script>
import { Form, FormItem, Input, Button } from 'iview'
import md5 from 'js-md5'
import { RSAencrypt, changeuserloginpass } from '@/api/index.js'
export default {
    name: 'loginPassword',
    data() {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.formCustom.passwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formCustom.validateField('passwdCheck')
                }
                callback()
            }
        }
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.formCustom.passwd) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback()
            }
        }
        const validateOldPasswd = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入旧密码'))
            } else {
                callback()
            }
        }

        return {
            formCustom: {
                oldPasswd: '',
                passwd: '',
                passwdCheck: ''
            },
            ruleCustom: {
                oldPasswd: [{ validator: validateOldPasswd, trigger: 'blur' }],
                passwd: [{ validator: validatePass, trigger: 'blur' }],
                passwdCheck: [{ validator: validatePassCheck, trigger: 'blur' }]
            }
        }
    },
    methods: {
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    let oJson = {
                        oldpass: md5(this.formCustom.oldPasswd),
                        newpass: md5(this.formCustom.passwd),
                        confirm_newpass: md5(this.formCustom.passwdCheck)
                    }
                    changeuserloginpass({
                        json: RSAencrypt(JSON.stringify(oJson))
                    }).then(res => {
                        this.$Message.success(res.msg)
                    })
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        handleReset(name) {
            this.$refs[name].resetFields()
        }
    },
    components: {
        Form,
        FormItem,
        Input,
        Button
    }
}
</script>

<style lang="stylus" scoped></style>

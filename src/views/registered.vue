<template>
    <div class="registered">
        <div class="arrow"></div>
        <div class="container">
            <h5>注册您的账户</h5>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
                <FormItem prop="user" label="用户名称">
                    <Input
                        type="text"
                        :readonly="readonly"
                        @on-focus="removeInputReadonly"
                        v-model="formInline.user"
                        placeholder="请输入用户名"
                    ></Input>
                </FormItem>
                <FormItem prop="password" label="用户密码">
                    <Input type="password" v-model="formInline.password" placeholder="请输入密码"></Input>
                </FormItem>
                <FormItem prop="password" label="确认密码">
                    <Input type="password" v-model="formInline.confirm" placeholder="请确认密码"></Input>
                </FormItem>
                <FormItem prop="code" label="特邀代码">
                    <Input
                        type="text"
                        :readonly="true"
                        v-model="formInline.code"
                        placeholder="请输入邀请码"
                    ></Input>
                </FormItem>
                <FormItem prop="imgCode" label="验证码">
                    <img
                        @click="getPopularizereg"
                        style="position:absolute;z-index:1;right:0"
                        :src="img"
                        alt
                    />
                    <Input type="text" v-model="formInline.imgCode" placeholder="请输入验证码"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formInline')">确定</Button>
                </FormItem>
            </Form>
        </div>
        <div @click="close" class="close"></div>
    </div>
</template>

<script>
import { popularizereg } from '@/api/index'
import { Form, FormItem, Input, Button } from 'iview'
import md5 from 'js-md5'
export default {
    name: 'registered',
    data() {
        const validateUser = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入用户名'))
            } else {
                callback()
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.formInline.confirm !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formInline.validateField('confirm')
                }
                callback()
            }
        }
        const validateConfirm = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'))
            } else if (value !== this.formInline.password) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback()
            }
        }
        const validateImgCode = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('验证码输入错误'))
            } else {
                callback()
            }
        }
        return {
            readonly: true,
            onOff: false,
            img: '',
            vvccookie: '',
            formInline: {
                user: '',
                password: '',
                confirm: '',
                code: '',
                imgCode: ''
            },
            ruleInline: {
                user: [{ validator: validateUser, trigger: 'blur' }],
                password: [{ validator: validatePass, trigger: 'blur' }],
                confirm: [{ validator: validateConfirm, trigger: 'blur' }],
                imgCode: [{ validator: validateImgCode, trigger: 'blur' }]
            }
        }
    },
    methods: {
        close() {
            this.onOff = false
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    popularizereg({
                        flag: 'reg',
                        c: this.formInline.code,
                        username: this.formInline.user,
                        code: md5(this.formInline.imgCode), //验证码
                        vvccookie: this.vvccookie,
                        password: this.formInline.password
                    }).then(res => {
                        this.onOff = false
                        this.formInline = {
                            user: '',
                            password: '',
                            confirm: '',
                            code: '',
                            imgCode: ''
                        }
                        this.$Message.success(res.msg)
                    })
                } else {
                    this.$Message.error('Fail!')
                }
            })
        },
        removeInputReadonly() {
            this.readonly = false
        },
        getPopularizereg() {
            popularizereg().then(res => {
                this.img = res.data.imgurl
                this.vvccookie = res.data.vvccookie
            })
        }
    },
    mounted() {
        this.getPopularizereg()
        let index = window.location.search.indexOf('=') + 1,
            code = window.location.search.slice(index)
        this.$set(this.formInline, 'code', code)
    },
    components: {
        Form,
        FormItem,
        Input,
        Button
    }
}
</script>

<style lang="stylus" scoped>
.registered
    width 378px
    margin auto
    right -157px
    top 45px
    line-height normal
    animation fadeInDown ease 1s
    .arrow
        width 0
        height 0
        border-style solid
        border-width 0 10px 10px 5px
        border-color transparent transparent #fff transparent
        margin auto
    .container
        border-radius 10px
        background #fff
        padding 10px
        h5
            text-align center
            font-size 20px
            color #000
    .remanber
        color #000
        margin-top 10px
        overflow hidden
        i
            display inline-block
            width 15px
            height 15px
            border 1px solid #dcdcdc
            border-radius 3px
            vertical-align bottom
            margin-right 5px
    .close
        width 24px
        height 24px
        position absolute
        right 20px
        top 24px
        background url('../assets/images/btn-close.png') no-repeat 0 0
        background-size 24px
        filter grayscale(1) opacity(0.5)
        transition all 0.5s line
        &:hover
            filter grayscale(0) opacity(1)
@keyframes fadeInDown
    from
        transform translate3d(0, -100%, 0)
    to
        transform translate3d(0, 0, 0)
</style>




<template>
    <div class="subordinateRecharge">
        <ul>
            <li>用户账号：{{userName}}</li>
            <li>银行大厅余额：{{childrenMoney}}</li>
            <li>您的银行大厅余额：{{parentMoney}}</li>
            <li>
                充值金额
                <InputNumber
                    :max="Number(parentMoney)"
                    :min="1"
                    size="small"
                    v-model="money"
                    style="width: 300px"
                    active-change
                ></InputNumber>
            </li>
            <li>
                资金密码
                <Input
                    v-model="moneyPassword"
                    size="small"
                    type="password"
                    clearable
                    placeholder="请输入资金密码"
                    style="width: 300px"
                />
            </li>
            <li>
                <Button @click="handleSubmint" type="primary">充值</Button>
            </li>
        </ul>
    </div>
</template>

<script>
import { Button, Input, InputNumber } from 'iview'
import { topup, RSAencrypt } from '@/api/index'
export default {
    name: 'subordinateRecharge',
    props: ['uid'],
    data() {
        return {
            money: 0, //资金
            moneyPassword: '', //资金密码
            userName: '',
            parentMoney: 0,
            childrenMoney: 0
        }
    },
    methods: {
        handleSubmint() {
            topup({
                uid: this.uid,
                flag: 'save',
                money: this.money,
                secpwd: RSAencrypt(`${this.moneyPassword}`)
            }).then(res => {
                this.parentMoney = res.data.aOwnFund.availablebalance
                this.$store.dispatch(
                    'handleMoney',
                    res.data.aOwnFund.availablebalance
                )
                this.childrenMoney = res.data.aUserFund.availablebalance
            })
        }
    },
    mounted() {
        topup({
            uid: this.uid
        }).then(res => {
            this.userName = res.data.userfund.username
            this.parentMoney = res.data.ownfund.availablebalance
            this.childrenMoney = res.data.userfund.availablebalance
        })
    },
    components: {
        Button,
        Input,
        InputNumber
    }
}
</script>    
<style lang="stylus" scoped>
.subordinateRecharge
    ul
        li
            line-height 30px
            margin-bottom 10px
</style>

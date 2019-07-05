<template>
    <div class="reputation">
        <ul>
            <li>用户账号：{{username}}</li>
            <li>用户类型：{{userType}}</li>
            <li>
                信用额度：
                <InputNumber
                    size="small"
                    :max="Number(parentCreditavailable)"
                    :min="0"
                    v-model="credit"
                ></InputNumber>
                <span>可回收余额{{creditavailable}}</span>
                <span>上级余额{{parentCreditavailable}}</span>
            </li>
            <li>
                上级占成：
                <InputNumber
                    :formatter="value => `${value}%`"
                    :parser="value => value.replace('%', '')"
                    size="small"
                    :max="Number(parentMaxRate)"
                    :min="0"
                    v-model="parentProxyRate"
                ></InputNumber>
                <span>最高可设置占成{{parentMaxRate}}%</span>
            </li>
            <li>
                代理占成上线
                <RadioGroup v-model="rMaxRate">
                    <Radio label="0">代理任占</Radio>
                    <Radio label="1">限制成数</Radio>
                    <InputNumber
                        v-if="rMaxRate==1"
                        size="small"
                        :max="100"
                        :min="Number(limitMinRate)"
                        :formatter="value => `${value}%`"
                        :parser="value => value.replace('%', '')"
                        v-model="limitMaxRate"
                    ></InputNumber>
                </RadioGroup>
            </li>
            <li>
                <Button @click="handleSubmit" type="primary">设置</Button>
            </li>
        </ul>
    </div>
</template>

<script>
import { InputNumber, RadioGroup, Radio, Button } from 'iview'
import { setcredit } from '@/api/index'
export default {
    name: 'reputitation',
    props: ['uid'],
    data() {
        return {
            credit: 0, //信誉额度
            rMaxRate: '0', //代理占成上限 0-代理占成 1-限制成数
            username: '', //用户账号
            userType: '', //用户类型
            creditavailable: '', //可回收余额
            parentCreditavailable: '', //上级余额
            parentProxyRate: 0, //目前上级占成
            parentMaxRate: '', //最高可以设置占成
            maxRate: '', //代理占成上限
            limitMaxRate: 0, //目前代理设置的限制成数
            limitMinRate: '' //最低限制成数
        }
    },
    mounted() {
        //获取信誉设置
        setcredit({ uid: this.uid }).then(res => {
            this.username = res.data.rows.username //用户名
            if (res.data.rows.parentid == 0) {
                this.userType = '总代'
            } else {
                this.userType = res.data.rows.usertype == 1 ? '代理' : '会员'
            }
            this.creditavailable = res.data.rows.creditavailable
            this.parentCreditavailable = res.data.parentCredit.creditavailable
            this.parentProxyRate = Number(res.data.rows.proxy_rate)
            this.parentMaxRate = res.data.max_rate
            this.maxRate = res.data.rows.limit_max_rate
            this.rMaxRate = res.data.rows.limit_max_rate == 100 ? '0' : '1'
            this.limitMaxRate = Number(res.data.rows.limit_max_rate)
            this.limitMinRate = res.data.limitMaxRate_Min
        })
    },
    methods: {
        handleSubmit() {
            setcredit({
                uid: this.uid,
                flag: 'save',
                credit: this.credit,
                proxy_rate: this.parentProxyRate,
                rMaxRate: this.rMaxRate,
                limit_max_rate: this.rMaxRate ? this.limitMaxRate : 100
            }).then(res => {
                console.log(res.data)
            })
        }
    },
    components: {
        InputNumber,
        RadioGroup,
        Radio,
        Button
    }
}
</script>

<style lang="stylus" scoped></style>

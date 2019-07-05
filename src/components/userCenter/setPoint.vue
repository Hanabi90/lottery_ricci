<template>
    <div class="setPoint">
        <div class="list">
            <span>用户名：{{userName}}</span>
            <span>用户昵称：{{nickName}}</span>
            <span>奖金限额：{{limitBonues}}</span>
        </div>
        <span>奖金组</span>
        <span style="margin-left:20px" v-if="min==max">{{max}}</span>
        <Slider
            v-if="min!=max"
            :min="Number(min)"
            :max="Number(max)"
            v-model="bonues"
            :active-change="false"
            show-input
        ></Slider>
        <Button v-if="min!=max" type="primary" @click="handleSetPoint">提交</Button>
    </div>
</template>

<script>
import { setpoints } from '@/api/index'
import { Slider, Button } from 'iview'
export default {
    name: 'setPoint',
    props: ['uid'],
    data() {
        return {
            bonues: 0,
            dataList: ''
        }
    },
    computed: {
        userName() {
            if (this.dataList) {
                return this.dataList.user.username
            } else {
                return ''
            }
        },
        nickName() {
            if (this.dataList) {
                return this.dataList.user.nickname
            } else {
                return ''
            }
        },
        limitBonues() {
            if (this.dataList) {
                return this.dataList.user.limitbons
            } else {
                return ''
            }
        },
        min: {
            get: function() {
                if (this.dataList) {
                    return this.dataList.minodds
                } else {
                    return ''
                }
            },
            set: function(value) {
                this.dataList.minodds = value
            }
        },
        max() {
            if (this.dataList) {
                return this.dataList.maxodds
            } else {
                return ''
            }
        }
    },
    methods: {
        handleSetPoint() {
            setpoints({
                flag: 'save',
                uid: this.uid,
                onekeyodds: this.bonues
            }).then(res => {
                this.min = this.bonues
                this.$Message.success(res.msg)
            })
        }
    },
    mounted() {
        if (this.uid) {
            setpoints({ uid: this.uid }).then(res => {
                this.dataList = res.data
                this.bonues = Number(res.data.maxodds)
            })
        }
    },
    components: {
        Slider,
        Button
    }
}
</script>

<style lang="stylus" scoped>
.setPoint
    padding 20px
    .list
        margin-bottom 30px
        span
            margin-right 20px
</style>

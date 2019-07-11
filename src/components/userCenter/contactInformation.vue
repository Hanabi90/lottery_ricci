<template>
    <div>
        <Card
            v-for="(item,index) of listData"
            :key="index"
            style="width:270px;float:left;margin-right:20px"
        >
            <p slot="title">{{item.title}}</p>
            <a
                href="#"
                slot="extra"
                @click.prevent="item.content?'':handleSubmit(index)"
            >{{item.content?item.content:'绑定'}}</a>
            <div v-show="!item.content">
                <Input
                    type="text"
                    v-model="formInline[index].one"
                    placeholder="用输入内容"
                    style="margin-bottom:10px"
                ></Input>

                <Input type="text" v-model="formInline[index].oneMore" placeholder="请再次确认"></Input>
            </div>
            <div v-show="item.content">
                <p>绑定时间：{{item.atime}}</p>
                <p>修改时间：{{item.utime}}</p>
            </div>
        </Card>
    </div>
</template>

<script>
import { Card, Input } from 'iview'
import { getemailbindlist, setemailbind } from '@/api/index'
export default {
    name: 'acontactInformation',
    data() {
        return {
            formInline: [
                {
                    one: '',
                    oneMore: ''
                },
                {
                    one: '',
                    oneMore: ''
                },
                {
                    one: '',
                    oneMore: ''
                },
                {
                    one: '',
                    oneMore: ''
                }
            ],
            listData: [
                //联系类别id:1=邮箱,2=手机,3=QQ号,4=微信号
                {
                    title: '邮箱'
                },
                {
                    title: '手机'
                },
                {
                    title: 'QQ'
                },
                {
                    title: '微信号'
                }
            ]
        }
    },
    methods: {
        handleSubmit(index) {
            if (!this.formInline[index].one) {
                this.$Message.error('输入的内容不能为空')
                return
            }
            if (this.formInline[index].one != this.formInline[index].oneMore) {
                this.$Message.error('两次输入的内容不一致')
                return
            }
            setemailbind({
                typeid: index + 1,
                content: this.formInline[index].one
            }).then(res => {
                this.$Message.success('res.data.msg')
                for (const element in res.data[0]) {
                    this.$set(
                        this.listData[res.data[0].type_id - 1],
                        element,
                        res.data[0][element]
                    )
                }
            })
        }
    },
    mounted() {
        getemailbindlist().then(res => {
            if (res.data.bindlist.length) {
                res.data.bindlist.forEach(item => {
                    for (const element in item) {
                        this.$set(
                            this.listData[item.type_id - 1],
                            element,
                            item[element]
                        )
                    }
                })
            }
        })
    },
    components: {
        Card,
        Input
    }
}
</script>

<style lang="stylus" scoped></style>

<template>
    <div class="information">
        <Menu mode="horizontal" active-name="1" @on-select="changeContent">
            <MenuItem name="1">收到的消息</MenuItem>
            <MenuItem name="2">发出的消息</MenuItem>
            <MenuItem name="3">给下级发消息</MenuItem>
            <MenuItem name="4">给上级发消息</MenuItem>
        </Menu>
        <div v-show="navIndex==1" class="content" style="padding:10px">
            <div style="margin-bottom:10px">
                <Checkbox @on-change="handleAll" v-model="all">全部</Checkbox>
                <Button @click="handleDelete" size="small" type="error">删除</Button>
            </div>
            <Collapse v-model="activeIndex" accordion @on-change="handleContent">
                <Panel
                    :style="{'fontSize':'12px',}"
                    v-for="(item,value) of list"
                    :key="value"
                    :name="`${value}`"
                    hide-arrow
                >
                    <span
                        class="box"
                        :class="{active:item.active}"
                        @click.stop="handleActive(item)"
                    ></span>
                    {{item.subject}}
                    {{`(${item.sendtime})`}}
                    <span
                        v-if="!item.readtime"
                        style="color:#fff;background-color:#ff0000;padding:0 4px;border-radius:3px"
                    >{{item.readtime?"":"未读"}}</span>
                    <p class="listContent" slot="content">
                        {{item.content}}
                        <button
                            style="position:absolute;right:0;bottom:0;"
                            v-if="(item.msgtypeid==3||item.msgtypeid==5)&&item.isreplay==0"
                            class="ivu-btn ivu-btn-primary ivu-btn-small"
                            @click="openReply"
                        >{{(item.msgtypeid==3||item.msgtypeid==5)&&item.isreplay==0?"回复":''}}</button>
                    </p>
                </Panel>
            </Collapse>
        </div>
        <div v-show="navIndex==2" class="content" style="padding:10px">
            <div style="margin-bottom:10px">
                <Checkbox @on-change="handleAll" v-model="all">全部</Checkbox>
                <Button @click="handleDelete" size="small" type="error">删除</Button>
            </div>
            <Scroll :on-reach-bottom="handleReachBottom" :distance-to-edge="-10" height="440">
                <Collapse v-model="activeIndex" accordion @on-change="handleSendContent">
                    <Panel
                        :style="{'fontSize':'12px',}"
                        v-for="(item,value) of messageSendList"
                        :key="value"
                        :name="`${value}`"
                        hide-arrow
                    >
                        <span
                            class="box"
                            :class="{active:item.active}"
                            @click.stop="handleActive(item)"
                        ></span>
                        {{item.subject}}
                        {{`(${item.sendtime})`}}
                        <span
                            v-if="!item.readtime"
                            style="color:#fff;background-color:#ff0000;padding:0 4px;border-radius:3px"
                        >{{item.readtime?"":"未读"}}</span>
                        <p slot="content">{{item.content}}</p>
                    </Panel>
                </Collapse>
            </Scroll>
        </div>
        <div v-show="navIndex==3" class="content" style="padding:10px">
            <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="60">
                <FormItem prop="childid" label="下级用户">
                    <Select v-model="formInline.childid">
                        <Option
                            v-for="item of childList"
                            :key="item.userid"
                            :value="item.userid"
                        >{{item.username}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="subject" label="信息标题">
                    <Input type="text" v-model="formInline.subject" placeholder="请输入标题"/>
                </FormItem>
                <FormItem prop="content" label="消息内容">
                    <Input
                        v-model="formInline.content"
                        type="textarea"
                        :autosize="{minRows: 2,maxRows: 5}"
                        placeholder="请输入内容"
                    ></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('formInline')">发送</Button>
                    <Button style="margin-left:20px" type="primary" @click="handleInit">重置</Button>
                </FormItem>
            </Form>
        </div>
        <div v-show="navIndex==4" class="content" style="padding:10px">
            <Form ref="parentsLine" :model="parentsLine" :rules="ruleParents" :label-width="60">
                <FormItem prop="subject" label="信息标题">
                    <Input type="text" v-model="parentsLine.subject" placeholder="请输入标题"/>
                </FormItem>
                <FormItem prop="content" label="消息内容">
                    <Input
                        v-model="parentsLine.content"
                        type="textarea"
                        :autosize="{minRows: 2,maxRows: 5}"
                        placeholder="请输入内容"
                    ></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmitLine('parentsLine')">发送</Button>
                    <Button style="margin-left:20px" type="primary" @click="handleParentsLine">重置</Button>
                </FormItem>
            </Form>
        </div>
        <div class="reply" v-if="replyOnoff">
            <Form
                class="content"
                ref="replyLine"
                :model="replyLine"
                :rules="ruleReplyLine"
                :label-width="60"
            >
                <Icon @click="close" class="close" type="md-close-circle"/>
                <FormItem prop="subject" label="信息标题">
                    <Input type="text" v-model="replyLine.subject" placeholder="请输入标题"/>
                </FormItem>
                <FormItem prop="content" label="消息内容">
                    <Input
                        v-model="replyLine.content"
                        type="textarea"
                        :autosize="{minRows: 2,maxRows: 5}"
                        placeholder="请输入内容"
                    ></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleReply('replyLine')">发送</Button>
                    <Button style="margin-left:20px" type="primary" @click="handleInitReply">重置</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script>
import {
    getmessage,
    getmessagecontent,
    deletemessage,
    getSendMessage,
    getchildlist,
    sendmessagetochild,
    messagereply,
    sendmessagetoparent,
    getunreadmessageamount
} from '@/api/index'
import {
    Menu,
    MenuItem,
    Checkbox,
    Button,
    Collapse,
    Panel,
    Form,
    FormItem,
    Input,
    Select,
    Option,
    Icon,
    Scroll
} from 'iview'
export default {
    name: 'information',
    data() {
        return {
            messageSetting: {
                //收到的消息
                flag: 'recieve', //类型
                pn: 18, //数量
                p: 1 //页数
            },
            messageSendSetting: {
                //发送的消息
                flag: 'send', //类型
                pn: 18, //数量
                p: 1 //页数
            },
            all: '',
            list: [],
            navIndex: 1,
            activeIndex: '0',
            formInline: {
                subject: '',
                childid: '',
                content: ''
            },
            ruleInline: {
                subject: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }
                ],
                childid: [
                    {
                        required: true,
                        message: '请选择下级',
                        trigger: 'change'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ]
            },
            replyLine: {
                subject: '',
                content: ''
            },
            ruleReplyLine: {
                subject: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ]
            },
            parentsLine: {
                subject: '',
                content: ''
            },
            ruleParents: {
                subject: [
                    {
                        required: true,
                        message: '请输入标题',
                        trigger: 'blur'
                    }
                ],
                content: [
                    {
                        required: true,
                        message: '请输入内容',
                        trigger: 'blur'
                    }
                ]
            },
            childList: [],
            messageSendList: [],
            replyOnoff: false,
            sendPage: 2,
            getPage: 2
        }
    },
    methods: {
        handleReachBottom() {
            let setList =
                this.navIndex == 2
                    ? this.messageSendSetting
                    : this.messageSetting
            let page = this.navIndex == 2 ? this.sendPage : this.getPage
            if (setList.p < page) {
                return new Promise(resolve => {
                    this.$set(setList, 'p', setList.p + 1)
                    if (this.navIndex == 2) {
                        getSendMessage({ ...setList }).then(res => {
                            res.data.page_data.forEach(item => {
                                item.active = false
                                item.content = '加载中。。。'
                            })
                            this.messageSendList = [
                                ...this.messageSendList,
                                ...res.data.page_data
                            ]
                        })
                    } else {
                        getmessage(this.messageSetting).then(res => {
                            res.data.page_data.forEach(item => {
                                item.active = false
                                item.content = '加载中。。。'
                            })
                            this.list = [...this.list, ...res.data.page_data]
                        })
                    }
                    resolve()
                })
            }
        },
        openReply() {
            this.replyOnoff = true
        },
        close() {
            this.replyOnoff = false
        },
        handleActive(item) {
            this.$set(item, 'active', !item.active)
        },
        handleAll(value) {
            if (this.navIndex == 1) {
                this.list.forEach(item => {
                    this.$set(item, 'active', value)
                })
            } else {
                this.messageSendList.forEach(item => {
                    this.$set(item, 'active', value)
                })
            }
        },
        //获取收到的消息
        handleContent(value) {
            if (value[0] && this.list[value[0]].content == '加载中。。。') {
                getmessagecontent({ entry: this.list[value[0]].entry }).then(
                    res => {
                        this.$set(
                            this.list[value[0]],
                            'content',
                            res.data.mes.content
                        )
                        //已读数量减1
                        if (!this.list[value[0]].readtime) {
                            this.$store.dispatch(
                                'handleUnReadAmount',
                                res.data.unreadamount
                            )
                        }
                        //设置为已读·
                        this.$set(this.list[value[0]], 'readtime', 1)
                    }
                )
            }
        },
        handleSendContent(value) {
            if (
                value[0] &&
                this.messageSendList[value[0]].content == '加载中。。。'
            ) {
                getmessagecontent({
                    entry: this.messageSendList[value[0]].entry
                }).then(res => {
                    this.$set(
                        this.messageSendList[value[0]],
                        'content',
                        res.data.mes.content
                    )
                    this.$set(this.messageSendList[value[0]], 'readtime', 1)
                })
            }
        },
        handleDelete() {
            let arr = [], //拿到药删除的id
                arrIndex = [], //拿到药删除的对象的下标
                dataList =
                    this.navIndex == 1
                        ? [...this.list]
                        : [...this.messageSendList]
            console.log(dataList)

            dataList.forEach((item, index) => {
                item.active && arr.push(item.entry) && arrIndex.push(index)
            })
            if (arr.length) {
                //是否有选中删除的对象
                deletemessage({
                    flag: this.navIndex == 1 ? 'receiveuser' : 'senduser',
                    msgid: arr
                }).then(res => {
                    arrIndex.forEach(item => {
                        dataList.splice(item, 1)
                    })
                    this.navIndex == 1
                        ? (this.list = [...dataList])
                        : (this.messageSendList = [...dataList])
                    this.activeIndex = ''
                })
            } else {
                this.$Message.error('请选择要删除的信息')
            }
        },
        //切换
        changeContent(name) {
            this.navIndex = name
            this.activeIndex = ''
            this.all = false
            if (name == 1) {
                this.messageSetting = {
                    //收到的消息
                    flag: 'recieve', //类型
                    pn: 18, //数量
                    p: 1 //页数
                }
                getunreadmessageamount().then(res => {
                    this.$store.dispatch(
                        'handleUnReadAmount',
                        res.data.unreadamount
                    )
                })
                getmessage(this.messageSetting).then(res => {
                    res.data.page_data.forEach(item => {
                        item.active = false
                        item.content = '加载中。。。'
                    })
                    this.getPage = Math.ceil(
                        res.data.total_count / res.data.page_size
                    )
                    this.list = [...res.data.page_data]
                })
            }
            if (name == 2) {
                this.messageSendSetting = {
                    //发送的消息
                    flag: 'send', //类型
                    pn: 18, //数量
                    p: 1 //页数
                }
                getSendMessage(this.messageSendSetting).then(res => {
                    res.data.page_data.forEach(item => {
                        item.active = false
                        item.content = '加载中。。。'
                    })
                    this.sendPage = Math.ceil(
                        res.data.total_count / res.data.page_size
                    )
                    this.messageSendList = [...res.data.page_data]
                })
            }
            if (name == 3) {
                getchildlist().then(res => {
                    console.log(res)
                    this.childList = [...res.data]
                })
            }
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    sendmessagetochild(this.formInline).then(res => {
                        this.$Message.success('消息已成功发送!')
                        this.formInline = {
                            subject: '',
                            childid: this.formInline.childid,
                            content: ''
                        }
                    })
                } else {
                    this.$Message.error('信息输入不完整!')
                }
            })
        },
        handleReply(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    messagereply({
                        entry: this.list[this.activeIndex].entry,
                        receiverid: this.list[this.activeIndex].senderid,
                        id: this.list[this.activeIndex].entry,
                        ...this.replyLine
                    }).then(res => {
                        this.$Message.success('消息已成功发送!')
                        this.replyLine = {
                            subject: '',
                            content: ''
                        }
                        this.replyOnoff = false
                    })
                } else {
                    this.$Message.error('信息输入不完整!')
                }
            })
        },
        handleSubmitLine(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    sendmessagetoparent({
                        ...this.parentsLine
                    }).then(res => {
                        this.$Message.success('消息已成功发送!')
                        this.replyLine = {
                            subject: '',
                            content: ''
                        }
                        this.replyOnoff = false
                    })
                } else {
                    this.$Message.error('信息输入不完整!')
                }
            })
        },
        handleInit() {
            this.formInline = {
                subject: '',
                childid: this.formInline.childid,
                content: ''
            }
        },
        handleInitReply() {
            this.replyLine = {
                subject: '',
                content: ''
            }
        },
        handleParentsLine() {
            this.parentsLine = {
                subject: '',
                content: ''
            }
        }
    },
    mounted() {
        getmessage(this.messageSetting).then(res => {
            res.data.page_data.forEach(item => {
                item.active = false
                item.content = '加载中。。。'
            })
            this.list = [...res.data.page_data]
        })
    },
    components: {
        Menu,
        MenuItem,
        Checkbox,
        Button,
        Collapse,
        Panel,
        Form,
        FormItem,
        Input,
        Select,
        Option,
        Icon,
        Scroll
    }
}
</script>

<style lang="stylus" scoped>
.information
    position relative
    .reply
        position absolute
        z-index 100
        top 60px
        width 100%
        height 100%
        border 1px solid #dcdcdc
        border-radius 3px
        background rgba(0, 0, 0, 0.2)
        display flex
        align-items center
        justify-content center
        .content
            width 400px
            height 300px
            padding 20px
            background #fff
            position relative
            overflow hidden
.content
    background #f2f2f2
    height 500px
    overflow-y auto
    .box
        display inline-block
        width 15px
        height 15px
        border 1px solid #ccc
        border-radius 3px
        vertical-align middle
        margin-right 3px
        &.active
            background #2d8cf0
            border 1px solid #2d8cf0
            position relative
            &::before
                content '√'
                position absolute
                width 15px
                height 15px
                left 2px
                top -12px
                color #fff
    .listContent
        position relative
.close
    font-size 20px
    position absolute
    right 0
    top 0
</style>

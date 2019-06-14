<template>
    <div class="lotteryNumber">
        <div class="numberTitle">
            <h5>{{methodList.title}}：{{methodList.name}}</h5>
            <p class="switcher">
                <span
                    :class="value==switcherNow?'active':''"
                    v-for=" (item,value) of switcher"
                    :key="value"
                    @click="change(value)"
                >{{value}}</span>
            </p>
            <p class="switcherList">
                <span
                    :class="value==0?'activeList':''"
                    v-for="(item,value) of switcher[switcherNow]"
                    :key="item"
                >{{item}}</span>
            </p>
            <div>
                <p>
                    <Tooltip transfer max-width="300" :content="methodList.methoddesc">
                        <i></i>
                        <span>说明</span>
                    </Tooltip>
                </p>
                <p>
                    <Tooltip transfer max-width="300" :content="methodList.methodexample">
                        <i></i>
                        <span>示例</span>
                    </Tooltip>
                </p>
                <p>
                    <Tooltip transfer max-width="300" :content="methodList.methodhelp">
                        <i></i>
                        <span>帮助</span>
                    </Tooltip>
                </p>
                <p>
                    <button>经典版</button>
                </p>
            </div>
        </div>
        <ul class="number_container">
            <li v-if="quickUpload.has(methodList.name)" class="listSingle">
                <p style="margin-bottom:10px" v-if="getTitle">
                    <span style="margin-right:25px;font-size:14px">位置</span>
                    <Checkbox
                        v-for="(item,index) of lotteryPosition"
                        :key="index"
                        v-model="lotteryPosition[index].value"
                    >{{item.text}}</Checkbox>
                    <i>{{methodList.methoddesc}}</i>
                </p>
                <div>
                    <Input
                        class="textContent"
                        type="textarea"
                        placeholder="请输入号码..."
                        v-model="singleList"
                        :autosize="{minRows:10,maxRows:10}"
                    ></Input>
                </div>
                <div>
                    <Button type="warning" icon="ios-nuclear">删除重复号码</Button>
                    <Upload action :before-upload="handleUpload" :show-upload-list="false">
                        <Button type="warning" icon="ios-cloud-upload-outline">导入文件</Button>
                    </Upload>
                    <Button @click="handleClear" type="warning" icon="ios-trash">清空</Button>
                </div>
            </li>
            <!-- 五组 -->
            <li v-else v-for="(item,index) of getLayout" :key="index">
                <p style="margin-bottom:10px" v-if="getTitle&&index==0">
                    <span style="margin-right:25px;font-size:14px">位置</span>
                    <Checkbox
                        v-for="(item,index) of lotteryPosition"
                        :key="index"
                        v-model="lotteryPosition[index].value"
                    >{{item.text}}</Checkbox>
                    <i>{{methodList.methoddesc}}</i>
                </p>
                <div class="list">
                    <h5>{{item.title}}</h5>
                    <div>
                        <span
                            @click="chosenNumber(number,index,$event)"
                            v-for="number of item.no"
                            :key="number"
                            :class="{'active':activeClass(number,index)}"
                        >{{number}}</span>
                    </div>
                    <div ref="typeList" v-if="quickChosen()">
                        <span
                            @click="chosenType(lable,index,$event)"
                            v-for="lable of getLabel()"
                            :key="lable"
                            ref="numberType"
                        >{{lable}}</span>
                    </div>
                </div>
                <!-- <div class="supplement">
                    <h5>{{switcherNow}}</h5>
                    <div>
                        <span v-for="supple of item[switcherNow]" :key="supple">{{supple}}</span>
                    </div>
                </div>-->
                <div v-if="methodList.name=='特殊号'||methodList.title=='龙虎和'" class="supplement">
                    <h5>奖金</h5>
                    <div>
                        <span v-for="supple of prizeList" :key="supple">{{supple}}</span>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import { Tooltip, Input, Upload, Button, Checkbox } from 'iview'
export default {
    name: 'lotteryNumber',
    props: {
        methodList: {
            type: Object,
            default: function() {
                return {
                    methodname: '',
                    selectarea: {}
                }
            }
        },
        order: {}
    },
    data() {
        return {
            file: null,
            loadingStatus: false,
            label: ['全', '大', '小', '奇', '偶', '清'],
            labelTwo: ['全', '清'],
            switcher: {
                遗漏: ['当前遗漏', '最大遗漏'],
                冷热: ['30期', '50期', '100期']
            },
            switcherNow: '遗漏',
            activeGroup: [
                new Set([]),
                new Set([]),
                new Set([]),
                new Set([]),
                new Set([])
            ],
            quickDontShow: new Set(['QZUHZ', 'Q3BD', 'QZXHZ']), //不显示快捷选好
            quickUpload: new Set([
                '单式',
                '混合',
                '组三单式',
                '组六单式',
                '前三直选单式',
                '前三组选单式'
            ]), //是否显示单式玩法
            singleList: '', //单式内容
            lotteryPosition: {
                0: { text: '万位', value: false },
                1: { text: '千位', value: false },
                2: { text: '百位', value: false },
                3: { text: '十位', value: false },
                4: { text: '个位', value: false }
            }
        }
    },
    computed: {
        getTitle() {
            let groupTitle
            if (this.methodList) {
                groupTitle = this.methodList.title + this.methodList.name
            }

            if (
                groupTitle == '任四直选单式' ||
                groupTitle == '任三直选单式' ||
                groupTitle == '任三组选单式' ||
                groupTitle == '任二直选单式' ||
                groupTitle == '任二组选单式' ||
                groupTitle == '任四组选组选24' ||
                groupTitle == '任四组选组选12' ||
                groupTitle == '任四组选组选6' ||
                groupTitle == '任四组选组选4' ||
                groupTitle == '任三直选和值' ||
                groupTitle == '任三组选组三复式' ||
                groupTitle == '任三组选组三单式' ||
                groupTitle == '任三组选组六复式' ||
                groupTitle == '任三组选组六单式' ||
                groupTitle == '任三组选混合' ||
                groupTitle == '任三组选和值' ||
                groupTitle == '任二直选和值' ||
                groupTitle == '任二组选复式' ||
                groupTitle == '任二组选和值'
            ) {
                return true
            } else {
                return false
            }
        },
        prizeList() {
            return this.order.bonus.prize
        },
        getLayout() {
            let list
            if (
                this.methodList.selectarea &&
                this.methodList.selectarea.layout
            ) {
                list = JSON.parse(
                    JSON.stringify(this.methodList.selectarea.layout)
                )
                list.forEach(item => {
                    item.no = item.no.split('|')
                })
            }
            return list
        },
        handleSingleList() {
            let codes = [],
                reg = /[^\d,，;；\n\s*]/g,
                leg = 0,
                title = this.methodList.title + this.methodList.name
            if (title == '五星直选单式') {
                leg = 5
            }
            if (title == '四星直选单式' || title == '任四直选单式') {
                leg = 4
            }
            if (
                title == '前三直选单式' ||
                title == '前三组选混合' ||
                title == '中三直选单式' ||
                title == '中三组选混合' ||
                title == '后三直选单式' ||
                title == '后三组选混合' ||
                title == '任三直选单式' ||
                title == '任三组选组三单式' ||
                title == '任三组选组六单式' ||
                title == '任三组选混合' ||
                title == '三码前三直选单式'
            ) {
                leg = 3
            }
            if (
                title == '前二直选单式' ||
                title == '前二组选单式' ||
                title == '后二直选单式' ||
                title == '后二组选单式' ||
                title == '任二直选单式' ||
                title == '任二组选单式'
            ) {
                leg = 2
            }
            if (this.singleList) {
                codes = new Set([
                    ...this.foo3(this.singleList.replace(reg, ''))
                ])
                for (const element of codes.values()) {
                    if (element.length != leg) {
                        codes.delete(element)
                    }
                }
                codes = Array.from(codes)
                if (
                    title == '前三组选混合' ||
                    title == '中三组选混合' ||
                    title == '后三组选混合'
                ) {
                    let arr = []
                    codes.forEach(item => {
                        let element = item.split('')
                        if (
                            element[0] +
                                element[1] -
                                (element[0] + element[2]) !=
                            0
                        ) {
                            arr.push(item)
                        }
                    })
                    codes = arr
                }
                if (title == '前二组选单式' || title == '后二组选单式') {
                    let arr = []
                    codes.forEach(item => {
                        let element = item.split('')
                        if (element[0] != element[1]) {
                            arr.push(item)
                        }
                    })
                    codes = arr
                }
                if (title == '任二组选单式') {
                    let arr = []
                    codes.forEach(item => {
                        let element = item.split('')
                        if (element[0] != element[1]) {
                            arr.push([element[0], element[1]])
                        }
                    })

                    codes = Array.from(
                        new Set(
                            arr.map(item => item.sort((a, b) => a - b).join(''))
                        )
                    )
                }
                if (title == '任三组选组三单式') {
                    codes = new Set([
                        ...this.foo3(this.singleList.replace(reg, ''))
                    ])
                    for (const element of codes.values()) {
                        if (element.length != leg) {
                            codes.delete(element)
                        } else {
                            let repeatArr = new Set([...element.split('')])
                            if (repeatArr.size != 2) {
                                codes.delete(element)
                            }
                        }
                    }
                    codes = Array.from(codes)
                }
                if (title == '任三组选组六单式') {
                    codes = new Set([
                        ...this.foo3(this.singleList.replace(reg, ''))
                    ])
                    for (const element of codes.values()) {
                        if (element.length != leg) {
                            codes.delete(element)
                        } else {
                            let repeatArr = new Set([...element.split('')])
                            if (repeatArr.size == 2) {
                                codes.delete(element)
                            }
                        }
                    }
                    codes = Array.from(codes)
                }
                if (
                    title == '三码前三直选单式' ||
                    title == '三码前三组选单式'
                ) {
                    let arr = [], //存放数据
                        repeatArr = new Set()
                    codes = new Set([
                        ...this.foo11(this.singleList.replace(reg, ''))
                    ])
                    for (const item of codes.values()) {
                        item = item.split(/[\s+]/g)
                        const bool = item.every(item => {
                            if (item.length == 2) {
                                if (item[0] == 0) {
                                    return true
                                }
                                if (item[0] == 1 && item[1] <= 1) {
                                    return true
                                }
                            }
                        })
                        if (
                            item.length == 3 &&
                            bool &&
                            item[0] != item[1] &&
                            item[0] != item[2]
                        ) {
                            arr.push(item)
                        }
                    }
                    if (title == '三码前三组选单式') {
                        arr.forEach(item =>
                            repeatArr.add(item.sort((a, b) => a - b).join(','))
                        )
                        codes = Array.from(repeatArr).map(item =>
                            item.split(',')
                        )
                    } else {
                        codes = arr
                    }
                }
            }
            return codes
        }
    },
    watch: {
        singleList() {
            this.$store.commit('lotteryNumber', {
                list: this.handleSingleList,
                methods: this.methodList.title + this.methodList.name,
                type: this.methodList.selectarea.type
            })
        }
    },
    methods: {
        //分组
        foo3(str) {
            var temp = str.split(/[\n\s+,，；;]/g)
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] == '') {
                    // 删除数组中空值
                    temp.splice(i, 1)
                    i--
                }
            }
            return temp
        },
        //不带空格
        foo11(str) {
            var temp = str.split(/[\n+,，；;]/g)
            for (var i = 0; i < temp.length; i++) {
                if (temp[i] == '') {
                    // 删除数组中空值
                    temp.splice(i, 1)
                    i--
                }
            }
            return temp
        },
        //重置
        reset() {
            Object.assign(this.$data, this.$options.data())
            this.$refs.numberType.className = ''
            this.$refs.numberType.forEach(item => {
                item.className = ''
            })
        },
        //清空单式
        handleClear() {
            this.singleList = ''
        },
        getLabel() {
            switch (this.methodList.title) {
                case '三星大小单双':
                case '二星大小单双':
                case '龙虎和':
                    return this.labelTwo
                default:
                    return this.label
            }
        },
        activeClass(number, index) {
            return this.activeGroup[index].has(number)
        },
        handleUpload(file) {
            let reader = new FileReader(),
                that = this
            reader.readAsText(file, 'gb2312')
            reader.onload = function(e) {
                that.textContent = this.result
            }
        },
        quickChosen() {
            return !this.quickDontShow.has(this.methodList.methodname)
        },
        change(item) {
            this.switcherNow = item
        },
        chosenNumber(number, index, $event) {
            //去除快捷选取的激活样式
            let e = window.event || $event

            if (!this.methodList.name == '和值') {
                this.$refs.typeList[index]
                    .querySelectorAll('span')
                    .forEach(item => (item.className = ''))
            }
            if (this.methodList.name == '包胆') {
                this.activeGroup[index].clear()
            }
            if (this.activeGroup[index].has(number)) {
                //添加样式 添加选好
                this.activeGroup[index].delete(number)
            } else {
                this.activeGroup[index].add(number)
            }
            this.$set(this.activeGroup, index, this.activeGroup[index])
            this.$store.dispatch('handleLotteryNumber', {
                list: this.activeGroup,
                methods: this.methodList.title + this.methodList.name,
                title: this.methodList.title,
                name: this.methodList.name,
                type: this.methodList.selectarea.type
            })
        },
        chosenType(lable, index, $event) {
            let e = window.event || $event

            if (!this.methodList.name == '和值') {
                this.$refs.typeList[index]
                    .querySelectorAll('span')
                    .forEach(item => (item.className = ''))
            }

            if (e.target.className == 'active') {
                e.target.className = ''
            } else {
                e.target.className = 'active'
            }
            //清空
            this.activeGroup[index].clear()
            let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
            switch (lable) {
                case '全':
                    this.$set(this.activeGroup, index, new Set(arr))
                    break
                case '大':
                    this.$set(
                        this.activeGroup,
                        index,
                        new Set(arr.filter(i => i > 4))
                    )
                    break
                case '小':
                    this.$set(
                        this.activeGroup,
                        index,
                        new Set(arr.filter(i => i < 5))
                    )
                    break
                case '奇':
                    this.$set(
                        this.activeGroup,
                        index,
                        new Set(arr.filter(i => i % 2 != 0))
                    )
                    break
                case '偶':
                    this.$set(
                        this.activeGroup,
                        index,
                        new Set(arr.filter(i => i % 2 === 0))
                    )
                    break
                default:
                    this.$set(this.activeGroup, index, new Set([]))
                    break
            }
            this.$store.dispatch('handleLotteryNumber', {
                list: this.activeGroup,
                methods: this.methodList.title + this.methodList.name,
                type: this.methodList.selectarea.type
            })
        },
        handleActive(index, item) {
            return this.activeGroup[index].some(element => element == item)
        }
    },
    components: {
        Tooltip,
        Input,
        Upload,
        Button,
        Checkbox
    }
}
</script>

<style lang="stylus" scoped>
.lotteryNumber
    min-height 320px
    background url('../../assets/images/ssc-repeat_001.jpg')
    border-bottom 1px solid #1a1a1a
    .numberTitle
        padding 10px 20px
        border-top 1px solid #424242
        overflow hidden
        h5
            float left
            background #ff632c
            color #fff
            padding 4px 10px
            border-radius 3px
            position relative
            &::after
                content ''
                display block
                position absolute
                width 0
                height 0
                border-style solid
                border-width 10px 10px 0 10px
                border-color #ff632c transparent transparent transparent
                bottom -8px
                left calc(50% - 10px)
        .switcher
            display flex
            border-top 1px solid #191919
            border-bottom 1px solid #424242
            border-radius 3px
            background #313131
            float left
            margin-left 20px
            height 26px
            width 100px
            line-height 26px
            color #c4c4c4
            &>span
                flex 1
                text-align center
            &>span.active
                background #ff632c
                color #fff
        .switcherList
            float left
            height 26px
            line-height 26px
            margin-left 10px
            &>span
                margin-right 10px
            &>span.activeList
                color #ff632c
        &>div
            float right
            overflow hidden
            p
                float left
                .ivu-tooltip
                    color #ccc
                    margin-right 16px
                    display inline-block
                    line-height 28px
                    font-size 14px
                i
                    background url('../../assets/images/icon_sm_group.png') no-repeat
                    display inline-block
                    width 17px
                    height 17px
                    margin-bottom -4px
                    margin-right 5px
                button
                    background #a96b94
                    border none
                    padding 4px 10px
                    color #fff
                    border-radius 3px
    .number_container
        padding 0 20px 20px
        li
            margin-top 16px
        .listSingle
            overflow hidden
            &>div
                float left
                button
                    width 150px
                    margin 10px 0
                .textContent
                    width 680px
                    margin-right 16px
        .list
            display flex
            height 30px
            line-height 30px
            font-size 14px
            margin-bottom 10px
            h5
                flex 0.1
            &>div
                flex 1
                display flex
                margin-right 40px
                &:nth-child(3)
                    flex 0.5
                    margin-right 0
                span
                    flex 1
                    background #2b2a2a
                    box-shadow 0 0 0 1.8px #262626, 0 0 4px 0 rgba(255, 255, 255, 0.6), 0 2px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3), inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                    margin-right 8px
                    text-align center
                    &.active
                        background #3f74b5
        .supplement
            overflow hidden
            margin-bottom 10px
            margin-top 4px
            color #777
            h5, div
                float left
            div
                margin-left 27px
                width 521px
                display flex
                span
                    text-align center
                    flex 1
                    margin-right 8px
</style>

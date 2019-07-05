<template>
    <div class="order">
        <div class="order_left">
            <ul>
                <li
                    :class="{'active':unitActive==value}"
                    @click="chosenUnit(item,value)"
                    v-for="(item,value) of modes"
                    :key="item.modeid"
                >{{item.name}}</li>
            </ul>
            <div class="multiple">
                <input v-model="multiple" type="text" />
                <span class="multiple_text">倍</span>
                <div>
                    <span @click="changeMultiple('+')">+</span>
                    <span @click="changeMultiple('-')">-</span>
                </div>
            </div>
        </div>
        <div class="order_right">
            <span>已选</span>
            <span>{{orders}}</span>
            <span>注</span>
            <span>共</span>
            <span>{{money}}</span>
            <span>元</span>
            <span>奖金</span>
            <span>{{bonus.prizeSort?(bonus.prizeSort[0]+'-'+bonus.prizeSort[bonus.prizeSort.length-1]):bonus}}</span>
            <button class="buttonColor" @click="submint">一键投注</button>
            <button @click="addOrder">添加投注</button>
        </div>
    </div>
</template>

<script>
import { getissue, betting } from '@/api/index'
import math from '@/assets/js/lib.js'
import { EventBus } from '@/api/eventBus.js'
export default {
    name: 'order',
    props: {
        methodList: {},
        iWalletType: {},
        methodid: {},
        rebate: {},
        nowPrizeGroup: {},
        lotterynumber: {},
        prize: {},
        modes: {
            default: function() {
                return [
                    {
                        modeid: 1,
                        name: '元',
                        rate: 1
                    }
                ]
            }
        }
    },
    data() {
        return {
            unitActive: 0, //当前
            multiple: 1 //倍数
        }
    },
    computed: {
        //投注单数
        orders() {
            let arr = { ...this.$store.state.lotteryNumber },
                nums = 0
            if (
                arr.methods === '五星直选复式' &&
                arr.list.every(item => item.size > 0)
            ) {
                nums = arr.list.reduce(
                    (preValue, curValue) => preValue * curValue.size,
                    1
                )
            }
            if (
                (arr.methods === '五星直选单式' ||
                    arr.methods === '四星直选单式' ||
                    arr.methods === '前三直选单式' ||
                    arr.methods === '前三组选混合' ||
                    arr.methods === '中三直选单式' ||
                    arr.methods === '中三组选混合' ||
                    arr.methods === '后三直选单式' ||
                    arr.methods === '后三组选混合' ||
                    arr.methods === '前二直选单式' ||
                    arr.methods === '前二组选单式' ||
                    arr.methods === '后二直选单式' ||
                    arr.methods === '后二组选单式' ||
                    arr.methods === '三码前三直选单式' ||
                    arr.methods === '三码前三组选单式' ||
                    arr.methods == '任选单式任选一中一' ||
                    arr.methods == '任选单式任选二中二' ||
                    arr.methods == '任选单式任选三中三' ||
                    arr.methods == '任选单式任选四中四' ||
                    arr.methods == '任选单式任选五中五' ||
                    arr.methods == '任选单式任选六中五' ||
                    arr.methods == '任选单式任选七中五' ||
                    arr.methods == '任选单式任选八中五' ||
                    arr.methods == '直选直选单式' ||
                    arr.methods == '组选混合' ||
                    arr.methods == '二码后二直选单式' ||
                    arr.methods == '二码前二直选单式' ||
                    arr.methods == '二码后二组选单式' ||
                    arr.methods == '二码前二组选单式') &&
                arr.list
            ) {
                nums = arr.list.length
            }
            if (arr.methods === '五星组选组120' && arr.list[0].size >= 5) {
                nums = math.combo(Array.from(arr.list[0]), 5).length
            }
            if (
                arr.methods === '五星组选组60' &&
                arr.list[0].size >= 1 &&
                arr.list[1].size >= 3
            ) {
                for (let item of arr.list[0].values()) {
                    if (arr.list[1].has(item)) {
                        let element = new Set([...arr.list[1]])
                        element.delete(item)
                        nums += math.combo(Array.from(element), 3).length
                    } else {
                        nums += math.combo(Array.from(arr.list[1]), 3).length
                    }
                }
            }
            if (
                arr.methods === '五星组选组30' &&
                arr.list[0].size >= 2 &&
                arr.list[1].size >= 1
            ) {
                for (let item of arr.list[1].values()) {
                    if (arr.list[0].has(item)) {
                        let element = new Set([...arr.list[0]])
                        element.delete(item)
                        nums += math.combo(Array.from(element), 2).length
                    } else {
                        nums += math.combo(Array.from(arr.list[0]), 2).length
                    }
                }
            }
            if (
                arr.methods === '五星组选组20' &&
                arr.list[0].size >= 1 &&
                arr.list[1].size >= 2
            ) {
                for (let item of arr.list[0].values()) {
                    if (arr.list[1].has(item)) {
                        let element = new Set([...arr.list[1]])
                        element.delete(item)
                        nums += math.combo(Array.from(element), 2).length
                    } else {
                        nums += math.combo(Array.from(arr.list[1]), 2).length
                    }
                }
            }
            if (
                (arr.methods === '五星组选组10' ||
                    arr.methods === '五星组选组5' ||
                    (arr.methods === '二码前二直选复式' &&
                        arr.methodname == 'SDZX2')) &&
                arr.list[0].size >= 1 &&
                arr.list[1].size >= 1
            ) {
                for (let item of arr.list[0].values()) {
                    console.log(arr.list)
                    if (arr.list[1].has(item)) {
                        let element = new Set([...arr.list[1]])
                        element.delete(item)
                        nums += element.size
                    } else {
                        nums += arr.list[1].size
                    }
                }
            }

            if (arr.title === '任选胆拖') {
                let leg = 0
                switch (arr.name) {
                    case '任选二中二':
                        leg = 2
                        break
                    case '任选三中三':
                        leg = 3
                        break
                    case '任选四中四':
                        leg = 4
                        break
                    case '任选五中五':
                        leg = 5
                        break
                    case '任选六中五':
                        leg = 6
                        break
                    case '任选七中五':
                        leg = 7
                        break
                    case '任选八中五':
                        leg = 8
                        break
                }
                if (arr.list[0].size >= 1 && arr.list[1].size >= 1) {
                    nums += math.combo(
                        Array.from(arr.list[1]),
                        leg - arr.list[0].size
                    ).length
                }
            }

            if (
                arr.methods === '三码前三直选复式'  &&
                arr.list[0].size >= 1 &&
                arr.list[1].size >= 1 &&
                arr.list[2].size >= 1
            ) {
                for (let i of arr.list[0].values()) {
                    for (let j of arr.list[1].values()) {
                        for (let k of arr.list[2].values()) {
                            if (i != j && i != k && j != k) {
                                nums++
                            }
                        }
                    }
                }
            }
            if (
                arr.methods == '特殊一帆风顺' ||
                arr.methods == '特殊好事成双' ||
                arr.methods == '特殊三星报喜' ||
                arr.methods == '特殊四季发财' ||
                arr.methods == '四星不定位后四一码' ||
                arr.methods == '三星不定位前三一码' ||
                arr.methods == '三星不定位后三一码' ||
                arr.methods == '不定胆前三位' ||
                arr.methods == '不定胆一码不定胆'
            ) {
                nums = arr.list[0].size
            }

            //四星

            if (arr.methods === '四星直选复式') {
                let arrList = [...arr.list]
                arrList.pop()
                if (arrList.every(item => item.size > 0)) {
                    nums = arrList.reduce(
                        (preValue, curValue) => preValue * curValue.size,
                        1
                    )
                }
            }
            //三星
            if (
                arr.methods === '前三直选复式' ||
                arr.methods === '中三直选复式' ||
                arr.methods === '后三直选复式' ||
                arr.methods === '三星大小单双前三' ||
                arr.methods === '三星大小单双后三' ||
                arr.methods === '直选直选复式'
            ) {
                let arrList = []
                for (let index = 0; index < arr.list.length - 2; index++) {
                    arrList.push(arr.list[index])
                }
                if (arrList.every(item => item.size > 0)) {
                    nums = arrList.reduce(
                        (preValue, curValue) => preValue * curValue.size,
                        1
                    )
                }
            }
            if (
                arr.methods === '前二直选复式' ||
                arr.methods === '后二直选复式' ||
                arr.methods === '二星大小单双前二' ||
                arr.methods === '二星大小单双后二' ||
                arr.methods === '二码后二直选复式' ||
                (arr.methods === '二码前二直选复式' &&
                    arr.methodname == 'SSLQZX2')
            ) {
                let arrList = []
                for (let index = 0; index < 2; index++) {
                    arrList.push(arr.list[index])
                }
                if (arrList.every(item => item.size > 0)) {
                    nums = arrList.reduce(
                        (preValue, curValue) => preValue * curValue.size,
                        1
                    )
                }
            }
            if (
                arr.methods === '前三直选和值' ||
                arr.methods === '中三直选和值' ||
                arr.methods === '后三直选和值' ||
                arr.methods === '直选直选和值'
            ) {
                let arrList = []
                for (let index = 0; index < 2; index++) {
                    let count = Array.from(arr.list[index])
                    count.forEach(item => {
                        nums += this.groupList(item)
                    })
                }
            }
            if (
                arr.methods === '前二直选和值' ||
                arr.methods === '后二直选和值' ||
                arr.methods === '冠亚组合和值'
            ) {
                let arrList = []
                for (let index = 0; index < 2; index++) {
                    let count = Array.from(arr.list[index])
                    if (arr.methods == '冠亚组合和值') {
                        count.forEach(item => {
                            nums += this.groupList(item, 2, '冠亚组合和值')
                        })
                    } else {
                        count.forEach(item => {
                            nums += this.groupList(item, 2)
                        })
                    }
                }
            }
            if (arr.methods === '和值和值') {
                let count = Array.from(arr.list[0])
                count.forEach(item => {
                    nums += this.groupList(item, 'k3')
                })
            }
            if (
                arr.methods === '前三直选跨度' ||
                arr.methods === '中三直选跨度' ||
                arr.methods === '后三直选跨度'
            ) {
                let arrList = []
                let count = Array.from(arr.list[0])
                count.forEach(item => {
                    nums += this.handleDifferenceValue(item)
                })
            }
            if (
                arr.methods === '前二直选跨度' ||
                arr.methods === '后二直选跨度'
            ) {
                let arrList = []
                let count = Array.from(arr.list[0])
                count.forEach(item => {
                    nums += this.handleDifferenceValue(item, 2)
                })
            }

            if (
                arr.methods === '前三组选组三复式' ||
                arr.methods === '中三组选组三复式' ||
                arr.methods === '后三组选组三复式' ||
                arr.methods === '组选组三'
            ) {
                nums += this.handleGroup(Array.from(arr.list[0]), 2) * 2
            }
            if (
                arr.methods === '前二组选复式' ||
                arr.methods === '后二组选复式' ||
                arr.methods === '二码前二组选复式' ||
                arr.methods === '二码后二组选复式'
            ) {
                nums += this.handleGroup(Array.from(arr.list[0]), 2)
            }
            if (
                arr.methods === '前三组选组六复式' ||
                arr.methods === '中三组选组六复式' ||
                arr.methods === '后三组选组六复式' ||
                arr.methods === '三码前三组选复式' ||
                arr.methods === '组选组六'
            ) {
                nums += this.handleGroup(Array.from(arr.list[0]), 3)
            }
            if (
                arr.methods === '前三组选和值' ||
                arr.methods === '中三组选和值' ||
                arr.methods === '后三组选和值' ||
                arr.methods === '组选组选和值'
            ) {
                let arrList = []
                for (let index = 0; index < 2; index++) {
                    let count = Array.from(arr.list[index])
                    count.forEach(item => {
                        nums += this.groupSumList(item)
                    })
                }
            }
            if (
                arr.methods === '前二组选和值' ||
                arr.methods === '后二组选和值'
            ) {
                let arrList = []
                for (let index = 0; index < 2; index++) {
                    if (arr.list[index].size) {
                        let count = Array.from(arr.list[index])
                        count.forEach(item => {
                            nums += this.groupSumList(item, 2)
                        })
                    }
                }
            }

            if (
                arr.methods === '前三组选包胆' ||
                arr.methods === '中三组选包胆' ||
                arr.methods === '后三组选包胆'
            ) {
                for (const item of arr.list[0].values()) {
                    nums += this.handleBall()
                }
            }
            if (
                arr.methods === '前二组选包胆' ||
                arr.methods === '后二组选包胆'
            ) {
                for (const item of arr.list[0].values()) {
                    nums += this.handleBall(2)
                }
            }
            if (
                arr.methods == '前三直选和值尾数' ||
                arr.methods == '前三直选特殊号' ||
                arr.methods == '中三直选和值尾数' ||
                arr.methods == '中三直选特殊号' ||
                arr.methods == '后三直选和值尾数' ||
                arr.methods == '后三直选特殊号' ||
                arr.title == '龙虎和' ||
                arr.methods == '趣味型定单双' ||
                arr.methods == '趣味型猜中位' ||
                arr.methods == '任选复式任选一中一' ||
                (arr.title == '和值' && arr.type != 'jsk3') ||
                arr.title == '盘面' ||
                arr.title == '大小单双' ||
                arr.title == '复合' ||
                arr.methods === '定位胆定位胆' ||
                arr.title == '三同号' ||
                arr.title === '二同号' ||
                arr.title == '三不同号' ||
                arr.title == '二不同号' ||
                arr.title == '三连号' ||
                arr.title == '单投一号' ||
                arr.title == '趣味' ||
                arr.title == '排名次' ||
                arr.title == '龙虎'
            ) {
                for (const item of arr.list) {
                    nums += item.size
                }
            }
            if (arr.methods == '冠亚组合大小单双和') {
                for (const item of arr.list[0].values()) {
                    if (item == '和') {
                        nums++
                    } else {
                        nums += 4
                    }
                }
            }
            if (
                (arr.methods === '五星不定位三码' ||
                    arr.methods === '任选复式任选三中三') &&
                arr.list[0].size >= 3
            ) {
                nums = math.combo(Array.from(arr.list[0]), 3).length
            }
            if (
                (arr.methods === '五星不定位二码' ||
                    arr.methods === '四星不定位后四二码' ||
                    arr.methods === '三星不定位前三二码' ||
                    arr.methods === '三星不定位后三二码' ||
                    arr.methods === '任选复式任选二中二') &&
                arr.list[0].size >= 2
            ) {
                nums = math.combo(Array.from(arr.list[0]), 2).length
            }
            if (arr.methods === '任选复式任选四中四' && arr.list[0].size >= 4) {
                nums = math.combo(Array.from(arr.list[0]), 4).length
            }
            if (arr.methods === '任选复式任选五中五' && arr.list[0].size >= 5) {
                nums = math.combo(Array.from(arr.list[0]), 5).length
            }
            if (arr.methods === '任选复式任选六中五' && arr.list[0].size >= 6) {
                nums = math.combo(Array.from(arr.list[0]), 6).length
            }
            if (arr.methods === '任选复式任选七中五' && arr.list[0].size >= 7) {
                nums = math.combo(Array.from(arr.list[0]), 7).length
            }
            if (arr.methods === '任选复式任选八中五' && arr.list[0].size >= 8) {
                nums = math.combo(Array.from(arr.list[0]), 8).length
            }
            if (arr.methods === '任四直选复式') {
                let leg = 0
                for (const item of arr.list) {
                    item.size > 0 && leg++
                }
                if (leg >= 4) {
                    nums = this.handleFree(arr.list, 4)
                }
            }
            if (arr.methods === '任四直选单式') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 4) {
                        nums = leg > 4 ? arr.list.length * 5 : arr.list.length
                    }
                }
            }
            if (arr.methods === '任四组选组选24') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 4) {
                        nums =
                            leg > 4
                                ? math.combo(Array.from(arr.list[0]), 4)
                                      .length * 5
                                : math.combo(Array.from(arr.list[0]), 4).length
                    }
                }
            }
            if (arr.methods === '任四组选组选12') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (
                        arr.list[0].size >= 1 &&
                        arr.list[1].size >= 2 &&
                        leg >= 4
                    ) {
                        let count = 0
                        for (let item of arr.list[0].values()) {
                            if (arr.list[1].has(item)) {
                                let element = new Set([...arr.list[1]])
                                element.delete(item)
                                count += math.combo(Array.from(element), 2)
                                    .length
                            } else {
                                count += math.combo(Array.from(arr.list[1]), 2)
                                    .length
                            }
                        }
                        nums = leg > 4 ? count * 5 : count
                    }
                }
            }
            if (arr.methods === '任四组选组选6') {
                let leg = 0
                for (const key in this.lotterynumber.lotteryPosition) {
                    if (this.lotterynumber.lotteryPosition[key].value) {
                        leg++
                    }
                }
                if (arr.list[0].size >= 2 && leg >= 4) {
                    nums =
                        leg > 4
                            ? math.combo(Array.from(arr.list[0]), 2).length * 5
                            : math.combo(Array.from(arr.list[0]), 2).length
                }
            }
            if (arr.methods === '任四组选组选4') {
                let leg = 0
                for (const key in this.lotterynumber.lotteryPosition) {
                    if (this.lotterynumber.lotteryPosition[key].value) {
                        leg++
                    }
                }
                if (
                    arr.list[0].size >= 1 &&
                    arr.list[1].size >= 1 &&
                    leg >= 4
                ) {
                    let count = 0
                    for (let item of arr.list[0].values()) {
                        if (arr.list[1].has(item)) {
                            let element = new Set([...arr.list[1]])
                            element.delete(item)
                            count += element.size
                        } else {
                            count += arr.list[1].size
                        }
                    }
                    nums = leg > 4 ? count * 5 : count
                }
            }
            if (arr.methods === '任三直选复式') {
                let leg = 0
                for (const item of arr.list) {
                    item.size > 0 && leg++
                }
                if (leg >= 3) {
                    nums = this.handleFree(arr.list, 3)
                }
            }
            if (arr.methods === '任三直选单式') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg == 3) {
                        nums = arr.list.length
                    }
                    if (leg == 4) {
                        nums = arr.list.length * 4
                    }
                    if (leg == 5) {
                        nums = arr.list.length * 10
                    }
                }
            }
            if (arr.methods === '任三直选和值') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 3) {
                        let arrList = []
                        for (let index = 0; index < 2; index++) {
                            let count = Array.from(arr.list[index])
                            count.forEach(item => {
                                nums += this.groupList(item)
                            })
                        }
                        if (leg == 4) {
                            nums = nums * 4
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (arr.methods === '任三组选组三复式') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 3) {
                        nums = this.handleGroup(Array.from(arr.list[0]), 2) * 2
                        if (leg == 4) {
                            nums = nums * 4
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (
                arr.methods === '任三组选组三单式' ||
                arr.methods === '任三组选组六单式' ||
                arr.methods === '任三组选混合'
            ) {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 3) {
                        nums = arr.list.length
                        if (leg == 4) {
                            nums = nums * 4
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (arr.methods === '任三组选组六复式' && arr.list[0].size >= 3) {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 3) {
                        nums = this.handleGroup(Array.from(arr.list[0]), 3)
                        if (leg == 4) {
                            nums = nums * 4
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (arr.methods === '任三组选和值') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 3) {
                        let arrList = []
                        for (let index = 0; index < 2; index++) {
                            let count = Array.from(arr.list[index])
                            count.forEach(item => {
                                nums += this.groupSumList(item)
                            })
                        }
                        if (leg == 4) {
                            nums = nums * 4
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (arr.methods === '任二直选复式') {
                let leg = 0
                for (const item of arr.list) {
                    item.size > 0 && leg++
                }
                if (leg >= 2) {
                    nums = this.handleFree(arr.list, 2)
                }
            }
            if (arr.methods === '任二直选单式') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg == 2) {
                        nums = arr.list.length
                    }
                    if (leg == 3) {
                        nums = arr.list.length * 3
                    }
                    if (leg == 4) {
                        nums = arr.list.length * 6
                    }
                    if (leg == 5) {
                        nums = arr.list.length * 10
                    }
                }
            }
            if (arr.methods === '任二直选和值') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 2) {
                        let arrList = []
                        for (let index = 0; index < 2; index++) {
                            let count = Array.from(arr.list[index])
                            count.forEach(item => {
                                nums += this.groupList(item, 2)
                            })
                        }
                        if (leg == 3) {
                            nums = nums * 3
                        }
                        if (leg == 4) {
                            nums = nums * 6
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (arr.methods === '任二组选复式') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 2) {
                        nums = this.handleGroup(Array.from(arr.list[0]), 2)
                        if (leg == 3) {
                            nums = nums * 3
                        }
                        if (leg == 4) {
                            nums = nums * 6
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (arr.methods === '任二组选单式') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 2) {
                        nums = arr.list.length
                        if (leg == 3) {
                            nums = nums * 3
                        }
                        if (leg == 4) {
                            nums = nums * 6
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            if (arr.methods === '任二组选和值') {
                if (this.lotterynumber) {
                    let leg = 0
                    for (const key in this.lotterynumber.lotteryPosition) {
                        if (this.lotterynumber.lotteryPosition[key].value) {
                            leg++
                        }
                    }
                    if (leg >= 2) {
                        let arrList = []
                        for (let index = 0; index < 2; index++) {
                            let count = Array.from(arr.list[index])
                            count.forEach(item => {
                                nums += this.groupSumList(item, 2)
                            })
                        }
                        if (leg == 3) {
                            nums = nums * 3
                        }
                        if (leg == 4) {
                            nums = nums * 6
                        }
                        if (leg == 5) {
                            nums = nums * 10
                        }
                    }
                }
            }
            return nums
        },
        //投注金额
        money() {
            return parseFloat(
                (
                    this.modes[this.unitActive].rate *
                    this.multiple *
                    this.orders *
                    2
                ).toPrecision(12)
            )
        },
        bonus() {
            let prize
            if (
                this.methodList.prize_level_special &&
                this.methodList.prize_level_special.length > 1
            ) {
                prize = []
                this.prize.forEach(item => {
                    let count =
                        (this.nowPrizeGroup / 2000) *
                        item *
                        this.modes[this.unitActive].rate *
                        this.multiple
                    prize.push(Math.floor(count * 10000) / 10000)
                })
                let prizeSort = [...prize].sort((a, b) => a - b)
                //如果是多倍数，就关闭利润率追号
                this.$store.dispatch('handleBonues', '')
                return { prize, prizeSort }
            } else {
                prize =
                    (Math.floor(
                        (this.nowPrizeGroup / 2000) * this.prize[0] * 100
                    ) /
                        100) *
                    this.modes[this.unitActive].rate *
                    this.multiple
                //单倍奖金
                let singleBonues =
                    (Math.floor(
                        (this.nowPrizeGroup / 2000) * this.prize[0] * 100
                    ) /
                        100) *
                    this.modes[this.unitActive].rate
                this.$store.dispatch('handleBonues', singleBonues.toFixed(4))
                return prize.toFixed(4)
            }
        }
    },
    methods: {
        //提交
        submint() {
            if (!this.orders) {
                this.$Message.error('号码选择不完整')
                return
            }
            let lt_project = this.handleOrder()
            let postdata = {
                betparams: {
                    iWalletType: 1, // 钱包类型
                    prizegroup: this.nowPrizeGroup, //奖金组
                    curmid: Number(this.$route.query.menuId), //菜單ID,
                    lt_issue_start: this.$store.state.issue, //购买的彩票奖期
                    lt_project: [lt_project]
                }
            }
            betting({ postdata: JSON.stringify(postdata) }).then(res => {
                this.$Message.success('投注成功')
                this.$store.dispatch('handleLotteryNumber', '')
                this.lotterynumber.reset()
                this.$store.dispatch('handleOrderHistory', [...res.data.betlog])
                this.$store.dispatch('handleMoney', { money: res.data.amount })
            })
        },
        //添加投注单
        addOrder() {
            if (!this.orders) {
                this.$Message.error('号码选择不完整')
                return
            }
            let lt_project = this.handleOrder()
            let repeat = this.$store.state.orderList.some(
                item =>
                    item.codes == lt_project.codes &&
                    item.desc == lt_project.desc &&
                    item.location == lt_project.location
            )
            if (!repeat) {
                this.$store.dispatch('handleOrderList', {
                    data: lt_project,
                    type: 'add'
                })
                if (this.$store.state.trace) {
                    let methodid = this.$store.state.orderList[0].methodid,
                        ifSame = this.$store.state.orderList.every(
                            item => item.methodid == methodid
                        )
                    if (!ifSame) {
                        this.$Message.error(
                            '利润率追号不支持混投,请确保您的投注都为同一玩法类型<br />且元角模式一致。'
                        )
                        this.$store.dispatch('handleTrace', false)
                    } else {
                        this.$Message.success(`添加成功${lt_project.desc}`)
                        EventBus.$emit('updateTraceList')
                    }
                } else {
                    this.$Message.success(`添加成功${lt_project.desc}`)
                }
            } else {
                this.$Message.error(`确认区有相同的投注内容${lt_project.desc}`)
            }
            this.$store.dispatch('handleLotteryNumber', '')
            this.lotterynumber.reset()
        },
        handleOrder() {
            let singleList = [], //单式
                singleList11 = [], //11选5
                descText = [], //为任选单式 类型 组合
                title = this.$store.state.lotteryNumber.methods,
                title1 = this.$store.state.lotteryNumber.title,
                methodsName = this.$store.state.lotteryNumber.methodname
            if (
                title == '五星直选单式' ||
                title == '四星直选单式' ||
                title == '前三直选单式' ||
                title == '前三组选混合' ||
                title == '中三直选单式' ||
                title == '中三组选混合' ||
                title == '后三直选单式' ||
                title == '后三组选混合' ||
                title == '前二直选单式' ||
                title == '前二组选单式' ||
                title == '后二直选单式' ||
                title == '后二组选单式' ||
                title == '任四直选单式' ||
                title == '任三直选单式' ||
                title == '任三组选组三单式' ||
                title == '任三组选组六单式' ||
                title == '任三组选混合' ||
                title == '任二直选单式' ||
                title == '任二组选单式' ||
                title == '直选直选单式' ||
                title == '组选混合' ||
                title == '二码后二直选单式' ||
                (title == '二码前二直选单式' && this.methodid == '1199') || //区分11选五跟快乐彩
                title == '二码后二组选单式' ||
                (title == '二码前二组选单式' && this.methodid == '1203') //区分11选五跟快乐彩
            ) {
                singleList = this.$store.state.lotteryNumber.list
            }
            if (
                title == '前三直选和值' ||
                title == '前三组选和值' ||
                title == '中三直选和值' ||
                title == '中三组选和值' ||
                title == '后三直选和值' ||
                title == '后三组选和值' ||
                title == '前三直选跨度' ||
                title == '前三直选和值尾数' ||
                title == '前三组选组三复式' ||
                title == '前三组选组六复式' ||
                title == '中三直选跨度' ||
                title == '中三直选和值尾数' ||
                title == '中三组选组三复式' ||
                title == '中三组选组六复式' ||
                title == '后三直选跨度' ||
                title == '后三直选和值尾数' ||
                title == '后三组选组三复式' ||
                title == '后三组选组六复式' ||
                title == '前二直选跨度' ||
                title == '前二组选复式' ||
                title == '后二直选跨度' ||
                title == '后二组选复式' ||
                title == '五星不定位三码' ||
                title == '五星不定位二码' ||
                title == '四星不定位后四二码' ||
                title === '三星不定位前三二码' ||
                title === '三星不定位后三二码' ||
                title == '前三直选特殊号' ||
                title == '中三直选特殊号' ||
                title == '后三直选特殊号' ||
                title == '任四组选组选24' ||
                title == '任三直选和值' ||
                title == '任三组选组三复式' ||
                title == '任三组选组六复式' ||
                title == '任三组选和值' ||
                title == '任二直选和值' ||
                title == '任二组选复式' ||
                title == '任二组选和值' ||
                title1 == '龙虎和' ||
                title1 == '龙虎' ||
                title == '三码前三组选复式' ||
                title == '二码前二组选复式' ||
                title == '趣味型定单双' ||
                title == '趣味型猜中位' ||
                title == '任选复式任选一中一' ||
                title == '任选复式任选二中二' ||
                title == '任选复式任选三中三' ||
                title == '任选复式任选四中四' ||
                title == '任选复式任选五中五' ||
                title == '任选复式任选六中五' ||
                title == '任选复式任选七中五' ||
                title == '任选复式任选八中五' ||
                title1 == '和值' ||
                title1 == '盘面' ||
                title == '冠亚组合大小单双和' ||
                title == '冠亚组合和值' ||
                title == '组选组三' ||
                title == '组选组六' ||
                title == '二码后二组选复式'||
                title == '直选直选和值' ||
                title == '组选组选和值'
            ) {
                let count = this.$store.state.lotteryNumber.list
                count.forEach(item => {
                    if (item.size) {
                        singleList.push(...Array.from(item))
                    }
                })
                singleList.sort((a, b) => a - b)
            }
            if (title == '前二直选和值' || title == '后二直选和值') {
                this.$store.state.lotteryNumber.list.forEach(item =>
                    Array.from(item).forEach(item => {
                        singleList.push(item)
                    })
                )
                singleList.sort((a, b) => a - b)
            }
            console.log(this.methodid)
            if (
                title == '三码前三直选单式' ||
                title == '三码前三组选单式' ||
                (title == '二码前二直选单式' && this.methodid == '2566') || //区分11选五跟快乐彩
                (title == '二码前二组选单式' && this.methodid == '2568') || //区分11选五跟快乐彩
                title == '任选单式任选一中一' ||
                title == '任选单式任选二中二' ||
                title == '任选单式任选三中三' ||
                title == '任选单式任选四中四' ||
                title == '任选单式任选五中五' ||
                title == '任选单式任选六中五' ||
                title == '任选单式任选七中五' ||
                title == '任选单式任选八中五'
            ) {
                singleList = [...this.$store.state.lotteryNumber.list]
                singleList = singleList.map(item => item.join(' '))
            }
            let codes = [...this.$store.state.lotteryNumber.list].map(item =>
                Array.from(item)
                    .sort((a, b) => a - b)
                    .join('&')
            )
            //设置组合变量
            let codesSplice = codes[0]
            //拼接组合投注号码
            for (let index = 1; index < codes.length; index++) {
                if (codes[index].length) {
                    codesSplice = codesSplice + '|' + codes[index]
                }
            }
            if (
                title == '定位胆定位胆' ||
                title == '任四直选复式' ||
                title == '任三直选复式' ||
                title == '任二直选复式' ||
                title == '排名次排名次'
            ) {
                codesSplice = codes[0]
                for (let index = 1; index < codes.length; index++) {
                    codesSplice = codesSplice + '|' + codes[index]
                }
            }
            if (
                title == '定位胆定位胆' &&
                (methodsName == 'SDDWD5' || methodsName == 'SSLDWD3')
            ) {
                codesSplice = codes[0]
                for (let index = 1; index < 3; index++) {
                    codesSplice = codesSplice + '|' + codes[index]
                }
            }
            let handleCodes
            if (singleList.length) {
                handleCodes = [...singleList].join('&')
            } else {
                handleCodes = codesSplice
            }

            for (const key in this.lotterynumber.lotteryPosition) {
                if (this.lotterynumber.lotteryPosition[key].value) {
                    descText.push(this.lotterynumber.lotteryPosition[key].text)
                }
            }

            let desc = `${this.methodList.title}_${this.methodList.name}`
            let lt_project = {
                type: this.$store.state.lotteryNumber.type, //彩种类型
                methodid: this.methodid,
                point: this.rebate.slice(0, -1),
                codes: handleCodes,
                nums: this.orders, //投注数
                times: this.multiple, //倍数
                money: this.money, //金额,
                mode: this.modes[this.unitActive].modeid,
                location: descText.join(','), //任选单式
                desc: desc,
                buqsno: 'buqsno5ce3a094c4706'
            }
            return lt_project
        },
        chosenUnit(item, value) {
            this.unitActive = value
        },
        changeMultiple(item) {
            if (item == '+') {
                this.multiple++
            } else {
                this.multiple--
            }
            if (this.multiple < 1) {
                this.multiple = 1
            }
        },
        //和值
        groupList(value, leg, name) {
            let count = [],
                repeatList = new Set(),
                arr = ''
            if (leg == 'k3') {
                arr = [1, 2, 3, 4, 5, 6]
            } else if (name == '冠亚组合和值') {
                arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            } else {
                arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    if (leg == 2) {
                        if (arr[i] + arr[j] == value) {
                            if (name == '冠亚组合和值') {
                                if (arr[i] != arr[j]) {
                                    count.push([arr[i], arr[j]])
                                }
                            } else {
                                count.push([arr[i], arr[j]])
                            }
                        }
                    } else {
                        for (let k = 0; k < arr.length; k++) {
                            if (arr[i] + arr[j] + arr[k] == value) {
                                count.push([arr[i], arr[j], arr[k]])
                            }
                        }
                    }
                }
            }
            return count.length
        },
        //组选和值
        groupSumList(value, leg) {
            let count = new Set()
            let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    if (leg == 2) {
                        if (arr[i] + arr[j] == value) {
                            if (arr[i] != arr[j]) {
                                count.add(
                                    [arr[i], arr[j]]
                                        .sort((a, b) => a - b)
                                        .join('')
                                )
                            }
                        }
                    } else {
                        for (let k = 0; k < arr.length; k++) {
                            if (arr[i] + arr[j] + arr[k] == value) {
                                if (arr[i] + arr[j] - (arr[i] + arr[k]) != 0) {
                                    count.add(
                                        [arr[i], arr[j], arr[k]]
                                            .sort((a, b) => a - b)
                                            .join('')
                                    )
                                }
                            }
                        }
                    }
                }
            }
            return count.size
        },
        //求差
        handleDifferenceValue(value, leg) {
            let count = [], //组合排列
                arrResult = [], //存放结果
                arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] //初始数据
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    if (leg == 2) {
                        count.push([arr[i], arr[j]])
                    } else {
                        for (let k = 0; k < arr.length; k++) {
                            count.push([arr[i], arr[j], arr[k]])
                        }
                    }
                }
            }
            count.forEach(item => {
                item.sort((a, b) => a - b)
                if (leg == 2) {
                    if (item[1] - item[0] == value) {
                        arrResult.push(item)
                    }
                }
                {
                    if (item[2] - item[0] == value) {
                        arrResult.push(item)
                    }
                }
            })
            return arrResult.length
        },
        handleGroup(arr, length) {
            let count = math.combo(arr, length)
            return count.length
        },
        handleBall(leg) {
            let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] //初始数据
            return leg == 2 ? arr.length - 1 : (arr.length * 2 - 2) * 3
        },
        handleFree(arr, numberLength) {
            let count = [],
                leg = 0,
                removeRepeat = new Set()
            for (const item of arr) {
                if (item.size) {
                    count.push(Array.from(item))
                }
            }

            count = count.map((item, index) =>
                item.map(element => index.toString().concat(element))
            )
            count = this.doExchange(count)
            count.forEach(item => {
                let arr = math.combo(item, numberLength)
                arr.forEach(ele => {
                    removeRepeat.add(ele.join(''))
                })
            })
            leg = removeRepeat.size

            return leg
        },
        doExchange(arr) {
            var len = arr.length
            // 当数组大于等于2个的时候
            if (len >= 2) {
                // 第一个数组的长度
                var len1 = arr[0].length
                // 第二个数组的长度
                var len2 = arr[1].length
                // 2个数组产生的组合数
                var lenBoth = len1 * len2
                //  申明一个新数组
                var items = new Array(lenBoth)
                // 申明新数组的索引
                var index = 0
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        if (arr[0][i] instanceof Array) {
                            items[index] = arr[0][i].concat(arr[1][j])
                        } else {
                            items[index] = [arr[0][i]].concat(arr[1][j])
                        }
                        index++
                    }
                }
                var newArr = new Array(len - 1)
                for (var i = 2; i < arr.length; i++) {
                    newArr[i - 1] = arr[i]
                }
                newArr[0] = items
                return this.doExchange(newArr)
            } else {
                return arr[0]
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
.order
    background url('../../assets/images/ssc-repeat_001.jpg')
    height 100px
    border-top 1px solid #464646
    overflow hidden
    .order_left
        float left
        padding 20px
        overflow hidden
        ul
            height 26px
            float left
        li
            float left
            background #7b7b7b
            width 26px
            height 26px
            line-height 26px
            border-radius 6px
            text-align center
            margin-right 10px
            color #d2d2d2
            box-shadow 0 3px 4px #1f1d1d
            &.active
                color #fff
                background #ff632c
        .multiple
            float left
            margin-left 20px
            position relative
            overflow hidden
            box-shadow 0 3px 4px #1f1d1d
            input, div
                float left
            input
                background #312e2e
                border 1px solid #ff632c
                color #fff
                height 26px
                width 80px
                border-top-left-radius 3px
                border-bottom-left-radius 3px
                padding-right 20px
                text-align center
                border-right none
            .multiple_text
                position absolute
                color #fff
                background none
                right 40px
                top 7px
                width 20px
            span
                display block
                height 13px
                line-height 13px
                width 40px
                text-align center
                background #ff632c
                &:first-child
                    border-bottom 1px solid #e24c17
    .order_right
        float right
        padding 15px
        overflow hidden
        span
            font-size 14px
            margin 0 6px
            line-height 26px
        button
            height 42px
            border none
            background #ff6000
            margin 0 10px
            color #fff
            padding 0 20px
            font-size 14px
            border-radius 3px
            line-height 42px
            outline none
            box-shadow 0 3px 4px #1f1d1d
            &.buttonColor
                background #e02569
</style>

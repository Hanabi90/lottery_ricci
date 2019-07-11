<template>
    <div class="box">
        <div class="activityList">
            <Menu class="user" ref="user" mode="vertical" :active-name="0" @on-select="handleInfo">
                <MenuItem
                    v-for="(item,index) of activityList"
                    :key="index"
                    :name="index"
                >{{item.title}}</MenuItem>
            </Menu>
            <div class="info">
                <img width="100%" :src="activityInfo.frontend_banner_picture" alt />
                <div class="infoContent" v-html="activityInfo.content"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { getactivitylist, getactivityinfo } from '@/api/index'
import { Menu, MenuItem } from 'iview'
export default {
    name: 'activityList',
    data() {
        return {
            activityList: [], //活动列表
            activityInfo: '', //活动详情
            onOff: false
        }
    },
    mounted() {
        getactivitylist().then(res => {
            this.activityList = res.data.activitylist
            this.$nextTick(() => {
                this.$refs.user.updateOpened()
                this.$refs.user.updateActiveName()
            })
            this.handleInfo(0)
        })
    },
    methods: {
        handleInfo(name) {
            getactivityinfo({ id: this.activityList[name].id }).then(res => {
                this.activityInfo = res.data.activityinfo
            })
        },
        back() {
            this.onOff = !this.onOff
        }
    },
    components: {
        Menu,
        MenuItem
    }
}
</script>

<style lang="stylus" scoped>
.box
    width 1200px
    margin auto
    overflow hidden
    .activityList
        border-radius 3px
        overflow hidden
        position relative
        z-index 0
        display flex
        padding-top 20px
        .user
            flex 0.2
        .info
            flex 0.8
            line-height 30px
            text-align center
            overflow hidden
            font-size 14px
            padding 20px
            .infoContent>>>table
                width 100%
</style>

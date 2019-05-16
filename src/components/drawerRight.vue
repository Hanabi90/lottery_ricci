<template>
    <Drawer
        title="个人中心"
        :mask-closable="false"
        :draggable="true"
        :inner="true"
        :closable="true"
        :mask="false"
        v-model="this.$store.state.drawerRight"
    >
        <Tabs type="card">
            <TabPane label="标签一">标签一的内容</TabPane>
            <TabPane label="标签二">标签二的内容</TabPane>
            <TabPane label="标签三">标签三的内容</TabPane>
        </Tabs>
    </Drawer>
</template>

<script>
import { Drawer, Tabs, TabPane } from 'iview'
export default {
    name: 'drawerRight',
    data() {
        return {
            value1: false
        }
    },
    components: {
        Drawer,
        Tabs,
        TabPane
    }
}
</script>

<style lang="stylus" scoped>
.drawerRight
    width 300px
    height 100vh
    background #ccc
    position fixed
    right 0
    top 0
    z-index 100
.test
    height 100%
.test1
    background #000
</style>

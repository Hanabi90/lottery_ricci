<template>
    <div style="width:90%" class="teamAccount">
        <Table :columns="columns1" :data="data1"></Table>
    </div>
</template>

<script>
import { getgroupbalance } from '@/api/index'
import { Table } from 'iview'
export default {
    name: 'teamAccount',
    props: ['uid'],
    data() {
        return {
            columns1: [
                {
                    title: '用户名称',
                    key: 'name'
                },
                {
                    title: '用户昵称',
                    key: 'nickname'
                },
                {
                    title: '团队余额',
                    key: 'teammoney'
                }
            ],
            data1: []
        }
    },
    mounted() {
        getgroupbalance({ uid: this.uid }).then(res => {
            this.data1 = [
                {
                    name: res.data.user.username,
                    nickname: res.data.user.nickname,
                    teammoney: res.data.teammoney
                }
            ]
        })
    },
    components: {
        Table
    }
}
</script>

<style lang="stylus" scoped></style>

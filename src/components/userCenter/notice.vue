<template>
    <div class="notice">
        <Collapse v-model="activeIndex" accordion>
            <Panel
                :style="{'fontSize':'12px',}"
                v-for="(item,value) of list"
                :key="value"
                :name="`${value}`"
            >
                {{item.subject}}
                <p slot="content">{{item.content}}</p>
            </Panel>
        </Collapse>
    </div>
</template>

<script>
import { getnotice } from '@/api/index'
import { Collapse, Panel } from 'iview'
export default {
    name: 'notice',
    data() {
        return {
            list: [],
            activeIndex: '0'
        }
    },
    mounted() {
        getnotice().then(res => {
            this.list = res.data.results
        })
    },
    components: {
        Collapse,
        Panel
    }
}
</script>

<style lang="stylus" scoped>
.notice
    width 100%
    height 600px
    background #eee
    padding 10px 16px
    overflow-y auto
    overscroll-behavior-y contain
    p
        word-wrap break-word
</style>

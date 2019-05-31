<template>
    <div class="secpass">
        <Input v-model="value" placeholder="请输入资金密码" clearable style="width: 200px"/>
        <Button @click="checkpass">确定</Button>
    </div>
</template>

<script>
import { Input, Button } from 'iview'
import { checksecpass, RSAencrypt } from '@/api/index'
import md5 from 'js-md5'
export default {
    name: 'secpass',
    props: ['show'],
    data() {
        return {
            value: '13213'
        }
    },
    methods: {
        checkpass() {
            checksecpass({ secpass: RSAencrypt(md5(this.value)) })
        }
    },
    components: {
        Input,
        Button
    }
}
</script>

<style lang="stylus" scoped></style>

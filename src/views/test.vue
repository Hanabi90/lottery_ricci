<template>
    <div class="test">123123</div>
</template>

<script>
import {
    getsecpass,
    updatenickname,
    getMenu,
    getbankinfo,
    MethodCrowd
} from '../api'
import JsEncrypt from 'jsencrypt'
export default {
    data() {
        return {
            public_key:
                '-----BEGIN PUBLIC KEY-----B0AAFA4C9D388208E9F55B14DF04C8603D0CD81B7B65BBD669FA893096C985E33682FE7DEEE6500E1C4C6722C9855B6DD2E130F3672BEBA446B72D8DFFF2DD1F4E23D6BD728E267A9DC2C544C6680712884926D67AF74B74E5AD8298034D8C16FE8E5A37706EF5E447E423E69CA7FD3E47BBF7A9B137EF9B0310E2560E13D3C1-----END PUBLIC KEY-----'
        }
    },
    methods: {
        RSAencrypt(pas) {
            //实例化jsEncrypt对象
            let jse = new JSEncrypt()
            //设置公钥
            jse.setPublicKey(
                `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGeBwE0bATN5j/AWlYAiAMRE+6FN
JGxIXZmW2J7Qks1c+inXB4KQIuXK2a6DLfuGnxRWCTa0XJvHr6vLWvx1J8zVktOq
1w7tA6yR5iwYfN5vS+aorsI8tcRxuNGpDtJsLS9kINGd7VH2ocmYSv8PDUKZMLqr
i5Azz9DtRubvoQJFAgMBAAE=
-----END PUBLIC KEY-----`
            )
            console.log('加密：' + jse.encrypt(pas))
            return jse.encrypt(pas)
        },
        rsa_encrypt(str) {
            let BLOCK_SIZE = this.public_key.length / 2 - 11
            let ret = ''
            let str_1 = ''
            while (str.length > 0) {
                var i = BLOCK_SIZE
                if (str.length < i) i = str.length
                str_1 = str.substr(0, i)
                str = str.substr(i, str.length - i)
                ret += this.RSAencrypt(str_1) + ' '
            }
            return ret
        }
    },
    mounted() {
        console.log(
            'tttttttttttt',
            this.rsa_encrypt('e19d5cd5af0378da05f63f891c7467af')
        )
    }
}
</script>

<style lang="stylus" scoped>
.test
    height 1000px
    background #000000
    color #fff
</style>


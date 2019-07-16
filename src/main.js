import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Message } from 'iview'
import 'iview/dist/styles/iview.css'
import VueClipboard from 'vue-clipboard2'
import '@babel/polyfill'
Vue.prototype.$Message = Message
Vue.use(VueClipboard)
Vue.config.productionTip = false
Message.config({
    duration: 4
})
Array.prototype.forEach =
    Array.prototype.forEach ||
    function(callback) {
        var isArray = Object.prototype.toString.call(this) == '[object Array]'
        if (isArray) {
            for (var key in this) {
                if (key != 'forEach') {
                    callback.call(this[key], key, this[key], this)
                }
            }
        } else {
            throw TypeError
        }
    }
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

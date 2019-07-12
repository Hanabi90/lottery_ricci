import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Message } from 'iview'
import 'iview/dist/styles/iview.css'
import VueClipboard from 'vue-clipboard2'
Vue.prototype.$Message = Message
Vue.use(VueClipboard)
Vue.config.productionTip = false
Message.config({
    duration: 4
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

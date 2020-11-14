import Vue from 'vue'
import App from './App.vue'
// 引入element-ui
import './plugins/element.js'
// 引入全局css模块
import './assets/css/global.css'
// 引入axios来向后台发送请求
import axios from 'axios'
Vue.config.productionTip = false
// 设置根路径
axios.defaults.baseURL = 'http://localhost:3030/api'
// 将axios挂载在Vue的原型上
Vue.prototype.$axios = axios
new Vue({
  render: (h) => h(App)
}).$mount('#app')

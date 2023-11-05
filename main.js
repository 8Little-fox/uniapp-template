import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import configs from './config/app.js'
import util from 'utils/util'
import tools from 'utils/tools'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
Vue.prototype.$config = configs;
Vue.prototype.$tools = tools;
Vue.prototype.$util = util;
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
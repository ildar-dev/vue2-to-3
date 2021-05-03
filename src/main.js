import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
const eventHub = new Vue()
Vue.prototype['$eventHub'] = eventHub // bus event, need for alert message

new Vue({
  render: h => h(App),
}).$mount('#app')

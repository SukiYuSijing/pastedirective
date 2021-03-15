/*
 * @Author: your name
 * @Date: 2021-03-14 23:46:29
 * @LastEditTime: 2021-03-15 00:21:22
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \pastedirective\src\main.js
 */
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false;
Vue.use(ElementUI);
new Vue({
  render: (h) => h(App),
}).$mount('#app');

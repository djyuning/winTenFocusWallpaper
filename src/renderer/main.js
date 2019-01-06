import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'

import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);

Vue.component('icon', Icon);

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

Vue.config.productionTip = false;

new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app');

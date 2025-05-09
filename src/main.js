import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import SvMessageBox from '@/components/SvMessageBox/index.js'
import SvConfirmBox from '@/components/SvConfirmBox/index.js'
import globalComponents from '@/utils/globalComponents'
import _ from 'lodash'
import * as filters from './filters' // global filters
import tagsOperation from '@/utils/tagsOperation'
import dict from './utils/dict'
import inputRules from '@/utils/inputRules' // 引入输入验证
import vueWaves from '@/directive/waves/index' // 水波纹指令

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

Vue.use(ElementUI, { locale })
Vue.use(SvMessageBox)
Vue.use(SvConfirmBox)
Vue.use(globalComponents)
Vue.use(_)
Vue.use(tagsOperation)
Vue.use(inputRules)
Vue.use(vueWaves)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false
// 将字典挂载到Vue原型
Vue.prototype.$dict = dict

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

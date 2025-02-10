import SvConfirmBox from './src/confirmMain.js'

const install = function(Vue) {
  Vue.prototype.svConfirmBox = SvConfirmBox
}

export default {
  install
}

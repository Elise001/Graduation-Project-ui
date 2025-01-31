import SvMessageBox from './src/messageBoxMain.js'

const install = function(Vue) {
  Vue.prototype.svMessageBox = SvMessageBox
}

export default {
  install
}

const defaults = {
  title: '',
  messageTitle: '',
  message: '',
  closeOnClickModal: true,
  dangerouslyUseHTMLString: false
}

import Vue from 'vue'
import msgboxVue from './messageBoxMain.vue'
import merge from 'element-ui/src/utils/merge'

const MessageBoxConstructor = Vue.extend(msgboxVue)

let currentMsg, instance
let msgQueue = []

const initInstance = () => {
  instance = new MessageBoxConstructor({
    el: document.createElement('div')
  })
}

const showNextMsg = () => {
  if (!instance) {
    initInstance()
  }
  instance.action = ''

  if (!instance.visible || instance.closeTimer) {
    if (msgQueue.length > 0) {
      currentMsg = msgQueue.shift()

      const options = currentMsg.options
      for (const prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop]
        }
      }

      delete instance.$slots.default;
      ['modal', 'closeOnClickModal'].forEach(prop => {
        if (instance[prop] === undefined) {
          instance[prop] = true
        }
      })
      document.body.appendChild(instance.$el)

      Vue.nextTick(() => {
        instance.visible = true
      })
    }
  }
}

const MessageBox = function(options, callback) {
  if (Vue.prototype.$isServer) return
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  return new Promise((resolve, reject) => {
    msgQueue.push({
      options: merge({}, defaults, MessageBox.defaults, options),
      callback,
      resolve,
      reject
    })

    showNextMsg()
  })
}

MessageBox.setDefaults = defaults => {
  MessageBox.defaults = defaults
}

MessageBox.close = () => {
  instance.doClose()
  instance.visible = false
  msgQueue = []
  currentMsg = null
}

export default MessageBox
export {
  MessageBox
}

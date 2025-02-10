const defaults = {
  title: null,
  message: '',
  type: '',
  modalFade: true,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  closeOnHashChange: true,
  showConfirmButton: true,
  showCancelButton: true,
  confirmButtonText: '',
  cancelButtonText: '',
  beforeClose: null,
  dangerouslyUseHTMLString: false,
  distinguishCancelAndClose: false
}

import Vue from 'vue'
import confirmVue from './confirmMain.vue'
import merge from 'element-ui/src/utils/merge'
import { isVNode } from 'element-ui/src/utils/vdom'

const ConfirmBoxConstructor = Vue.extend(confirmVue)

let currentMsg, instance
let msgQueue = []

const defaultCallback = action => {
  if (currentMsg) {
    const callback = currentMsg.callback
    if (typeof callback === 'function') {
      callback(action)
    }
    if (currentMsg.resolve) {
      if (action === 'confirm') {
        currentMsg.resolve(action)
      } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
        currentMsg.reject(action)
      }
    }
  }
}

const initInstance = () => {
  instance = new ConfirmBoxConstructor({
    el: document.createElement('div')
  })

  instance.callback = defaultCallback
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
      // eslint-disable-next-line no-unused-vars
      for (const prop in options) {
        // eslint-disable-next-line no-prototype-builtins
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop]
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback
      }

      const oldCb = instance.callback
      instance.callback = (action, instance) => {
        oldCb(action, instance)
        showNextMsg()
      }
      if (isVNode(instance.message)) {
        instance.$slots.default = [instance.message]
        instance.message = null
      } else {
        delete instance.$slots.default
      }
      ['modal', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(prop => {
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

const ConfirmBox = function(options, callback) {
  if (Vue.prototype.$isServer) return
  if (typeof options === 'string' || isVNode(options)) {
    options = {
      message: options
    }
    // eslint-disable-next-line prefer-rest-params
    if (typeof arguments[1] === 'string') {
      // eslint-disable-next-line prefer-rest-params
      options.title = arguments[1]
    }
  } else if (options.callback && !callback) {
    callback = options.callback
  }

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => {
      msgQueue.push({
        options: merge({}, defaults, ConfirmBox.defaults, options),
        callback,
        resolve,
        reject
      })

      showNextMsg()
    })
  } else {
    msgQueue.push({
      options: merge({}, defaults, ConfirmBox.defaults, options),
      callback
    })

    showNextMsg()
  }
}

ConfirmBox.setDefaults = defaults => {
  ConfirmBox.defaults = defaults
}

ConfirmBox.close = () => {
  instance.doClose()
  instance.visible = false
  msgQueue = []
  currentMsg = null
}

export default ConfirmBox
export { ConfirmBox }

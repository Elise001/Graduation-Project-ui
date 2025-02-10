<template>
  <transition name="msgbox-fade">
    <div
      v-show="visible"
      class="el-message-box__wrapper"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      :aria-label="title || 'dialog'"
      @click.self="handleWrapperClick"
    >
      <div class="el-message-box">
        <div v-if="title !== null" class="el-message-box__header">
          <div class="el-message-box__title">
            <span>{{ title }}</span>
          </div>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__container">
            <div class="el-message-box__status el-icon-warning" />
            <div v-if="message !== ''" class="el-message-box__message">
              <slot>
                <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
                <p v-else v-html="message" />
              </slot>
            </div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            v-if="showCancelButton"
            @click.native="handleAction('cancel')"
            @keydown.enter="handleAction('cancel')"
          >
            {{ cancelButtonText || '取消' }}
          </el-button>
          <el-button
            v-show="showConfirmButton"
            ref="confirm"
            type="primary"
            @click.native="handleAction('confirm')"
            @keydown.enter="handleAction('confirm')"
          >
            {{ confirmButtonText || '确定' }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Popup from 'element-ui/src/utils/popup'
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/packages/input'
import ElButton from 'element-ui/packages/button'
import Dialog from 'element-ui/src/utils/aria-dialog'
import { t } from 'element-ui/src/locale'

let confirmBox
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    ElInput,
    ElButton
  },
  mixins: [Popup, Locale],
  props: {
    modal: {
      default: true
    },
    lockScroll: {
      default: true
    },
    closeOnClickModal: {
      default: true
    },
    closeOnPressEscape: {
      default: true
    },
    closeOnHashChange: {
      default: true
    }
  },
  data() {
    return {
      uid: 1,
      title: undefined,
      message: '',
      type: '',
      showConfirmButton: true,
      showCancelButton: true,
      action: '',
      confirmButtonText: '',
      cancelButtonText: '',
      callback: null,
      dangerouslyUseHTMLString: false,
      focusAfterClosed: null,
      isOnComposition: false,
      distinguishCancelAndClose: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.uid++
        this.$nextTick(() => {
          this.$refs.confirm.$el.focus()
        })
        this.focusAfterClosed = document.activeElement
        confirmBox = new Dialog(this.$el, this.focusAfterClosed, this.getFirstFocus())
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.closeOnHashChange) {
        window.addEventListener('hashchange', this.close)
      }
    })
  },
  beforeDestroy() {
    if (this.closeOnHashChange) {
      window.removeEventListener('hashchange', this.close)
    }
    setTimeout(() => {
      confirmBox.closeDialog()
    })
  },
  methods: {
    t(value) {
      return t(value)
    },
    getSafeClose() {
      const currentId = this.uid
      return () => {
        this.$nextTick(() => {
          if (currentId === this.uid) this.doClose()
        })
      }
    },
    doClose() {
      if (!this.visible) return
      this.visible = false
      this._closing = true
      // eslint-disable-next-line no-unused-expressions
      this.onClose && this.onClose()
      confirmBox.closeDialog()
      if (this.lockScroll) {
        setTimeout(this.restoreBodyStyle, 200)
      }
      this.opened = false
      this.doAfterClose()
      setTimeout(() => {
        if (this.action) this.callback(this.action, this)
      })
    },
    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction(this.distinguishCancelAndClose ? 'close' : 'cancel')
      }
    },
    handleAction(action) {
      this.action = action
      if (typeof this.beforeClose === 'function') {
        this.close = this.getSafeClose()
        this.beforeClose(action, this, this.close)
      } else {
        this.doClose()
      }
    },
    getFirstFocus() {
      const btn = this.$el.querySelector('.el-message-box__btns .el-button')
      const title = this.$el.querySelector('.el-message-box__btns .el-message-box__title')
      return btn || title
    },
    handleClose() {
      this.handleAction('close')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.el-message-box__wrapper {
  z-index: 9999 !important;
}
::v-deep.el-message-box__header {
  text-align: center;
  padding: 20px 15px 10px 15px;
}
::v-deep.el-message-box__content {
  padding: 15px;
}
::v-deep.el-message-box__btns {
  text-align: center;
}
::v-deep.el-message-box {
  padding-bottom: 20px;
}
</style>

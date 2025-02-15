<template>
  <transition name="msgbox-fade">
    <div
      v-show="visible"
      class="el-message-box__wrapper"
      tabindex="-1"
      role="dialog"
      @click.self="handleWrapperClick"
    >
      <div class="el-message-box">
        <div class="el-message-box__header">
          <div class="el-message-box__title">
            <div :class="['el-message-box__status', 'el-icon-warning']" />
            <span style="margin-left: 25px;">{{ title }}</span>
          </div>
          <button
            type="button"
            class="el-message-box__headerbtn"
            @click="handleAction"
            @keydown.enter="handleAction"
          >
            <i class="el-message-box__close el-icon-close" />
          </button>
        </div>
        <div class="el-message-box__content">
          <div class="el-message-box__message">
            <svg
              t="1503994842272"
              class="icon"
              style=""
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="10097"
              width="32"
              height="32"
            >
              <path
                d="M625.664 132.608V199.68h309.76v43.008h-309.76V312.32h309.76v43.008h-309.76v68.608h309.76v43.008h-309.76v68.608h309.76v43.008h-309.76v68.608h309.76v43.008h-309.76v68.096h309.76v43.008h-309.76v89.088H1024v-757.76h-398.336zM0 914.944L577.024 1024V0L0 109.056"
                p-id="10098"
              />
              <path
                d="M229.376 660.48H139.776l118.272-187.904-112.64-180.736h92.16l65.536 119.808L370.688 291.84h89.088l-112.64 177.664L466.944 660.48H373.248l-70.144-125.44L229.376 660.48z"
                p-id="10099"
              />
            </svg>
            <slot>
              <p>{{ messageTitle }}</p>
              <div class="sv-message-box">
                <div v-if="!dangerouslyUseHTMLString">
                  <div v-if="Array.isArray(message)">
                    <p v-for="(item, index) in message" :key="index">{{ item }}</p>
                  </div>
                  <div v-else>{{ message }}</div>
                </div>
                <div v-else>
                  <div v-if="Array.isArray(message)">
                    <p v-for="(item, index) in message" :key="index" v-html="item" />
                  </div>
                  <div v-else v-html="message" />
                </div>
              </div>
            </slot>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button ref="confirm" class="cancelButtonClass" @click.native="handleAction" @keydown.enter="handleAction">
            {{ '我知道了' }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import i18n from '@/lang/zh-CN'
import Popup from 'element-ui/src/utils/popup'
import Locale from 'element-ui/src/mixins/locale'
import ElButton from 'element-ui/packages/button'
import Dialog from 'element-ui/src/utils/aria-dialog'

let messageBox
export default {
  components: { ElButton },
  mixins: [Popup, Locale],
  props: {
    modal: {
      default: true
    },
    closeOnClickModal: {
      default: true
    }
  },
  data() {
    return {
      title: undefined,
      messageTitle: '',
      message: '',
      dangerouslyUseHTMLString: false,
      focusAfterClosed: null
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.confirm.$el.focus()
        })
        this.focusAfterClosed = document.activeElement
        messageBox = new Dialog(this.$el, this.focusAfterClosed, this.getFirstFocus())
      }
    }
  },
  beforeDestroy() {
    setTimeout(() => {
      messageBox.closeDialog()
    })
  },
  methods: {
    t(value) {
      return i18n.t(value)
    },
    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction()
      }
    },
    handleAction() {
      if (!this.visible) return
      this.visible = false
      this._closing = true
      messageBox.closeDialog()
      setTimeout(this.restoreBodyStyle, 200)
      this.opened = false
      this.doAfterClose()
    },
    getFirstFocus() {
      const btn = this.$el.querySelector('.el-message-box__btns .el-button')
      const title = this.$el.querySelector('.el-message-box__btns .el-message-box__title')
      return btn || title
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep.el-message-box__wrapper {
  z-index: 9999 !important;
}
::v-deep.el-message-box {
  padding: 5px 0 20px 0;
}
::v-deep.el-message-box__status {
  top: 58%;
  font-size: 18px !important;
}
::v-deep.el-message-box__title {
  font-size: 16px;
}
::v-deep.el-message-box__content {
  padding: 0 10px;
  text-align: center;
}
::v-deep.el-message-box__btns {
  text-align: center;
}
svg {
  fill: #e6a23c;
}
.sv-message-box {
  max-height: 120px;
  overflow: auto;
  padding: 5px;
  width: 95%;
  margin: 10px auto;
  border-top: 1px solid #ebeef5;
  font-size: 12px;
}
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background-color: #ffffff;
}
::-webkit-scrollbar-thumb {
  background-color: #cfd0d3;
}
</style>

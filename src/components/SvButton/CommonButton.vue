<template>
  <button
    class="el-button"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
    @click="handleClick"
  >
    <i v-if="loading" class="el-icon-loading" />
    <i v-if="icon && !loading" :class="icon" />
    <span v-if="$slots.default"><slot /></span>
  </button>
</template>
<script>
export default {
  name: 'ElButton',
  inject: {
    elForm: {
      default: ''
    },
    elFormItem: {
      default: ''
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    handleType: {
      type: String
    },
    size: String,
    icon: {
      type: String,
      default: ''
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },
  computed: {
    _elFormItemSize() {
      return (this.elFormItem || {}).elFormItemSize
    },
    buttonSize() {
      return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size
    },
    buttonDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    }
  },
  methods: {
    handleClick(evt) {
      if (this.handleType) {
        let message = ''
        if (this.handleType === 'submit') {
          message = '确定'
        } else if (this.handleType === 'delete') {
          message = '返回'
        }
        this.svConfirmBox({
          title: '提示',
          message
        }).then(() => {
          this.$emit('click', evt)
        })
      } else {
        this.$emit('click', evt)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

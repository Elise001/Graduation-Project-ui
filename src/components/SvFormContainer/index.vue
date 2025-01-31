<template>
  <div>
    <div class="sv-form-container-box" v-if="showButtons">
      <el-button type="primary" @click="cancel">{{ $t('common.button.cancel') }}</el-button>
      <sv-button
        v-for="item in buttons"
        :type="item.type"
        :key="item.event"
        :handleType="item.handleType"
        @click="handleClick(item.event)"
      >
        {{ item.name }}
      </sv-button>
    </div>
    <div :style="showButtons ? 'padding-top: 50px;' : ''">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormButtons',
  props: {
    buttons: {
      type: Array
    },
    showButtons: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    cancel() {
      this.$closeTag(this)
    },
    handleClick(event) {
      this.$emit('handle-click', event)
    }
  }
}
</script>
<style lang="scss" scoped>
.sv-form-container-box {
  position: fixed;
  z-index: 1999;
  top: 90px;
  width: 100%;
  overflow: hidden;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  background-color: #fff;
}
</style>

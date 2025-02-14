<template>
  <div>
    <div v-if="showButtons" class="sv-form-container-box">
      <el-button type="primary" @click="cancel">取消</el-button>
      <sv-button
        v-for="item in buttons"
        :key="item.event"
        :type="item.type"
        :handle-type="item.handleType"
        @click="handleClick(item.event)"
      >
        {{ item.name }}
      </sv-button>
    </div>
    <div :style="showButtons ? 'padding-top: 50px;' : ''">
      <slot />
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
      this.$router.back()
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
  top: 45px;
  width: 90%;
  overflow: hidden;
  padding: 10px;
  margin: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  background-color: #fff;
}
</style>

<!-- 功能：封装版el-card
作者：刘玉
日期：2020-04-20
-->
<template>
  <el-card :style="cardStyle">
    <div v-if="title" slot="header">
      <span style="color:#409EFF;font-weight:bold">{{ title }}</span>
    </div>
    <slot />
  </el-card>
</template>

<script>
export default {
  name: 'SvCard',
  components: {},
  props: {
    // eslint-disable-next-line vue/require-default-prop
    title: {
      type: String
    },
    marginTop: {
      type: [String, Number],
      default: 10
    },
    marginRight: {
      type: [String, Number],
      default: 10
    },
    merginBottom: {
      type: [String, Number],
      default: 10
    },
    marginLeft: {
      type: [String, Number],
      default: 10
    }
  },
  data() {
    return {}
  },
  computed: {
    cardStyle() {
      const style = {}
      if (this.marginTop) {
        style['margin-top'] = typeof this.marginTop === 'number' ? `${this.marginTop}px` : this.marginTop
      }
      if (this.marginRight) {
        style['margin-right'] = typeof this.marginRight === 'number' ? `${this.marginRight}px` : this.marginRight
      }
      if (this.merginBottom) {
        style['margin-bottom'] = typeof this.merginBottom === 'number' ? `${this.merginBottom}px` : this.merginBottom
      }
      if (this.marginLeft) {
        style['margin-left'] = typeof this.marginLeft === 'number' ? `${this.marginLeft}px` : this.marginLeft
      }
      return style
    }
  },
  watch: {},
  created() {
    //
  }
}
</script>

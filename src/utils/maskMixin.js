export default {
  data() {
    return {
      loading: false,
      loadingText: '系统君正在玩儿命加载',
      loadingSpinner: 'el-icon-loading',
      loadingBackground: ''
    }
  },
  methods: {
    loadingStart() {
      this.loading = true
    },
    loadingEnd() {
      this.loading = false
    }
  }
}

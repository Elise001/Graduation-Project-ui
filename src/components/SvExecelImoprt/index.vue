<template>
  <el-dialog
    v-loading="loading"
    title="Excel表数据导入"
    width="400px"
    append-to-body
    :show-close="false"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    :element-loading-text="loadingText"
    :element-loading-spinner="loadingSpinner"
    :element-loading-background="loadingBackground"
    @close="close"
  >
    <div style="padding-bottom:40px;">
      <!-- 文件上传 -->
      <input
        ref="imFile"
        type="file"
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        @change="uploadFile"
      >
    </div>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取消导入</el-button>
      <el-button type="primary" @click="importFile">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
const XLSX = require('xlsx')
import visibleSyncMixin from '@/mixins/visibleSyncMixin'

export default {
  name: 'ExcelImport',
  mixins: [visibleSyncMixin],
  data() {
    return {
      imFile: '',
      excelData: [],
      loading: false,
      loadingText: '系统君正在玩儿命加载',
      loadingSpinner: 'el-icon-loading',
      loadingBackground: ''
    }
  },
  methods: {
    /** 文件上传 */
    uploadFile() {
      this.imFile = this.$refs.imFile
      const obj = this.imFile
      // 如果导入文件为空不向下执行
      if (!obj.files || !obj.files[0]) return
      this.loading = true
      // 处理Excel中的数据
      const f = obj.files[0]
      const reader = new FileReader()
      const $t = this
      reader.onload = e => {
        const data = e.target.result
        $t.wb = XLSX.read(data, {
          type: 'binary'
        })
        this.excelData = XLSX.utils.sheet_to_json($t.wb.Sheets[$t.wb.SheetNames[0]])
        // 如果导入数据为空报错，并清空value值
        if (!this.excelData.length) {
          this.$refs.imFile.value = ''
          this.$notify({
            message: '未发现可导入数据，请确认',
            type: 'warning',
            duration: 2000
          })
        }
      }
      reader.readAsBinaryString(f)
      this.loading = false
    },
    /** 文件导入到列表中 */
    importFile() {
      // 如果imFile不存在 || imFile文件长度为空 || imFile中值为空 警告并返回
      if (!this.imFile || !this.imFile.value) {
        this.$notify({
          message: this.$t('common.message.fileNullWarning'),
          type: 'warning',
          duration: 2000
        })
        return
      }
      this.loading = true
      this.$emit('excel-import', this.excelData)
    },
    /** 关闭Excel表数据导入弹出框 */
    close() {
      // 清空input框的value值
      this.$refs.imFile.value = ''
      // 清空excelData
      this.excelData = []
      // 关闭页面数据加载遮罩
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
// el-dialog头部样式更改
::v-deep .el-dialog__header {
  background: #66b1ff;
  // background: rgba(230, 162, 60, 0.8);
  // background: rgba(103, 194, 58, 0.8);
  padding: 10px;
}
// el-dialog标题样式更改
::v-deep .el-dialog__title {
  color: #ffff;
  font-size: 18px;
  font-weight: bold;
}
// el-dialog底部样式更改
::v-deep .el-dialog__footer {
  padding: 10px;
  text-align: center;
  background: #f4f4f5;
}
</style>

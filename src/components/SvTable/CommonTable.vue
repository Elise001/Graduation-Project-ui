<template>
  <div class="common-table" :class="className">
    <el-table
      ref="table"
      :data="data"
      :max-height="tableHeight"
      :max-width="tableWidth"
      :height="tableHeight"
      border
      v-bind="$attrs"
      :style="getTableStyle"
      :span-method="spanMethod"
      :show-summary="showSummary"
      v-on="$listeners"
      @select-all="handleSelectionChange"
      @selection-change="handleSelectionChange"
      @row-dblclick="handleRowDbclick"
    >
      <el-table-column
        v-if="selection"
        key="selection"
        :reserve-selection="reserveSelection"
        align="center"
        type="selection"
        width="55"
      />
      <el-table-column v-if="singleSelect" key="singleSelect" align="center" width="55">
        <template v-slot="scope">
          <el-radio v-model="singleSelectValue" :label="scope.$index" @change="singleSelectionChange(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableIndex"
        key="index"
        type="index"
        align="center"
        label="序号"
        :width="fieldList.length === 0 ? '' : 80"
      >
        <template v-slot="scope">
          <span>{{ scope.$index + 1 + (listInfo.query.page - 1) * listInfo.query.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in showColumns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :align="item.align || 'center'"
        :width="item.width"
        :min-width="item.minWidth || '100px'"
        :show-overflow-tooltip="item.showOverflowTooltip"
        :fixed="item.fixed"
      >
        <template v-slot="scope">
          <!-- slot自定义列 -->
          <template v-if="item.type === 'slot'">
            <slot :name="`col-${item.prop}`" :row="scope.row" :index="scope.$index" :column="item" />
          </template>
          <!-- 链接 -->
          <template v-else-if="item.type === 'link'">
            <a style="color: #409eff" @click="openLink(item, scope.row)">{{ scope.row[item.prop] }}</a>
          </template>
          <!-- 复杂标签 -->
          <div v-else-if="item.type === 'tag' && item.tagOptions">
            <el-tag :type="item.tagOptions[scope.row[item.prop] ? scope.row[item.prop] : ''].type || 'primary'">
              {{ item.tagOptions[scope.row[item.prop] ? scope.row[item.prop] : ''].name }}
            </el-tag>
          </div>
          <!-- 简单标签 -->
          <el-tag v-else-if="item.type === 'tag' && !item.tagOptions">
            {{ scope.row[item.prop] }}
          </el-tag>
          <!-- 图片 -->
          <img v-else-if="item.type === 'image' && scope.row[item.prop]" height="50px" :src="scope.row[item.prop]">
          <!-- 其他 -->
          <span v-else>
            {{ scope.row[item.prop] | dictFilter(dicts[item.dictType]) }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="pager">
      <div class="table-pagination-container">
        <el-pagination
          :current-page.sync="listInfo.query.page"
          :page-sizes="listInfo.pageSizes"
          :page-size="listInfo.query.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="listInfo.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
  </div>
</template>
<script>
import { export_json_to_excel } from '@/utils/Export2Excel'
import StringUtils from '@/utils/StringUtils'

export default {
  name: 'CommonTable',
  props: {
    // 表格宽度，默认100%
    tabelWidth: {
      type: String,
      default: '100%'
    },
    spanMethod: {
      type: Function
    },
    // 显示合计
    showSummary: {
      type: Boolean,
      default: false
    },
    // 自定义table高度
    tableHeight: {
      type: String
    },
    tableWidth: {
      type: String
    },
    // 自定义类名
    className: {
      type: String
    },
    // 获取数据的接口
    api: {
      type: Function,
      required: false
    },
    // 是否显示序号
    tableIndex: {
      type: Boolean,
      default: false
    },
    // 是否有选择框
    selection: {
      type: Boolean,
      default: false
    },
    // 选择框是否单选
    singleSelect: {
      type: Boolean,
      default: false
    },
    // 主键
    pk: {
      type: String,
      default: 'id'
    },
    // 选中行数据
    checkedList: {
      type: Array,
      default: () => []
    },
    // 如果需要配置隐藏列功能需要传入module，module需要保证唯一性
    module: {
      type: String
    },
    // 表格字段配置
    fieldList: {
      type: Array,
      required: true,
      default: () => []
    },
    // 操作栏配置
    handle: {
      type: Object
    },
    // 操作按钮隐藏功能
    btnHideSet: {
      type: Function,
      default: () => false
    },
    // 操作按钮disabled
    btnDisableSet: {
      type: Function,
      default: () => false
    },
    // 是否分页
    pager: {
      type: Boolean,
      default: true
    },
    // 列表数据
    data: {
      type: Array
    },
    // 重置当前页
    initCurrentPage: {
      type: Number
    },
    // 查询条件
    query: {
      type: Object,
      default: () => ({})
    },
    // 刷新
    refresh: {
      type: Number
    },
    // 导出最大行数
    maxExportRows: {
      type: Number,
      default: 20000
    },
    // 导出文件名
    exportFileName: {
      type: String
    },
    reserveSelection: {
      type: Boolean,
      default: false
    },
    // 自定义默认的每页条数
    limit: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      singleSelectValue: undefined,
      // 列表信息
      listInfo: {
        // 总条数
        total: 0,
        // 分页数量列表
        pageSizes: [10, 20, 50, 100, 500],
        // 查询条件
        query: {
          // 当前页
          page: 1,
          // 每页条数
          // limit: 20
          limit: this.limit
        }
      },
      showFieldList: [],
      columnSelectorVisible: false,
      // 封装校验多选行数据
      selectionRows: []
    }
  },
  computed: {
    StringUtils() {
      return StringUtils
    },
    dicts() {
      // return this.$store.getters.dicts
      return []
    },
    showColumns() {
      return this.showFieldList.filter(item =>
        (item.show !== false && item.show !== null && item.show !== undefined && item.show !== '') ||
        (item.children && item.children.filter(el => el.show === true))
      )
    },
    getTableStyle() {
      return { width: this.tabelWidth }
    }
  },
  watch: {
    initCurrentPage() {
      this.listInfo.query.page = 1
    },
    refresh() {
      if (!this.api) return
      this.getList()
    },
    checkedList() {
      if (this.checkedList && this.checkedList.length && this.rows) {
        // 设置当前选中项
        this.checkedList.forEach(selected => {
          const row = this.rows.find(item => item[this.pk] === selected)
          this.$nextTick(() => {
            if (!row) return
            this.$refs.table.toggleRowSelection(row, true)
          })
        })
      }
    }
  },
  updated() {
    this.$refs.table.doLayout()
  },
  mounted() {
    this.initColumns()
  },
  methods: {
    // 初始化列设置
    initColumns() {
      this.showFieldList = this.fieldList
        .filter(item => !item.hidden)
        .map(item => {
          this.$set(item, 'show', true)
          return item
        })
    },
    // 处理查询条件
    handleParams() {
      const obj = {}
      // eslint-disable-next-line no-unused-vars
      for (const key in this.query) {
        if (this.query[key] || this.query[key] === 0) {
          obj[key] = this.query[key]
        }
      }
      // 如果不需要分页，则无分页相关参数
      return this.pager ? { ...this.listInfo.query, ...obj } : obj
    },
    // 获取数据
    getList() {
      this.singleSelectValue = undefined
      if (!this.api) return
      this.api(this.handleParams()).then(res => {
        if (res.status === 200) {
          this.rows = []
          if (this.pager) {
            this.rows = res.data.rows
            this.listInfo.total = Number(res.data.total)
          } else {
            this.rows = res.data
          }
          this.$emit('update:data', this.rows)
          // 设置当前选中项
          this.checkedList.forEach(selected => {
            const row = this.rows.find(item => item[this.pk] === selected)
            this.$nextTick(() => {
              if (!row) return
              this.$refs.table.toggleRowSelection(row, true)
            })
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    handleSizeChange(val) {
      const query = this.listInfo.query
      query.limit = val
      query.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.listInfo.query.page = val
      this.getList()
    },
    // 单选选中行数据
    singleSelectionChange(row) {
      console.log(row)
      this.$emit('selection-change', row)
    },
    // 选中行数据
    handleSelectionChange(rows) {
      this.selectionRows = rows
      this.$emit('selection-change', rows)
    },
    // 双击行事件
    handleRowDbclick(row) {
      this.$emit('row-dbclick', row)
    },
    // 派发按钮点击事件
    handleClick(event, data, index) {
      this.$emit('handle-click', event, data, index)
    },
    // 打开链接
    openLink(item, row) {
      // 构造url参数
      let query = {}
      // 行数据上获取的参数
      if (item.params && item.params.length) {
        item.params.forEach(el => {
          query[el] = row[el]
        })
      }
      if (item.tagInfo) {
        const tagInfo = { ...item.tagInfo }
        if (!tagInfo.props) {
          tagInfo.props = {}
        }
        tagInfo.props[tagInfo.pkName] = row[tagInfo.pkName]
        if (item.titleParams) {
          item.titleParams.forEach((el, i) => {
            tagInfo.title = tagInfo.title.replace(`{${i + 1}}`, row[el])
          })
        }
        tagInfo.props = { ...tagInfo.props, ...query }
        this.$openTag(this, tagInfo)
      } else {
        if (item.customParams) {
          query = { ...query, ...item.customParams }
        }
        // 构造路由
        let path = item.path
        // 动态路由参数
        if (item.dynamicRouteParams) {
          item.dynamicRouteParams.forEach(el => {
            path += `/${row[el] || el}`
          })
        }
        const routeUrl = this.$router.resolve({
          path,
          query
        })
        window.open(routeUrl.href, '_blank')
      }
    },
    // 导出
    async exportExcel() {
      if (!this.api) {
        this.$notify.warning({
          message: '导出数据错误',
          duration: 2000
        })
        return
      }
      const queryCondition = this.handleParams()
      const tempLimit = queryCondition.limit
      const tempPage = queryCondition.page
      // 用分页的单页行数设置导出最大行数
      queryCondition.page = 1
      queryCondition.limit = this.maxExportRows
      await this.handleExport(queryCondition)
      // 恢复单页行数设置
      queryCondition.limit = tempLimit
      queryCondition.page = tempPage
    },
    // 导出当前页
    exportCurrentPage() {
      if (!this.api) {
        this.$notify.warning({
          message: '导出数据错误',
          duration: 2000
        })
        return
      }
      this.handleExport(this.handleParams())
    },
    // 后台请求导出数据，处理数据
    async handleExport(query) {
      const result = await this.api(query)
      const tHeader = []
      this.$refs.table.columns.forEach(el => {
        // 排除操作列
        if (el.label !== '操作' && el.type !== 'selection' && el.label) {
          tHeader.push(el.label)
        }
      })
      const data = []
      result.data.rows.forEach((item, i) => {
        const row = []
        if (this.tableIndex) {
          row.push(i + 1)
        }
        this.$refs.table.columns.forEach(el => {
          const field = this.fieldList.find(f => f.prop === el.property)
          if (el.property && field) {
            if (field.type === 'tag' && field.tagOptions) {
              // 标签列展示信息转换
              row.push(field.tagOptions[item[el.property] ? item[el.property] : ''].name)
            } else if (field.dictType) {
              // 字典列展示信息转换
              const dict = this.dicts[field.dictType].find(e => e.value === item[el.property])
              row.push(dict ? dict.labelDefault : item[el.property])
            } else {
              row.push(item[el.property])
            }
          }
        })
        data.push(row)
      })
      export_json_to_excel({
        header: tHeader,
        data,
        filename: this.exportFileName
      })
    },
    // 校验多选/单选 是否选择了行数据
    checkRow() {
      if (this.selectionRows.length < 1 && StringUtils.isBlank(this.singleSelectValue)) {
        this.svMessageBox({
          title: '提示',
          messageTitle: '请至少选择一行数据'
        })
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.common-table {
  .table-pagination-container {
    padding: 15px 0;
  }
}
::v-deep.el-radio .el-radio__label {
  display: none;
}
</style>

<template>
  <div>
    <sv-query
      :fields="queryFieldList"
      :biz-buttons="bizButtons"
      :common-buttons="commonButtons"
      :data.sync="listQuery"
      @handle-button-event="handleButtonEvent"
    />
    <div style="padding: 20px">
      <sv-table
        ref="svTable"
        pk="id"
        :api="pageQuery"
        :query="listQuery"
        :refresh="tableInfo.refresh"
        :field-list="tableInfo.fieldList"
        :data.sync="tableInfo.data"
        :selection="true"
        export-file-name="教材管理表"
        @selection-change="selectionChange"
      />
    </div>
    <sv-excel-import
      ref="svExcelImport"
      :visible.sync="dialogExcelVisible"
      @excel-import="excelImport"
    />
  </div>
</template>

<script>
import { pageQuery } from './api'

export default {
  name: 'TextbookManagement',
  data() {
    return {
      pageQuery,
      // 搜索框
      queryFieldList: [
        {
          type: 'input',
          prop: 'textbookCode',
          label: '教材编号'
        },
        {
          type: 'input',
          prop: 'textbookName',
          label: '教材名字'
        },
        {
          type: 'select',
          prop: 'year',
          dictType: 'year',
          label: '年级'
        },
        {
          type: 'select',
          prop: 'major',
          dictType: 'major',
          label: '专业'
        }
      ],
      // 搜索条件
      listQuery: {
        page: 1,
        limit: 20
      },
      // 业务按钮
      bizButtons: [
        {
          name: '新增',
          show: true,
          event: 'add'
        },
        {
          name: '编辑',
          show: true,
          event: 'edit'
        },
        {
          name: '删除',
          show: true,
          event: 'delete'
        }
      ],
      // 通用按钮
      commonButtons: [
        {
          name: '导入模板下载',
          event: 'importDownload',
          show: true
        },
        {
          name: '导入',
          event: 'import',
          show: true
        },
        {
          name: '导出全部',
          event: 'exportAll',
          show: true
        }
      ],
      // 表格
      tableInfo: {
        // 刷新率
        refresh: 1,
        // 表格字段
        fieldList: [
          {
            label: '教材编号',
            prop: 'textbookCode',
            minWidth: 80
          },
          {
            label: '教材名字',
            prop: 'textbookName',
            minWidth: 120
          },
          {
            label: '年级',
            prop: 'year',
            minWidth: 80
          },
          {
            label: '专业',
            prop: 'major',
            minWidth: 120
          },
          {
            label: '教材单价',
            prop: 'price',
            minWidth: 80
          },
          {
            label: '创建时间',
            prop: 'crtTime'
          }
        ],
        // 数据
        data: []
      },
      currentRow: [],
      dialogExcelVisible: false
    }
  },
  computed: {
  },
  created() {
    //
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    selectionChange(row) {
      this.currentRow = row
    },
    handleButtonEvent(event) {
      switch (event) {
        case 'search':
          this.getList()
          break
        case 'add':
          this.add()
          break
        case 'edit':
          this.edit()
          break
        case 'delete':
          this.delete()
          break
        case 'importDownload':
          window.open('/static/importTemp/教材批量导入模板.xlsx', '_blank')
          break
        case 'import': // 导入
          this.dialogExcelVisible = true
          break
        case 'exportAll': // 导出全部
          this.$refs.svTable.exportExcel()
          break
        default:
          break
      }
    },
    add() {
      this.$openTag(this, {
        name: 'TextbookManagementDetails',
        title: '教材管理明细',
        status: 'create'
      })
    },
    async excelImport(data) {
      console.log(data)
      this.dialogExcelVisible = false
    }

  }
}
</script>

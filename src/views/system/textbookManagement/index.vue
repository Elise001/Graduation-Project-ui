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
        tabel-width="60%"
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
import { add, delObj, pageQuery } from './api'
import { parseTime } from '@/utils'

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
            label: '教材单价',
            prop: 'price',
            minWidth: 60
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
        id: null,
        status: 'add'
      })
    },
    edit() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.length > 1) {
        return this.svMessageBox({
          title: '提示',
          messageTitle: '只能选择一行数据'
        })
      }
      this.$openTag(this, {
        name: 'TextbookManagementDetails',
        title: '教材管理明细',
        id: this.currentRow[0].id,
        status: 'edit'
      })
    },
    async delete() {
      if (!this.$refs.svTable.checkRow()) return
      const message = '删除后将不可再恢复，谨慎操作，请确认是否需要删除？'
      await this.$confirm(message, '删除', {
        type: 'delete',
        confirmButtonText: '确定',
        cancelButtonText: '返回'
      })
        .then(async() => {
          // eslint-disable-next-line no-unused-vars
          for (const item of this.currentRow) {
            await delObj(item.id)
          }

          this.getList()
          this.$notify({
            title: '成功',
            type: 'success',
            message: '操作成功',
            duration: 2000
          })
        })
    },
    async excelImport(data) {
      const list = []
      data.forEach(item => {
        const excelData = {}
        excelData.textbookCode = item['教材编号']
        excelData.textbookName = item['教材名字']
        excelData.price = item['教材单价']
        excelData.crtTime = parseTime(new Date())
        list.push(excelData)
      })

      const res = await add(list)
      try {
        if (res.status === 200) {
          this.getList()
          this.$notify({
            title: '成功',
            type: 'success',
            message: '添加成功',
            duration: 2000
          })
        }
      } catch (e) {
        this.dialogExcelVisible = false
      }
      this.dialogExcelVisible = false
    }

  }
}
</script>

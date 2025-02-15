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
        :table-index="true"
        :single-select="true"
        export-file-name="教材预订表"
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
import { batch, delObj, pageQuery, putObj } from './api'
import { parseTime } from '@/utils'

export default {
  name: 'TextbookReservation',
  data() {
    return {
      pageQuery,
      // 搜索框
      queryFieldList: [
        {
          type: 'input',
          prop: 'orderCode',
          label: '订单编号'
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
        },
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
        },
        {
          name: '学生签名确认',
          show: true,
          event: 'studentSure'
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
            label: '订单编号',
            prop: 'orderCode',
            minWidth: 120
          },
          {
            label: '年级',
            prop: 'year',
            dictType: 'year',
            minWidth: 80
          },
          {
            label: '专业',
            prop: 'major',
            dictType: 'major',
            minWidth: 120
          },
          {
            label: '教材编号',
            prop: 'textbookCode',
            minWidth: 120
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
            label: '教材数量',
            prop: 'count',
            minWidth: 60
          },
          {
            type: 'tag',
            label: '订单状态',
            prop: 'orderStatus',
            dictType: 'orderStatus',
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
      currentRow: {},
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
        case 'studentSure':
          this.studentSure()
          break
        case 'importDownload':
          window.open('/static/importTemp/预订批量导入模板.xlsx', '_blank')
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
        name: 'TextbookReservationDetail',
        title: '教材预订明细',
        id: null,
        status: 'add'
      })
    },
    edit() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '00') {
        return this.$message({
          type: 'warning',
          message: '只能编辑订单状态为【待学生确认】的订单'
        })
      }

      this.$openTag(this, {
        name: 'TextbookReservationDetail',
        title: '教材预订明细',
        id: this.currentRow.id,
        status: 'edit'
      })
    },
    async delete() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '00') {
        return this.$message({
          type: 'warning',
          message: '只能删除订单状态为【待学生确认】的订单'
        })
      }

      const message = '删除后将不可再恢复，谨慎操作，请确认是否需要删除？'
      await this.$confirm(message, '删除', {
        type: 'delete',
        confirmButtonText: '确定',
        cancelButtonText: '返回'
      })
        .then(async() => {
          await delObj(this.currentRow.id)

          this.getList()
          this.$notify({
            title: '成功',
            type: 'success',
            message: '操作成功',
            duration: 2000
          })
        })
    },
    async studentSure() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '00') {
        return this.$message({
          type: 'warning',
          message: '只能确认订单状态为【待学生确认】的订单'
        })
      }

      const message = '签名确认后不可编辑，请谨慎操作'
      await this.$confirm(message, '签名确认', {
        type: 'edit',
        confirmButtonText: '确定',
        cancelButtonText: '返回'
      })
        .then(async() => {
          const res = await putObj(this.currentRow.id, { id: this.currentRow.id, orderStatus: '01' })
          if (res.status === 200) {
            this.getList()
            return this.$notify({
              title: '成功',
              type: 'success',
              message: '操作成功',
              duration: 2000
            })
          }
        })
    },
    async excelImport(data) {
      const list = []
      data.forEach(item => {
        const excelData = {}
        excelData.year = item['年级']
        excelData.major = item['专业']
        excelData.textbookCode = item['教材编号']
        excelData.count = item['教材数量']
        excelData.crtTime = parseTime(new Date())
        list.push(excelData)
      })

      const res = await batch(list)
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

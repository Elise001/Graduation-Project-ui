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
        :api="paymentQuery"
        :query="listQuery"
        :refresh="tableInfo.refresh"
        :field-list="tableInfo.fieldList"
        :data.sync="tableInfo.data"
        :table-index="true"
        :single-select="true"
        export-file-name="教材费支付表"
        @selection-change="selectionChange"
      />
    </div>
  </div>
</template>

<script>
import { paymentQuery, putObj } from '@/views/system/textbookReservation/api.js'

export default {
  name: 'Payment',
  data() {
    return {
      paymentQuery,
      // 搜索框
      queryFieldList: [
        {
          type: 'input',
          prop: 'orderCode',
          label: '订单编号'
        },
        {
          type: 'input',
          prop: 'textbookCode',
          label: '教材编号'
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
          name: '付款',
          show: true,
          event: 'payment'
        }
      ],
      // 通用按钮
      commonButtons: [
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
            label: '教材编号',
            prop: 'textbookCode',
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
            label: '退换数量',
            prop: 'ref1',
            minWidth: 60
          },
          {
            label: '订单金额',
            prop: 'ref2'
          },
          {
            type: 'tag',
            label: '订单状态',
            prop: 'orderStatus',
            dictType: 'orderStatus',
            minWidth: 80
          }
        ],
        // 数据
        data: []
      },
      currentRow: {}
    }
  },
  computed: {
    //
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
        case 'payment':
          this.payment()
          break
        case 'exportAll': // 导出全部
          this.$refs.svTable.exportExcel()
          break
        default:
          break
      }
    },
    async payment() {
      if (!this.$refs.svTable.checkRow()) return
      const status = ['04', '07']
      if (!status.includes(this.currentRow.orderStatus)) {
        return this.$message({
          type: 'warning',
          message: '请选择【待支付】的订单'
        })
      }

      const res = await putObj(this.currentRow.id, { id: this.currentRow.id, orderStatus: '08' })
      if (res.status === 200) {
        this.getList()
        return this.$notify({
          title: '成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
      }
    }
  }
}
</script>

<template>
  <div>
    <sv-query
      :fields="queryFieldList"
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
        export-file-name="操作日志表"
      />
    </div>
  </div>
</template>

<script>
import { pageQuery } from './api'

export default {
  name: 'TextbookOperate',
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
            minWidth: 150
          },
          {
            label: '教材编号',
            prop: 'textbookCode',
            minWidth: 150
          },
          {
            label: '操作',
            prop: 'operate',
            minWidth: 300
          },
          {
            label: '付款金额',
            prop: 'orderAmount',
            minWidth: 150
          },
          {
            label: '操作时间',
            prop: 'crtTime',
            minWidth: 150
          }
        ],
        // 数据
        data: []
      }
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
    handleButtonEvent(event) {
      switch (event) {
        case 'search':
          this.getList()
          break
        case 'exportAll': // 导出全部
          this.$refs.svTable.exportExcel()
          break
        default:
          break
      }
    }
  }
}
</script>

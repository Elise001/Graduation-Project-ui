<template>
  <div>
    <sv-query
      :fields="queryFieldList"
      :biz-buttons="bizButtons"
      :common-buttons="commonButtons"
      :data.sync="listQuery"
      :extra-dicts="extraDicts"
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
        export-file-name="教材订单表"
        @selection-change="selectionChange"
      >
        <template #col-handle="{ row }">
          <sv-button type="text" @click="handelDelete(row)">删除</sv-button>
        </template>
      </sv-table>
    </div>
  </div>
</template>

<script>
import { delObj, pageQuery } from './api'

export default {
  name: 'TextbookOrder',
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
          prop: 'year',
          label: '年级'
        },
        {
          type: 'input',
          prop: 'major',
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
        },
        {
          type: 'input',
          prop: 'count',
          label: '教材数量'
        },
        {
          type: 'input',
          prop: 'price',
          label: '教材单价'
        },
        {
          type: 'input',
          prop: 'orderStatus',
          label: '订单状态'
        },
        {
          type: 'input',
          prop: 'crtTime',
          label: '创建时间'
        }
      ],
      // 搜索条件
      listQuery: {
        page: 1,
        limit: 20
      },
      // 业务按钮
      bizButtons: [
        //
      ],
      // 通用按钮
      commonButtons: [
        {
          name: '导出全部',
          event: 'exportAll',
          show: true
        },
        {
          name: '导出当前页',
          event: 'exportCurrentPage',
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
            label: '年级',
            prop: 'year',
            minWidth: 150
          },
          {
            label: '专业',
            prop: 'major',
            minWidth: 150
          },
          {
            label: '教材编号',
            prop: 'textbookCode',
            minWidth: 150
          },
          {
            label: '教材名字',
            prop: 'textbookName',
            minWidth: 150
          },
          {
            label: '教材数量',
            prop: 'count',
            minWidth: 150
          },
          {
            label: '教材单价',
            prop: 'price',
            minWidth: 150
          },
          {
            label: '订单状态',
            prop: 'orderStatus',
            minWidth: 150
          },
          {
            label: '创建时间',
            prop: 'crtTime',
            minWidth: 150
          },
          {
            type: 'slot',
            label: '操作',
            prop: 'handle',
            minWidth: 150
          }
        ],
        // 数据
        data: []
      },
      // 手动字典
      extraDicts: {},
      currentRow: {}
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
    async handelDelete(data) {
      const message = '删除后将不可再恢复，谨慎操作，请确认是否需要删除？'
      await this.$confirm(message, '删除', {
        type: 'delete',
        confirmButtonText: '确定',
        cancelButtonText: '返回'
      })
        .then(async() => {
          await delObj(data.id)
          this.svMessage({
            type: 'success',
            title: '删除成功'
          })
          this.getList()
        })
    },
    handleButtonEvent(event) {
      switch (event) {
        case 'search':
          this.getList()
          break
        case 'exportAll': // 导出全部
          this.$refs.svTable.exportExcel()
          break
        case 'exportCurrentPage': // 导出当前页
          this.$refs.svTable.exportCurrentPage()
          break
        default:
          break
      }
    }
  }
}
</script>

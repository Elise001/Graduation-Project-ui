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
        export-file-name="部门表"
        @selection-change="selectionChange"
      >
        <template #col-handle="{ row }">
          <el-button type="text" @click="handelDelete(row)">编辑</el-button>
        </template>
        <template #col-handle="{ row }">
          <el-button type="text" @click="handelDelete(row)">删除</el-button>
        </template>
        <template #col-handle="{ row }">
          <el-button type="text" @click="handelDelete(row)">关联用户</el-button>
        </template>
      </sv-table>
    </div>
  </div>
</template>

<script>
import { delObj, pageQuery } from './api'

export default {
  name: 'Depart',
  data() {
    return {
      pageQuery,
      // 搜索框
      queryFieldList: [
        {
          type: 'input',
          prop: 'departCode',
          label: '部门编码'
        },
        {
          type: 'input',
          prop: 'departName',
          label: '部门名称'
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
        }
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
            label: '部门编码',
            prop: 'departCode',
            minWidth: 150
          },
          {
            label: '部门名称',
            prop: 'departName',
            minWidth: 150
          },
          {
            label: '部门权限',
            prop: 'permission',
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
    async handelDelete(data) {
      const message = '删除后将不可再恢复，谨慎操作，请确认是否需要删除？'
      await this.$confirm(message, '删除', {
        type: 'delete',
        confirmButtonText: '确定',
        cancelButtonText: '返回'
      })
        .then(async() => {
          await delObj(data.id)
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

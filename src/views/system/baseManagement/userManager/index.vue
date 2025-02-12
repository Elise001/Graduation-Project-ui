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
    <div style="padding: 30px">
      <sv-table
        ref="svTable"
        pk="id"
        :api="pageQuery"
        :query="listQuery"
        :refresh="tableInfo.refresh"
        :field-list="tableInfo.fieldList"
        :data.sync="tableInfo.data"
        :single-select="true"
        :table-index="true"
        export-file-name="系统用户表"
        @selection-change="selectionChange"
      >
        <template #col-handle="{ row }">
          <el-button type="text" @click="handelDelete(row)">删除</el-button>
        </template>
      </sv-table>
    </div>
  </div>
</template>

<script>
import { delObj, pageQuery } from './api'

export default {
  name: 'UserManager',
  data() {
    return {
      pageQuery,
      // 搜索框
      queryFieldList: [
        {
          type: 'input',
          prop: 'username',
          label: '账号'
        },
        {
          type: 'input',
          prop: 'name',
          label: '用户姓名'
        },
        {
          type: 'input',
          prop: 'mobilePhone',
          label: '手机号'
        },
        {
          type: 'input',
          prop: 'type',
          label: '年级'
        },
        {
          type: 'input',
          prop: 'major',
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
            label: '登陆账号',
            prop: 'username',
            minWidth: 150
          },
          {
            label: '用户姓名',
            prop: 'name',
            minWidth: 150
          },
          {
            label: '手机号',
            prop: 'mobilePhone',
            minWidth: 150
          },
          {
            label: '邮箱',
            prop: 'email',
            minWidth: 150
          },
          {
            label: '性别',
            prop: 'sex',
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
            label: '创建时间',
            prop: 'crtTime',
            minWidth: 150
          },
          {
            label: '是否禁用',
            prop: 'isDisabled',
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

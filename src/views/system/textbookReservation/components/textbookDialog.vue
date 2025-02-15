<template>
  <div>
    <sv-query
      :fields="queryFieldList"
      :data.sync="listQuery"
      @handle-button-event="handleButtonEvent"
    />
    <div style="padding-top: 20px">
      <sv-table
        ref="svTable"
        pk="id"
        :api="pageQuery"
        :query="listQuery"
        :refresh="tableInfo.refresh"
        :field-list="tableInfo.fieldList"
        :data.sync="tableInfo.data"
        :single-select="true"
        tabel-width="60%"
        @selection-change="selectionChange"
      />
    </div>
    <div style="text-align: center">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { pageQuery } from '@/views/system/textbookManagement/api.js'

export default {
  name: 'TextbookDialog',
  // props: {
  //   textbookCode: {
  //     type: String,
  //     default: ''
  //   }
  // },
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
      currentRow: {}
    }
  },
  computed: {
  },
  created() {
    // if (!StringUtils.isBlank(this.textbookCode)) {
    //   this.listQuery.textbookCode = this.textbookCode
    // }
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
        default:
          break
      }
    },
    async handleSubmit() {
      if (!this.$refs.svTable.checkRow()) return
      this.$emit('handle-submit', this.currentRow)
    },
    handleCancel() {
      this.$emit('handle-cancel')
    }
  }
}
</script>

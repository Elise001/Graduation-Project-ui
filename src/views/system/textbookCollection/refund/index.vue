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
        :api="refundQuery"
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
    <el-dialog
      style="margin-top:-80px;"
      title="申请退换"
      width="40%"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <return-dialog
        v-if="showDialog"
        :id="currentRow.id"
        :visible.sync="showDialog"
        @handle-cancel="handleCancel"
      />
    </el-dialog>
  </div>
</template>

<script>
import { orderStatus05, orderStatus06, refundQuery } from '@/views/system/textbookReservation/api.js'

export default {
  name: 'TextbookReservation',
  components: {
    // 物料弹窗
    'return-dialog': () => import('./components/returnDialog.vue')
  },
  data() {
    return {
      refundQuery,
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
          name: '申请退换',
          show: false,
          event: 'orderStatus04'
        },
        {
          name: '教材科审核',
          show: false,
          event: 'orderStatus05'
        },
        {
          name: '仓库管理确认',
          show: false,
          event: 'orderStatus06'
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
            label: '退换数量',
            prop: 'ref1',
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
      showDialog: false
    }
  },
  computed: {
    userType() {
      return this.$store.getters.type
    }
  },
  created() {
    if (this.userType.includes('ADMIN')) {
      // eslint-disable-next-line no-return-assign
      this.bizButtons.forEach(item => item.show = true)
    } else {
      if (this.userType.includes('XSFZR')) {
        this.bizButtons.filter(el => el.name === '申请退换')[0].show = true
      }
      if (this.userType.includes('JCK')) {
        this.bizButtons.filter(el => el.name === '教材科审核')[0].show = true
      }
      if (this.userType.includes('CKGLY')) {
        this.bizButtons.filter(el => el.name === '仓库管理确认')[0].show = true
      }
    }
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
        case 'orderStatus04':
          this.orderStatus04()
          break
        case 'orderStatus05':
          this.orderStatus05()
          break
        case 'orderStatus06':
          this.orderStatus06()
          break
        case 'exportAll': // 导出全部
          this.$refs.svTable.exportExcel()
          break
        default:
          break
      }
    },
    async orderStatus04() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '04') {
        return this.$message({
          type: 'warning',
          message: '请选择订单状态为【已领取】的订单'
        })
      }

      this.showDialog = true
    },
    async orderStatus05() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '05') {
        return this.$message({
          type: 'warning',
          message: '请选择订单状态为【待教材科审核退换】的订单'
        })
      }

      const form = {
        ...this.currentRow,
        orderStatus: '06',
        crtUserName: this.$store.getters.name
      }
      const res = await orderStatus05(form)
      if (res.status === 200) {
        this.getList()
        return this.$notify({
          title: '成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
      }
    },
    async orderStatus06() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '06') {
        return this.$message({
          type: 'warning',
          message: '请选择订单状态为【仓库管理确认】的订单'
        })
      }

      const form = {
        ...this.currentRow,
        orderStatus: '07',
        crtUserName: this.$store.getters.name
      }
      const res = await orderStatus06(form)
      if (res.status === 200) {
        this.getList()
        return this.$notify({
          title: '成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
      }
    },
    handleCancel() {
      this.showDialog = false
      this.getList()
    }
  }
}
</script>

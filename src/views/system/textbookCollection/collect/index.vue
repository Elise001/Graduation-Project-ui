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
        :api="collectQuery"
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
  </div>
</template>

<script>
import { collectQuery, orderStatus01, orderStatus02, orderStatus03 } from '@/views/system/textbookReservation/api.js'

export default {
  name: 'TextbookReservation',
  data() {
    return {
      collectQuery,
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
          name: '申请打印',
          show: false,
          event: 'orderStatus01'
        },
        {
          name: '教材科审核',
          show: false,
          event: 'orderStatus02'
        },
        {
          name: '领取教材',
          show: false,
          event: 'orderStatus03'
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
            label: '班级',
            prop: 'ref3',
            dictType: 'class',
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
      currentRow: {}
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
        this.bizButtons.filter(el => el.name === '申请打印')[0].show = true
        this.bizButtons.filter(el => el.name === '领取教材')[0].show = true
      }
      if (this.userType.includes('JCK')) {
        this.bizButtons.filter(el => el.name === '教材科审核')[0].show = true
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
        case 'orderStatus01':
          this.orderStatus01()
          break
        case 'orderStatus02':
          this.orderStatus02()
          break
        case 'orderStatus03':
          this.orderStatus03()
          break
        case 'exportAll': // 导出全部
          this.$refs.svTable.exportExcel()
          break
        default:
          break
      }
    },
    async orderStatus01() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '01') {
        return this.$message({
          type: 'warning',
          message: '请选择订单状态为【待打印】的订单'
        })
      }
      const form = {
        ...this.currentRow,
        orderStatus: '02',
        crtUserName: this.$store.getters.name
      }
      const res = await orderStatus01(form)
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
    async orderStatus02() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '02') {
        return this.$message({
          type: 'warning',
          message: '请选择订单状态为【待教材科审核】的订单'
        })
      }
      const form = {
        ...this.currentRow,
        orderStatus: '03',
        crtUserName: this.$store.getters.name
      }
      const res = await orderStatus02(form)
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
    async orderStatus03() {
      if (!this.$refs.svTable.checkRow()) return
      if (this.currentRow.orderStatus !== '03') {
        return this.$message({
          type: 'warning',
          message: '请选择订单状态为【待领取】的订单'
        })
      }
      const form = {
        ...this.currentRow,
        orderStatus: '04',
        crtUserName: this.$store.getters.name
      }
      const res = await orderStatus03(form)
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

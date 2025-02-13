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
        :single-select="true"
        :table-index="true"
        export-file-name="系统用户表"
        @selection-change="selectionChange"
      >
        <template #col-handle="{ row }">
          <sv-button type="text" @click="handleConfirm(row, '1')">禁用</sv-button>
          <sv-button type="text" @click="handleConfirm(row, '0')">恢复</sv-button>
          <sv-button type="text" @click="handelReset(row)">密码重置</sv-button>
        </template>
      </sv-table>
    </div>
    <el-dialog
      style="margin-top:-80px;"
      title="添加"
      width="40%"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <user-dialog
        v-if="showDialog"
        :id="currentRow.id"
        :visible.sync="showDialog"
        :status="status"
        @handle-cancel="handleCancel"
      />
    </el-dialog>
  </div>
</template>

<script>
import { pageQuery, passwordReset, putObj } from './api'

export default {
  name: 'UserManager',
  components: {
    // 物料弹窗
    'user-dialog': () => import('./components/userDialog.vue')
  },
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
        {
          name: '新增',
          show: true,
          event: 'add'
        },
        {
          name: '编辑',
          show: true,
          event: 'update'
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
            label: '登陆账号',
            prop: 'username',
            minWidth: 100
          },
          {
            label: '用户姓名',
            prop: 'name',
            minWidth: 100
          },
          {
            label: '手机号',
            prop: 'mobilePhone',
            minWidth: 120
          },
          {
            label: '邮箱',
            prop: 'email',
            minWidth: 120
          },
          {
            label: '性别',
            prop: 'sex',
            minWidth: 80
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
            minWidth: 120
          },
          {
            label: '创建时间',
            prop: 'crtTime',
            minWidth: 120
          },
          {
            label: '是否禁用',
            prop: 'isDisabled',
            dictType: 'yes_no',
            minWidth: 80
          },
          {
            type: 'slot',
            label: '操作',
            prop: 'handle'
          }
        ],
        // 数据
        data: []
      },
      // 手动字典
      extraDicts: {},
      currentRow: {},
      showDialog: false,
      status: 'add'
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
    async handleConfirm(data, isDisabled) {
      if (data.isDisabled === isDisabled) {
        return this.$notify({
          title: '提示',
          type: 'warning',
          message: '该账户已处于' + (isDisabled === '1' ? '禁用状态' : '恢复状态'),
          duration: 2000
        })
      }
      const updateData = {
        id: data.id,
        isDisabled: isDisabled
      }
      await putObj(data.id, updateData)
      this.getList()
      return this.$notify({
        title: '成功',
        type: 'success',
        message: '操作成功',
        duration: 2000
      })
    },
    async handelReset(data) {
      const res = await passwordReset(data)
      if (res.status === 200) {
        return this.svMessageBox({
          title: res.data,
          messageTitle: '新密码为：123456，请及时修改密码'
        })
      }
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
        case 'add':
          this.status = 'add'
          this.showDialog = true
          break
        case 'update':
          this.update()
          break
        default:
          break
      }
    },
    update() {
      if (!this.$refs.svTable.checkRow()) return

      this.status = 'edit'
      this.showDialog = true
    },
    handleCancel() {
      this.showDialog = false
      this.getList()
    }
  }
}
</script>

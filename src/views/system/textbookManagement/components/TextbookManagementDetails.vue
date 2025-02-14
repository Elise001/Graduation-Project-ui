<template>
  <sv-form-container :buttons="buttons" @handle-click="handleClick">
    <sv-card style="margin-top: 20px">
      <sv-form
        ref="svForm"
        :form.sync="form"
        :field-list="fieldList"
        :form-disabled="false"
        @handle-event="handleEvent"
      />
    </sv-card>
    <sv-card title="教材信息">
      <el-row style="margin-bottom: 20px;">
        <sv-button type="primary" :disabled="status === 'edit'" @click="handleAdd">新增</sv-button>
        <sv-button type="primary" :disabled="status === 'edit'" @click="handleDelete">删除</sv-button>
      </el-row>
      <sv-table
        ref="svTable"
        :field-list="tableInfo.fieldList"
        :data.sync="tableInfo.data"
        :table-index="false"
        :pager="false"
        :selection="true"
        :custom-table-height="customTableHeight"
        @selection-change="selectionChange"
      >
        <template #col-textbookCode="{ row }">
          <el-input v-model="row.textbookCode" placeholder="请填写教材编号" />
        </template>
        <template #col-textbookName="{ row }">
          <el-input v-model="row.textbookName" placeholder="请填写教材名字" />
        </template>
        <template #col-price="{ row }">
          <el-input-number
            v-model="row.price"
            placeholder="请填写教材单价"
            style="width: 100%"
            :min="0"
            :max="1000000000000"
            :precision="2"
            :step="1"
            :controls="false"
          />
        </template>
      </sv-table>
    </sv-card>
  </sv-form-container>
</template>

<script>

import { add, getObj, putObj } from '@/views/system/textbookManagement/api'
import { parseTime } from '@/utils'

export default {
  name: 'TextbookManagementDetails',
  data() {
    return {
      customTableHeight: `${document.body.clientHeight / 3.2}px`,
      buttons: [
        {
          type: 'primary',
          event: 'submit',
          name: '提交',
          show: true
        }
      ],
      form: {},
      fieldList: [
        {
          type: 'select',
          prop: 'year',
          label: '年级',
          dict: 'year',
          rules: {
            required: true
          },
          disabled: false,
          clearable: true
        },
        {
          type: 'select',
          prop: 'major',
          label: '专业',
          dict: 'major',
          rules: {
            required: true
          },
          disabled: false,
          clearable: true
        }
      ],
      // 表格
      tableInfo: {
        // 表格字段
        fieldList: [
          {
            type: 'slot',
            label: '教材编号',
            prop: 'textbookCode',
            minWidth: 150
          },
          {
            type: 'slot',
            label: '教材名字',
            prop: 'textbookName',
            minWidth: 150
          },
          {
            type: 'slot',
            label: '教材单价(元)',
            prop: 'price'
          }
        ],
        // 数据
        data: []
      },
      currentRow: []
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    status() {
      return this.$route.params.status
    }
  },
  created() {
    if (this.status === 'edit') {
      getObj(this.id).then(response => {
        this.form = response.data
        this.tableInfo.data.push(response.data)
      })
    }
  },
  methods: {
    selectionChange(row) {
      this.currentRow = row
    },
    handleAdd() {
      this.tableInfo.data.push({})
    },
    handleDelete() {
      this.tableInfo.data = this.tableInfo.data.filter(el => !this.currentRow.includes(el))
    },
    handleEvent(event, data) {
      switch (event) {
        default:
          console.log(event, data)
          break
      }
    },
    handleClick(event) {
      console.log(event)
      switch (event) {
        case 'submit':
          this.submit()
          break
        default:
          break
      }
    },
    async submit() {
      if (!this.$refs.svForm.validate()) return
      // eslint-disable-next-line no-prototype-builtins
      if (!this.tableInfo.data.length || this.tableInfo.data.some(el => !el.hasOwnProperty('textbookCode') || !el.hasOwnProperty('textbookName') || !el.hasOwnProperty('price'))) {
        return this.$notify({
          title: this.$t('common.message.indicate'),
          message: '请完善教材信息',
          type: 'warning',
          duration: 2000
        })
      }

      let res
      if (this.status === 'add') {
        const form = this.tableInfo.data.map(el => ({
          ...this.form,
          ...el,
          'crtTime': parseTime(new Date())
        }))
        res = await add(form)
      } else {
        const form = {
          ...this.form,
          ...this.tableInfo.data[0]
        }
        res = await putObj(form.id, form)
      }

      if (res.status === 200) {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '添加成功',
          duration: 2000
        })
        this.$router.back()
      } else {
        this.$notify({
          title: '出错',
          type: 'warning',
          message: '添加失败',
          duration: 2000
        })
      }
    }
  }
}
</script>

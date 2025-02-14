<template>
  <sv-form-container :cancel-to-path="cancelToPath" :buttons="buttons" @handle-click="handleClick">
    <sv-card title="form">
      <sv-form
              ref="svForm"
              :form.sync="form"
              :field-list="fieldList"
              @handle-event="handleEvent"
              :form-disabled='false'
      >></sv-form>
    </sv-card>
    <sv-card title="table">
      <el-row style="margin-bottom: 20px;">
        <sv-button type="primary" @click="handleAdd">新增</sv-button>
        <sv-button type="primary" @click="handleDelete">删除</sv-button>
      </el-row>
      <sv-table
              ref='svTable'
              :field-list='tableInfo.fieldList'
              :data.sync='tableInfo.data'
              :table-index="false"
              :pager="false"
              :selection="true"
              :custom-table-height="customTableHeight"
              @selection-changes="selectionChange"
      >
      </sv-table>
    </sv-card>
  </sv-form-container>
</template>

<script>
  export default {
    name: 'textbookOrder',
    data() {
      return {
        customTableHeight: `${document.body.clientHeight/3.2}px`,
        // 回退路由
        cancelToPath: '/dashboard',
        buttons: [
          {
            type: 'primary',
            event: 'submit',
            name: '提交',
            show: true
          },
          {
            type: 'primary',
            event: 'storage',
            name: '暂存',
            show: true
          }
        ],
        form: {},
        fieldList: [
                                                          {
                type: 'text',
                prop: 'orderCode',
                label: '订单编号',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'year',
                label: '年级',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'major',
                label: '专业',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'textbookCode',
                label: '教材编号',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'textbookName',
                label: '教材名字',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'count',
                label: '教材数量',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'price',
                label: '教材单价',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'orderStatus',
                label: '订单状态',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                                                                                                                                                                                                {
                type: 'text',
                prop: 'crtTime',
                label: '创建时间',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                                                                ],
        // 表格
        tableInfo: {
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
                                                                                                                  ],
          // 数据
          data: []
        },
        currentRow: []
      }
    },
    methods: {
      selectionChange(row) {
        this.currentRow = row
      },
      handleAdd() {
        this.tableInfo.data.push({
          num: '1'
        })
      },
      handleDelete() {
        this.tableInfo.data = this.tableInfo.data.filter(el => !this.currentRow.includes(el))
      },
      handleEvent(event, data) {
        switch (event) {
          default:
            console.log(data)
            break
        }
      },
      handleClick(event) {
        switch (event) {
          case 'submit':
            this.submit()
            break
          case 'storage':
            this.storage()
            break
          default:
            break
        }
      },
      submit() {
        if (!this.$refs.svForm.validate()) return
        //
      },
      storage() {
        //
      }
    }
  }
</script>

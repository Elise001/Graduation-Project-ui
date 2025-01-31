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
    name: 'user',
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
                prop: 'username',
                label: '登陆账号',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'password',
                label: '',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'name',
                label: '用户姓名',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'mobilePhone',
                label: '手机号',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'email',
                label: '',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'sex',
                label: '',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'type',
                label: '用户类型',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'crtTime',
                label: '',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                                                                                                                                                                                                                                            {
                type: 'text',
                prop: 'isDisabled',
                label: '是否禁用',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'departId',
                label: '部门',
                rules: {
                  required: false
                },
                disabled: false,
                clearable: true,
              },
                                                {
                type: 'text',
                prop: 'isSuperAdmin',
                label: '超级管理员 0-否 1-是',
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
                  label: '登陆账号',
                  prop: 'username',
                  minWidth: 150
                },
                                                        {
                  label: '',
                  prop: 'password',
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
                  label: '',
                  prop: 'email',
                  minWidth: 150
                },
                                                        {
                  label: '',
                  prop: 'sex',
                  minWidth: 150
                },
                                                        {
                  label: '用户类型',
                  prop: 'type',
                  minWidth: 150
                },
                                                        {
                  label: '',
                  prop: 'crtTime',
                  minWidth: 150
                },
                                                                                                                                                                                                                                                                                                                            {
                  label: '是否禁用',
                  prop: 'isDisabled',
                  minWidth: 150
                },
                                                        {
                  label: '部门',
                  prop: 'departId',
                  minWidth: 150
                },
                                                        {
                  label: '超级管理员 0-否 1-是',
                  prop: 'isSuperAdmin',
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

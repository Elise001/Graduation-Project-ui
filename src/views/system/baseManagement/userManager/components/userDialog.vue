<template>
  <div>
    <sv-form
      ref="svForm"
      :form.sync="form"
      :field-list="fieldList"
      :form-disabled="false"
      @handle-event="handleEvent"
    >></sv-form>
    <div>
      <div style="text-align: center">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { addObj, getObj, putObj } from '@/views/system/baseManagement/userManager/api'

export default {
  name: 'UserDialog',
  props: {
    id: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {},
      fieldList: [
        {
          type: 'text',
          prop: 'username',
          label: '登陆账号',
          rules: {
            required: true
          },
          disabled: this.status === 'edit',
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'text',
          prop: 'password',
          label: '密码',
          rules: {
            required: true
          },
          disabled: this.status === 'edit',
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'text',
          prop: 'name',
          label: '用户姓名',
          rules: {
            required: true
          },
          disabled: this.status === 'edit',
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
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
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'text',
          prop: 'email',
          label: '邮箱',
          rules: {
            required: false
          },
          disabled: false,
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'select',
          prop: 'sex',
          label: '性别',
          rules: {
            required: false
          },
          dict: 'sex',
          disabled: false,
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'select',
          prop: 'year',
          label: '年级',
          rules: {
            required: false
          },
          dict: 'year',
          disabled: false,
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'select',
          prop: 'major',
          label: '专业',
          rules: {
            required: false
          },
          dict: 'major',
          disabled: false,
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'select',
          prop: 'isSuperAdmin',
          label: '超级管理员 0-否 1-是',
          rules: {
            required: false
          },
          dict: 'yes_no',
          disabled: true,
          clearable: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        }
      ]
    }
  },
  created() {
    if (this.status === 'edit') {
      getObj(this.id).then(res => {
        this.form = res.data
      })
    }
  },
  methods: {
    handleEvent(event, data) {
      switch (event) {
        default:
          console.log(data)
          break
      }
    },
    async handleSubmit() {
      if (!this.$refs.svForm.validate()) return

      let res
      if (this.status === 'add') {
        res = await addObj(this.form)
      } else {
        res = await putObj(this.form.id, this.form)
      }

      if (res.status === 200) {
        this.$notify({
          title: '成功',
          type: 'success',
          message: '操作成功',
          duration: 2000
        })
        this.$emit('handle-cancel')
      }
    },
    handleCancel() {
      this.$emit('handle-cancel')
    }
  }
}
</script>

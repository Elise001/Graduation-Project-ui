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
import { addObj, getObj, putObj } from '@/views/system/baseManagement/departManager/api'
import { parseTime } from '@/utils'

export default {
  name: 'DepartDialog',
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
          prop: 'departCode',
          label: '部门编码',
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
          prop: 'departName',
          label: '部门名称',
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
          type: 'singlePopup',
          prop: 'permission',
          label: '部门权限',
          event: 'permissionEvent',
          rules: {
            required: false
          },
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
      this.form.crtTime = parseTime(new Date())

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

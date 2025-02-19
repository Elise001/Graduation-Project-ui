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
import { getObj, orderStatus04 } from '@/views/system/textbookReservation/api'

export default {
  name: 'UserDialog',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      fieldList: [
        {
          type: 'text',
          prop: 'orderCode',
          label: '订单编号',
          disabled: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'select',
          prop: 'year',
          label: '年级',
          dict: 'year',
          disabled: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'select',
          prop: 'major',
          label: '专业',
          dict: 'major',
          disabled: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'text',
          prop: 'textbookName',
          label: '教材名字',
          disabled: true,
          sm: 24,
          md: 24,
          lg: 24,
          xl: 24
        },
        {
          type: 'number',
          prop: 'count',
          label: '订书数量',
          precision: 0,
          disabled: true
        },
        {
          type: 'number',
          prop: 'ref1',
          label: '退书数量',
          precision: 0,
          rules: {
            required: true
          },
          disabled: false,
          clearable: true
        }
      ]
    }
  },
  created() {
    getObj(this.id).then(res => {
      this.form = res.data
    })
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

      const form = {
        ...this.form,
        orderStatus: '05',
        crtUserName: this.$store.getters.name
      }
      const res = await orderStatus04(form)

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

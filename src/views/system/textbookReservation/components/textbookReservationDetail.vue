<template>
  <sv-form-container :buttons="buttons" @handle-click="handleClick">
    <sv-card style="margin-top: 20px">
      <sv-form
        ref="svForm"
        :form.sync="form"
        :field-list="fieldList"
        :form-disabled="false"
        @handle-event="handleEvent"
        @handle-click="handleClick"
      />
    </sv-card>
    <el-dialog
      style="margin-top:-80px;"
      title="教材选择"
      width="60%"
      :visible.sync="showDialog"
      :close-on-click-modal="false"
      append-to-body
    >
      <textbook-dialog
        v-if="showDialog"
        :visible.sync="showDialog"
        @handle-submit="handleSubmit"
        @handle-cancel="handleCancel"
      />
    </el-dialog>
  </sv-form-container>
</template>

<script>

import { addObj, getObj, putObj } from '@/views/system/textbookReservation/api'
import { parseTime } from '@/utils'

export default {
  name: 'TextbookReservationDetail',
  components: {
    // 物料弹窗
    'textbook-dialog': () => import('./textbookDialog.vue')
  },
  data() {
    return {
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
          type: 'text',
          label: '订单编号',
          prop: 'orderCode',
          disabled: true
        },
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
        },
        {
          type: 'select',
          prop: 'ref3',
          label: '班级',
          dict: 'class',
          rules: {
            required: true
          },
          disabled: false,
          clearable: true
        },
        {
          type: 'singlePopup',
          prop: 'textbookCode',
          label: '教材编号',
          rules: {
            required: true
          },
          event: 'textbookCode',
          disabled: false,
          clearable: true
        },
        {
          type: 'text',
          label: '教材名字',
          prop: 'textbookName',
          disabled: true
        },
        {
          type: 'text',
          label: '教材单价(元)',
          prop: 'price',
          disabled: true
        },
        {
          type: 'number',
          prop: 'count',
          label: '教材数量',
          precision: 0,
          rules: {
            required: true
          },
          disabled: false,
          clearable: true
        }
      ],
      showDialog: false
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
      })
    }
  },
  methods: {
    handleEvent(event, data) {
      switch (event) {
        default:
          console.log(event, data)
          break
      }
    },
    handleClick(event) {
      switch (event) {
        case 'submit':
          this.submit()
          break
        case 'textbookCode':
          this.showDialog = true
          break
        default:
          break
      }
    },
    async submit() {
      if (!this.$refs.svForm.validate()) return

      let res
      if (this.status === 'add') {
        this.form.crtTime = parseTime(new Date())
        this.form.crtUserName = this.$store.getters.name
        res = await addObj(this.form)
      } else {
        res = await putObj(this.form.id, this.form)
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
    },
    handleSubmit(data) {
      console.log('data', data)
      this.form.textbookCode = data.textbookCode
      this.form.textbookName = data.textbookName
      this.form.price = data.price
      this.handleCancel()
    },
    handleCancel() {
      this.showDialog = false
    }
  }
}
</script>

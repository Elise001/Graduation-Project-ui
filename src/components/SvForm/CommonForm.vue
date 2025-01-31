<!--  功能：CommonForm表单
      作者：刘玉
      日期：2020-03-29
-->
<template>
  <el-form ref="form" :model="form" label-position="top" :disabled="formDisabled">
    <el-row>
      <el-col
        v-for="item in fieldList"
        :key="item.label"
        :xs="24"
        :sm="item.sm ? Number(item.sm) : 12"
        :md="item.md ? Number(item.md) : 8"
        :lg="item.lg ? Number(item.lg) : 6"
        :xl="item.xl ? Number(item.lg) : 6"
      >
        <el-form-item
          v-if="!item.hasOwnProperty('show') || (item.hasOwnProperty('show') && item.show)"
          :class="`${item.type}_class`"
          :label="item.label"
          :prop="item.prop"
          :rules="item.rules ? filter_rules(item.rules) : item.rules"
        >
          <!-- text类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-input
              v-if="item.type === 'text'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.write')}${item.label}`"
              :disabled="!!item.disabled"
              clearable
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- textarea类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-input
              v-if="item.type === 'textarea'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.write')}${item.label}`"
              :disabled="!!item.disabled"
              :autosize="{ minRows: item.minRows || 1, maxRows: item.maxRows || 4 }"
              type="textarea"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- textarea类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-input
              v-if="item.type === 'textareamore'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.write')}${item.label}`"
              :disabled="!!item.disabled"
              :autosize="{ minRows: 5, maxRows: 10 }"
              type="textarea"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- password类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-input
              v-if="item.type === 'password'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.write')}${item.label}`"
              :disabled="!!item.disabled"
              :show-password="!!item.showPassword"
              type="password"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- passProgress类型，密码输入框带密码强度条 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <sv-pass-progress
              v-if="item.type === 'passProgress'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :event="item.event"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :show-password="item.showPassword"
              @change="handleEvent"
            />
          </el-tooltip>
          <!-- singlePopup类型，input框通过点击按钮选择输入 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-input
              v-if="item.type === 'singlePopup'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
              readonly
              :disabled="!!item.disabled"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                :disabled="!!item.disabled"
                @click="handleClick(item.event, item.prop)"
              />
            </el-input>
          </el-tooltip>
          <!-- number类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-input-number
              v-if="item.type === 'number'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.write')}${item.label}`"
              :disabled="!!item.disabled"
              style="width: 100%"
              :min="item.min ? item.min : 0"
              :max="item.max || item.max === 0 ? item.max : 1000000000000"
              :precision="item.precision || item.precision === 0 ? item.precision : 2"
              :step="item.step ? item.step : 1"
              :controls="false"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- text联想查询输入框 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-autocomplete
              v-if="item.type === 'autocomplete'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.write')}${item.label}`"
              :disabled="!!item.disabled"
              type="autocomplete"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              style="display: inline-block; width:100%"
              @focus="handleFocus(item.api)"
              @select="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- select类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-select
              v-if="item.type === 'select'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.choose')}${item.label}`"
              :disabled="!!item.disabled"
              :filterable="!!item.filterable"
              :allow-create="!!item.allowCreate"
              clearable
              style="display: inline-block; width:100%;"
              @change="handleEvent(item.event, form[item.prop])"
            >
              <el-option
                v-for="el in getOptions(item) ? getOptions(item) : options[item.prop]"
                :key="el[item.optSet && item.optSet.value ? item.optSet.value : 'value']"
                :label="el[item.optSet && item.optSet.label ? item.optSet.label : 'labelDefault']"
                :value="el[item.optSet && item.optSet.value ? item.optSet.value : 'value']"
              />
            </el-select>
          </el-tooltip>
          <!-- multipleSelect类型，多选类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-select
              v-if="item.type === 'multipleSelect'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.choose')}${item.label}`"
              :disabled="!!item.disabled"
              multiple
              :collapse-tags="!!item.collapseTags"
              :filterable="!!item.filterable"
              clearable
              style="display: inline-block; width:100%;"
              @change="handleEvent(item.event, form[item.prop])"
            >
              <el-option
                v-for="el in getOptions(item) ? getOptions(item) : options[item.prop]"
                :key="el[item.optSet && item.optSet.value ? item.optSet.value : 'value']"
                :label="el[item.optSet && item.optSet.label ? item.optSet.label : 'labelDefault']"
                :value="el[item.optSet && item.optSet.value ? item.optSet.value : 'value']"
              />
            </el-select>
          </el-tooltip>
          <!-- cascader类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-cascader
              v-if="item.type === 'cascader'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.choose')}${item.label}`"
              :disabled="!!item.disabled"
              :filterable="!!item.filterable"
              clearable
              :props="item.optSet"
              :options="getOptions(item) ? getOptions(item) : options[item.prop]"
              style="display: inline-block; width: 100%;"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- citySelect类型，省市区选择组件 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <sv-city-select
              v-if="item.type === 'citySelect'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :event="item.event"
              :prop="item.prop"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :region="item.region"
              :level="item.level"
              @change="handleCitySelect"
            />
          </el-tooltip>
          <!-- areaSelect类型，省市区街道选择组件，取自区域管理 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <sv-area-select
              v-if="item.type === 'areaSelect'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :event="item.event"
              :prop="item.prop"
              :placeholder="item.placeholder"
              :disabled="item.disabled"
              :level="item.level"
              @change="handleCitySelect"
            />
          </el-tooltip>
          <!-- radio类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-radio-group
              v-if="item.type === 'radio'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :disabled="!!item.disabled"
              @change="handleEvent(item.event, form[item.prop])"
            >
              <el-radio
                v-for="el in getOptions(item) ? getOptions(item) : options[item.prop]"
                :key="el[item.optSet && item.optSet.label ? item.optSet.label : 'label']"
                :label="el[item.optSet && item.optSet.label ? item.optSet.label : 'label']"
                :disabled="!!item.disabled"
              >{{ el.name }}</el-radio>
            </el-radio-group>
          </el-tooltip>
          <!-- radiobutton类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-radio-group
              v-if="item.type === 'radiobutton'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :disabled="!!item.disabled"
              @change="handleEvent(item.event, form[item.prop])"
            >
              <el-radio-button
                v-for="el in getOptions(item) ? getOptions(item) : options[item.prop]"
                :key="el[item.optSet && item.optSet.label ? item.optSet.label : 'label']"
                :label="el[item.optSet && item.optSet.label ? item.optSet.label : 'label']"
                :disabled="!!item.disabled"
              />
            </el-radio-group>
          </el-tooltip>
          <!-- checkbox类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-checkbox-group
              v-if="item.type === 'checkbox'"
              :ref="item.prop"
              v-model="form[item.prop]"
              @change="handleEvent(item.event, form[item.prop])"
            >
              <el-checkbox
                v-for="el in getOptions(item) ? getOptions(item) : options[item.prop]"
                :key="el.label"
                :label="el.label"
                :disabled="!!item.disabled"
              />
            </el-checkbox-group>
          </el-tooltip>
          <!-- switch类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-switch
              v-if="item.type === 'switch'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :disabled="!!item.disabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-text="item.activeText"
              :inactive-text="item.inactiveText"
              :active-value="item.activeValue || item.activeValue === 0 ? item.activeValue : 1"
              :inactive-value="item.inactiveValue ? item.inactiveValue : 0"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- date类型 只有年份 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-date-picker
              v-if="item.type === 'dateYear'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.choose')}${item.label}`"
              :disabled="!!item.disabled"
              :picker-options="item.pickerOptions"
              style="width: 100%"
              type="year"
              value-format="yyyy"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- date类型 年月 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-date-picker
              v-if="item.type === 'dateMonth'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.choose')}${item.label}`"
              :disabled="!!item.disabled"
              :picker-options="item.pickerOptions"
              style="width: 100%"
              type="month"
              value-format="yyyy-MM"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- date类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-date-picker
              v-if="item.type === 'date'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.choose')}${item.label}`"
              :disabled="!!item.disabled"
              :picker-options="item.pickerOptions"
              style="width: 100%"
              type="date"
              value-format="yyyy-MM-dd"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- datetime类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-date-picker
              v-if="item.type === 'datetime'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `${$t('common.placeholder.choose')}${item.label}`"
              :disabled="!!item.disabled"
              :picker-options="item.pickerOptions"
              style="width: 100%"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- daterange类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-date-picker
              v-if="item.type === 'daterange'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :disabled="!!item.disabled"
              :picker-options="item.pickerOptions"
              :range-separator="item.rangeSeparator ? item.rangeSeparator : $t('common.placeholder.to')"
              :start-placeholder="item.startPlaceholder ? item.startPlaceholder : $t('common.placeholder.startTime')"
              :end-placeholder="item.endPlaceholder ? item.endPlaceholder : $t('common.placeholder.endTime')"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              type="daterange"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- datetimerange类型 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-date-picker
              v-if="item.type === 'datetimerange'"
              :ref="item.prop"
              v-model="form[item.prop]"
              :disabled="!!item.disabled"
              :picker-options="item.pickerOptions"
              :range-separator="item.rangeSeparator ? item.rangeSeparator : $t('common.placeholder.to')"
              :start-placeholder="item.startPlaceholder ? item.startPlaceholder : $t('common.placeholder.startTime')"
              :end-placeholder="item.endPlaceholder ? item.endPlaceholder : $t('common.placeholder.endTime')"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 100%"
              type="datetimerange"
              @change="handleEvent(item.event, form[item.prop])"
            />
          </el-tooltip>
          <!-- upload类型 -->
          <sv-upload-file
            v-if="item.type === 'upload'"
            :ref="item.prop"
            v-model="form[item.prop]"
            :storage-type="item.storageType"
            :multiple="item.multiple"
            :file-type="item.fileType"
            :limit="item.limit"
            :disabled="item.disabled"
            :list-type="item.listType"
            :dir="item.dir"
            :button-style="item.buttonStyle"
            :value="item.value"
            :size="item.size"
            :badge-hidden="item.badgeHidden"
          />
          <!-- 操作按钮 -->
          <el-tooltip effect="dark" :disabled="!item.tooltip" placement="right">
            <div slot="content" v-html="item.tooltip" />
            <el-button
              v-if="item.type === 'button'"
              :type="item.buttonType"
              :icon="item.icon"
              :disabled="item.disabled"
              @click="handleClick(item.event)"
            >
              {{ item.name }}
            </el-button>
          </el-tooltip>
          <template v-if="item.type === 'slot'">
            <slot :name="`form-item-${item.prop}`" />
          </template>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    // form表单
    form: {
      type: Object
    },
    // form表单是否禁用
    formDisabled: {
      type: Boolean,
      default: false
    },
    // 表单项列表
    fieldList: {
      type: Array
    }
  },
  data() {
    return {
      options: {},
      restaurants: []
    }
  },
  watch: {
    form: {
      handler() {
        // 初始化遍历feildList列表，为form对象添加属性
        this.fieldList.forEach(el => {
          // eslint-disable-next-line no-prototype-builtins
          if (this.form.hasOwnProperty(el.prop)) return
          if (
            el.type === 'checkbox' ||
            el.type === 'multipleSelect' ||
            el.type === 'daterange' ||
            el.type === 'datetimerange'
          ) {
            this.$set(this.form, el.prop, [])
          } else if (el.type === 'switch') {
            if (el.inactiveValue) {
              this.$set(this.form, el.prop, el.inactiveValue)
            } else {
              this.$set(this.form, el.prop, 0)
            }
          } else {
            this.$set(this.form, el.prop, undefined)
          }
        })
      },
      immediate: true
    }
  },
  created() {
    this.setOptions()
  },
  methods: {
    // 下拉框选项，后台获取
    setOptions() {
      const promise = this.fieldList
        .filter(item => item.optApi)
        .map(el => {
          const obj = {}
          obj[el.prop] = el.optApi(el.optQuery).then(response => (response ? response.data : []))
          return obj
        })
      Promise.all(promise).then(res => {
        res.forEach(el => {
          Object.keys(el).forEach(key => {
            el[key].then(data => {
              this.$set(this.options, key, data)
            })
          })
        })
      })
    },
    // 下拉框选项，数据字典获取，或者直接通过feildList传入
    getOptions(item) {
      if (item.dict) {
        // return this.$store.getters.dicts[item.dict]
        return []
      } else {
        return item.options
      }
    },
    // 省/市/区选择change事件
    handleCitySelect(event, data, prop) {
      // 省/市/区选择必填校验
      this.$nextTick(() => {
        this.$refs.form.validateField([prop])
      })
      // 触发父类中handleEvent方法
      this.$emit('handle-event', event, data)
    },
    // 按钮点击事件
    handleClick(event, prop) {
      this.$emit('handle-click', event, prop)
    },
    // 表单项change事件
    handleEvent(event, data) {
      this.$emit('handle-event', event, data)
    },
    handleFocus(api) {
      api().then(response => {
        this.restaurants = response.data.rows
      })
    },
    createFilter(queryString) {
      return e =>
        e.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
    },
    querySearch(queryString, cb) {
      const restaurants = this.restaurants
      const results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 表单校验，由父组件调用
    validate() {
      let validFlag = false // 初始化为 false
      this.$refs.form.validate((valid, errorFields) => {
        if (!valid) {
          const field = Object.keys(errorFields)[0]
          if (this.$refs[field]) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.$refs[field][0].hasOwnProperty('focus')) {
              this.$refs[field][0].focus() // 尝试聚焦到错误字段
            } else {
              this.$refs[field][0].$el.scrollIntoView({ behavior: 'smooth' }) // 平滑滚动到错误字段
            }
            document.documentElement.scrollTop = 0 // 滚动到顶部
          }
          // 校验不通过，调用父组件的 'handle-failed' 方法
          validFlag = false
          this.$emit('handle-failed')
        } else {
          // 校验通过，调用父组件的 'handle-submit' 方法
          validFlag = true
          this.$emit('handle-submit')
        }
      })
      return validFlag
    }
  }
}
</script>

<style lang="scss" scoped>
.text_class,
.password_class,
.singlePopup_class,
.number_class,
.select_class,
.multipleSelect_class,
.cascader_class,
.citySelect_class,
.date_class,
.datetime_class,
.daterange_class,
.datetimerange_class,
.radiobutton_class,
.radio_class,
.checkbox_class,
.switch_class,
.dateYear_class,
.button_class,
.areaSelect_class {
  height: 56px;
}
.autocomplete_class {
  height: 56px;
}
::v-deep.el-input-number .el-input__inner{
  text-align: left;
}
</style>

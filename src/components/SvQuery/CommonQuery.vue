<!-- 通用模板封装 查询-->
<template>
  <div class="query-box">
    <div class="condition-box">
      <!-- 搜索栏 -->
      <el-row>
        <el-col v-for="item in fields" :key="item.prop" :md="3" :lg="3" :xl="3">
          <el-row style="padding-bottom: 10px">
            <!-- 文本输入框 -->
            <el-input
              v-if="item.type === 'input'"
              v-model="conditions[item.prop]"
              style="width: 95%"
              :placeholder="item.label"
              clearable
              :disabled="!!item.disabled"
              @keyup.enter.native="handleEvent('search')"
              @input="changeValue(conditions[item.prop], item)"
            />
            <!-- 下拉框 -->
            <el-select
              v-if="item.type === 'select'"
              v-model="conditions[item.prop]"
              style="width: 95%"
              :placeholder="item.label"
              :filterable="!!item.filterable"
              :disabled="!!item.disabled"
              clearable
              :multiple="!!item.multiple"
              @keyup.enter.native="handleEvent('search')"
              @change="changeValue(conditions[item.prop], item)"
            >
              <el-option
                v-for="item in dicts[item.dictType]"
                :key="item.value"
                :label="item.labelDefault"
                :value="item.value"
              />
            </el-select>
            <!-- 日期格式 -->
            <el-date-picker
              v-if="item.type === 'date'"
              v-model="conditions[item.prop]"
              :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
              :disabled="!!item.disabled"
              :picker-options="item.pickerOptions"
              clearable
              style="width: 95%"
              :type="item.dateType ? item.dateType : 'date'"
              :value-format="item.valueFormat ? item.valueFormat : 'yyyy-MM-dd'"
              @keyup.enter.native="handleEvent('search')"
              @change="changeValue(conditions[item.prop], item)"
            />
            <!-- 年份选择 -->
            <el-date-picker
              v-if="item.type === 'year'"
              :ref="item.prop"
              v-model="conditions[item.prop]"
              :placeholder="item.label"
              type="year"
              value-format="yyyy"
              :start-placeholder="item.startPlaceholder"
              :end-placeholder="item.endPlaceholder"
              clearable
              style="width: 95%"
              @keyup.enter.native="handleEvent('search')"
              @change="changeValue(conditions[item.prop], item)"
            />
            <!-- 预留插槽 -->
            <slot v-if="item.type === 'slot'" :name="`condition-${item.prop}`" />
          </el-row>
        </el-col>
        <!-- 搜索 -->
        <el-button type="primary" icon="el-icon-search" class="filter-item" size="mini" @click="handleEvent('search')">查询</el-button>
        <!-- 重置 -->
        <el-button type="primary" icon="el-icon-refresh" class="filter-item" size="mini" @click="resetFilter">重置</el-button>
      </el-row>
    </div>
    <!-- 按钮 -->
    <el-row>
      <!-- 业务按钮 -->
      <template v-for="item in bizButtons">
        <el-button
          v-if="item.show"
          :key="item.event"
          :type="item.type || 'primary'"
          :disabled="item.disabled"
          class="operate-btn"
          size="mini"
          @click="handleEvent(item.event)"
        >
          {{ item.name }}
        </el-button>
      </template>
      <span v-if="bizButtons.length && commonButtons.length">&nbsp;|&nbsp;</span>
      <!-- 公共按钮 -->
      <template v-for="item in commonButtons">
        <el-button
          v-if="item.show"
          :key="item.event"
          :type="item.type || 'primary'"
          :disabled="item.disabled"
          class="operate-btn"
          size="mini"
          @click="handleEvent(item.event)"
        >
          {{ item.name }}
        </el-button>
      </template>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'SvQuery',
  props: {
    // 搜索框
    fields: {
      type: Array,
      required: true
    },
    // 业务按钮
    bizButtons: {
      type: Array,
      default: () => []
    },
    // 公共按钮
    commonButtons: {
      type: Array,
      default: () => []
    },
    // 搜索条件 数据源
    data: {
      type: Object,
      required: true
    },
    // 手动字典设置
    extraDicts: {
      type: Object,
      default: () => ({})
    },
    // 重置后的搜索条件（搜索默认值设置）
    resetQuery: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 双向绑定对象
      conditions: {},
      // 系统字典
      dicts: {}, // 不设置在computed是因为只读状态，后续需要添加手动字典值
      // 窗口宽度
      clientWidth: document.body.clientWidth
    }
  },
  computed: {
    //
  },
  watch: {
    // 监听 搜索条件
    data: {
      handler(newValue) {
        this.conditions = { ...this.conditions, ...newValue }
      },
      deep: true, // 监听data中的深层变化（嵌套属性）
      immediate: true // 初始化监听组件
    },
    // 监听 手动创建的字典值，因为生命周期钩子函数执行顺序问题，所以需要手动触发一次，不设置初始化监听，不设置为计算属性
    extraDicts: {
      handler(newValue) {
        this.dicts = { ...this.dicts, ...newValue }
      },
      deep: true
    }
  },
  mounted() {
    this.dicts = this.$dict
    // 在挂载阶段添加事件监听器，在窗口尺寸发生变化时更新Vue组件中的clientWidth数据属性
    window.addEventListener('resize', this.updateClientWidth)
  },
  // 在destroyed前移除监听器，避免内存泄露
  beforeDestroy() {
    window.removeEventListener('resize', this.updateClientWidth)
  },
  methods: {
    updateClientWidth() {
      this.clientWidth = document.body.clientWidth
    },
    handleEvent(event) {
      this.$emit('update:data', this.conditions)
      this.$emit('handle-button-event', event)
    },
    resetFilter() {
      // 重置搜索条件并设置默认值
      const filteredConditions = Object.entries(this.conditions)
        .filter(([key]) => !['page', 'limit', 'orderBy'].includes(key))
        .reduce((acc, [key]) => {
          acc[key] = this.resetQuery[key] !== undefined ? this.resetQuery[key] : undefined
          return acc
        }, {})

      this.$emit('update:data', filteredConditions)
      this.$emit('handle-button-event', 'search')
    },
    changeValue(value, item) {
      if (typeof item.callback === 'function') {
        item.callback.call(this, value, this.conditions)
      }

      if (typeof item.event === 'string') {
        this.$emit('handle-change-event', item.event, value)
      }
    },
    // 按钮点击事件
    handleClick(event) {
      this.$emit('handle-button-event', event)
    }
  }
}
</script>
<style lang="scss" scoped>
.query-box {
  padding: 10px 20px 0 20px;
  box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.1);
}
.query-show-box {
  padding: 5px 0;
  color: #409eff;
  font-size: 14px;
}
.condition-box {
  margin-top: 10px;
}
.operate-btn {
  margin-bottom: 10px;
}
</style>

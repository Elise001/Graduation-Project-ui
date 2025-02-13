/**
 * 全局注册组件
 * 以下直接在template内用即可，不需要再通过import的形式在父组件的components内引用
 */

// 引入组件
import CommonTable from '@/components/SvTable/CommonTable'
import SvQuery from '@/components/SvQuery/CommonQuery'
import CommonForm from '@/components/SvForm/CommonForm'
import SvButton from '@/components/SvButton/CommonButton'
import SvFormContainer from '@/components/SvFormContainer/index'
import SvCard from '@/components/SvCard/index'

// 注册组件
const plugins = {
  install(Vue) {
    // 原CommonTable，全局通用列表 <sv-table></sv-table>
    Vue.component('SvTable', CommonTable)
    Vue.component('SvQuery', SvQuery)
    Vue.component('SvForm', CommonForm)
    Vue.component('SvButton', SvButton)
    Vue.component('SvFormContainer', SvFormContainer)
    Vue.component('SvCard', SvCard)
  }
}
export default plugins

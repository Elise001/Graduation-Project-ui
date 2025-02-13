exports.install = function(Vue) {
  /**
   * 参数 item
   * required true  必填项
   * maxLength  字符串的最大长度
   * min 和 max 必须同时给 min < max  type=number
   * type 手机号 mobile
   *      邮箱   email
   *      网址   url
   *      各种自定义类型   定义在 src/utils/validate 中    持续添加中.......
   * */

  Vue.prototype.filter_rules = function(item) {
    if (item.disabled) {
      return
    }
    const rules = []
    if (item.required) {
      rules.push({
        required: true,
        message: item.message ? item.message : '该输入项为必填项!',
        trigger: ['blur', 'change']
      })
    }
    if (item.min || item.max) {
      rules.push({
        min: item.min,
        max: item.max,
        validator: this.GLOBAL.validateLength,
        trigger: ['blur', 'change']
      })
    }
    /* if (item.select && item.options.find(el => el.labelEnUs === item.value)) {
      rules.push({
        validator: isValidateHalfEnglish,
        trigger: ['blur', 'change']
      })
    } */
    if (item.type) {
      if (item.select && item.options && item.options.find(el => el.value === item.value)) return
      const type = item.type
      switch (type) {
        case '英文':
          rules.push({
            validator: this.GLOBAL.isValidateHalfEnglish,
            trigger: ['blur', 'change']
          })
          break
        case '英数字':
          rules.push({
            validator: this.GLOBAL.isValidateHalfENUM,
            trigger: ['blur', 'change']
          })
          break
        case '中文':
          rules.push({
            validator: this.GLOBAL.isValidateCh,
            trigger: ['blur', 'change']
          })
          break
        case '非中文':
          rules.push({
            validator: this.GLOBAL.isValidateNoCh,
            trigger: ['blur', 'change']
          })
          break
        case '半角文字':
          rules.push({
            validator: this.GLOBAL.isValidateHalfChar,
            trigger: ['blur', 'change']
          })
          break
        case '数字':
          rules.push({
            validator: this.GLOBAL.isValidateHalfNum,
            trigger: ['blur', 'change']
          })
          break
        case 'url':
          rules.push({
            validator: this.GLOBAL.isValidateURL,
            trigger: ['blur', 'change']
          })
          break
        case '小写字母':
          rules.push({
            validator: this.GLOBAL.isValidateLowerCase,
            trigger: ['blur', 'change']
          })
          break
        case '大写字母':
          rules.push({
            validator: this.GLOBAL.isValidateUpperCase,
            trigger: ['blur', 'change']
          })
          break
        case 'passwordStreflgth':
          rules.push({
            strength: item.strength,
            validator: this.GLOBAL.validatePasswordStreflgth,
            trigger: ['blur', 'change']
          })
          break
        case 'email':
          rules.push({
            validator: this.GLOBAL.isValidateEmail,
            trigger: ['blur', 'change']
          })
          break
        case '邮编':
          rules.push({
            validator: this.GLOBAL.isValidateZipCode,
            trigger: ['blur', 'change']
          })
          break
        case '电话号码':
          rules.push({
            validator: this.GLOBAL.isValidatePhoneNumber,
            trigger: ['blur', 'change']
          })
          break
        case '空格':
          rules.push({
            validator: this.GLOBAL.isValidateSpace,
            trigger: ['blur', 'change']
          })
          break
        case 'dateRangeRule':
          rules.push({
            days: item.days,
            validator: this.GLOBAL.dateRangeRule,
            trigger: ['blur', 'change']
          })
          break
        case 'dateRangeCurrRule':
          rules.push({
            days: item.days,
            validator: this.GLOBAL.dateRangeCurrRule,
            trigger: ['blur', 'change']
          })
          break
        case 'dateRangeCurrAddRule':
          rules.push({
            sday: item.sday,
            eday: item.eday,
            validator: this.GLOBAL.dateRangeCurrAddRule,
            trigger: ['blur', 'change']
          })
          break
        case 'isValidateDoubleNumber':
          rules.push({
            validator: this.GLOBAL.isValidateDoubleNumber,
            trigger: ['blur', 'change']
          })
          break
        default:
          rules.push({})
          break
      }
    }
    return rules
  }
}

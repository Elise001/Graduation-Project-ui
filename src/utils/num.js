// 金额转化千分位
export const toThousands = num => {
  if (!num) return '0.00'
  const info = parseFloat(num).toFixed(2).toString().split('.')
  num = info[0]
  let less0 = false
  if (String(num).startsWith('-')) {
    less0 = true
    num = Math.abs(num)
  }
  num = num.toString()
  let result = ''
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result
    num = num.slice(0, num.length - 3)
  }
  if (num) {
    result = num + result
  }
  info[0] = result
  if (less0) {
    return '-' + info.join('.')
  } else {
    return info.join('.')
  }
}
// 加法计算
export const NumberAdd = (arg1, arg2) => {
  if (!arg1) {
    arg1 = '0.00'
  }
  if (!arg2) {
    arg2 = '0.00'
  }
  let r1, r2
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  const n = r1 >= r2 ? r1 : r2
  return ((arg1 * m + arg2 * m) / m).toFixed(n)
}
// 累加计算,接收一个数组值
export const ArraySum = args => {
  if (!Array.isArray(args) || args.length === 0) {
    return '0.00'
  }

  let maxDecimals = 0

  // 计算数组中每个数字的小数位数，并找出最大的小数位数
  args = args.map(arg => {
    arg = arg || '0.00'
    let decimals = 0
    try {
      decimals = arg.toString().split('.')[1].length
    } catch (e) {
      decimals = 0
    }
    maxDecimals = Math.max(maxDecimals, decimals)
    return parseFloat(arg)
  })

  const multiplier = Math.pow(10, maxDecimals)

  // 累加所有数字
  const sum = args.reduce((acc, curr) => acc + curr * multiplier, 0)

  // 返回结果并保留相应的小数位数
  return (sum / multiplier).toFixed(maxDecimals)
}

// 减法计算
export const NumberSub = (arg1, arg2) => {
  if (!arg1) {
    arg1 = '0.00'
  }
  if (!arg2) {
    arg2 = '0.00'
  }
  let r1, r2
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  const n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
// 乘法计算
export const NumberMul = (arg1, arg2) => {
  if (!arg1) {
    arg1 = '0.00'
  }
  if (!arg2) {
    arg2 = '0.00'
  }
  let m = 0
  const s1 = arg1.toString()
  const s2 = arg2.toString()
  try {
    if (s1.split('.')[1]) {
      m += s1.split('.')[1].length
    }
  } catch (e) {
    console.log(e)
  }
  try {
    if (s2.split('.')[1]) {
      m += s2.split('.')[1].length
    }
  } catch (e) {
    console.log(e)
  }

  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m)
}
/**
 * 除法
 * @param {*} arg1
 * @param {*} arg2
 */
export const NumberDiv = (arg1, arg2, digit) => {
  if (!arg1) {
    arg1 = '0.00'
  }
  if (!arg2) {
    arg2 = '1.00'
  }
  let t1 = 0
  let t2 = 0
  try {
    t1 = arg1.toString().split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  try {
    t2 = arg2.toString().split('.')[1].length
  } catch (e) {
    console.log(e)
  }
  const r1 = Number(arg1.toString().replace('.', ''))
  const r2 = Number(arg2.toString().replace('.', ''))
  // 获取小数点后的计算值
  const result = ((r1 / r2) * Math.pow(10, t2 - t1)).toString()
  if (digit) {
    if (result.split('.')[1]) {
      const resultZeroNum = result.split('.')[1]
      if (resultZeroNum.length <= digit) {
        let zeroNum = ''
        for (let i = 0; i < parseInt(digit) - resultZeroNum.length; i++) {
          zeroNum += '0'
        }
        return result + zeroNum
      } else {
        const mathRound = Math.round(parseFloat(result) * Math.pow(10, digit))
        return mathRound / Math.pow(10, digit)
      }
    } else {
      let zeroNum = ''
      for (let i = 0; i < parseInt(digit); i++) {
        zeroNum += '0'
      }
      return result + '.' + zeroNum
    }
  } else {
    return Math.round(parseFloat(result))
  }
}
/** 处理金额的千分位转为数字 **/
export const StrToNumber = obj => {
  let less0 = false
  if (String(obj).startsWith('-')) {
    obj = String(obj).replace('-', '')
    less0 = true
  }
  const reg = /^[0-9]+.?[0-9]*$/ // 验证字符串是否是数字
  if (!reg.test(obj)) {
    // 为字符串 则判断是否存在','
    if ((obj + '').replace(/^\s\s*/, '').replace(/\s\s*$/, '') === '') {
      return 0.0
    }
    if (obj === undefined) {
      return 0.0
    }
    if ((obj || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')) {
      obj = obj.replace(/,/gi, '')
      if (less0) {
        return 0 - Math.abs(parseFloat(obj))
      } else {
        return obj
      }
    }
  } else {
    if (less0) {
      return 0 - obj
    } else {
      return obj
    }
  }
}

/**
 * 判断字符串是否为数字
 * @param {传入字符串} num
 */
export const NumberValidate = num => {
  const reg1 = /^[1-9]+[0-9]+.?[0-9]*$/
  const reg2 = /^0\.[0-9][0-9]*$/
  if (!(reg1.test(num) || reg2.test(num) || num === '0')) {
    return false
  } else {
    return true
  }
}

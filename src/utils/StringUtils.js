export default class StringUtils {
  /**
   * 自定义函数名：PrefixZero
   * @param num： 被操作数
   * @param n： 固定的总位数
   */
  static prefixZero(num, n, header) {
    return header + (Array(n).join(0) + num).slice(-n)
  }

  static isBlank(str) {
    return typeof str === 'undefined' || str === undefined || str === null || str === '' || str === ' '
  }
}

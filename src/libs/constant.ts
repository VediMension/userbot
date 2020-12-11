const apiUrl = 'http://qt.gtimg.cn/' // 接口地址
const timeSpan = 3000 // 时间间隔
const stockIndex = ['1.000001', '0.399001', '0.399006'] // 三大指数

/**
 * 比较两个金额大小并返回相应类名
 * @param value 被比较值
 * @param compare 比较值
 * @returns {string} 类名
 */
const comparePrice = (value: number, compare: number): string => {
  return value > compare ? 'gain-more' : (value < compare ? 'gain-less' : '')
}

/**
 * 将金额转为万为单位
 * @description 有万则加万字，没有则不显示万字
 * @param number {string|number} - 需要被转换的金额
 * @return {string} 返回转换后的金额字符串
 */
const transVolume = (number: string): string => {
  number = parseInt(number) + ''
  if (number.length > 4) {
    const integer = number.substring(0, number.length - 4)
    const decimal = integer.length > 3 ? '' : ('.' + number.substring(number.length - 5, number.length - 3))
    return integer + decima
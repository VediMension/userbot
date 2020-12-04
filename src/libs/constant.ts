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
  return value > compare ? 'gain-more' : (value < compare ? 'gai
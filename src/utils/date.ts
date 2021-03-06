//将日期时间转换为指定格式，如：YYYY-mm-dd HH:MM表示2019-06-06 19:45

export const dateFormat = (date: Date, fmt: string) => {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'D+': date.getDate().toString(), // 日
    'h+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    's+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'))
    }
  }
  return fmt
}

/** 用法
 let date = new Date()
dateFormat("YYYY-mm-DD hh:MM", date)
>>> 2019-06-06 19:45`
 */

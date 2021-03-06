const baseSize = 16 // 基准值
export const setRem = () => {
  // 相对于1920像素的缩放比
  let scale = document.documentElement.clientWidth / 1920
  // 根据屏幕变化 1rem 对应的 font-size
  scale = scale > 1 ? 1 : scale
  const realFont = baseSize * scale
  document.documentElement.style.fontSize = realFont + 'px'
}
window.onresize = () => {
  setRem()
}

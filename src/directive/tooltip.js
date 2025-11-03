
import Vue from 'vue'
import { Tooltip } from 'element-ui'

// 初始化组件
function createTooltip () {
  const el = document.createElement('div')
  document.body.appendChild(el)
  const Tooltip2 = Vue.extend(Tooltip)
  return new Tooltip2().$mount(el)
}

// 默认组件的位置显示
const PLACEMENT = 'top'

// 组件变量名 
let tooltipCom = null

// WeakMap不可迭代遍历键 使用引用数据类型作为key值 对象外部的引用消失，所对应的键值对就会自动被垃圾回收清除。
// 这里使用 dom作为key dom消失 键值对就会被垃圾回收清除 并释放内存
let tooltipContent = new WeakMap()
let tooltipFn = new WeakMap()
// 设置组件的内容 并展示
function setComponent (el) {
  tooltipCom.content = tooltipContent.get(el)
  // 显示和隐藏部分的逻辑从element源码中获取
  tooltipCom.referenceElm = el
  tooltipCom.$refs.popper && (tooltipCom.$refs.popper.style.display = 'none');
  tooltipCom.doDestroy()
  // Vue.nextTick(() => {
  tooltipCom.show()
  // })
}
// 鼠标进入事件
function enterEvent (el, binding) {
  if (binding.value || (el._eillipsis === undefined && (el._eillipsis = checkEillipsis(el))) || el._eillipsis) {
    setAttribute(binding.modifiers)
    setPlacement(binding)
    setComponent(el)
  }
}

// 鼠标移出事件 隐藏组件
function leaveEvent () {
  // 显示和隐藏部分的逻辑从element源码中获取
  Vue.nextTick(() => {
    tooltipCom.setExpectedState(false);
    tooltipCom.handleClosePopper();
  })
}

// 设置传给指令的参数 (v-my-directive:foo 中，参数为 "foo")
function setPlacement (binding) {
  let placement = binding.arg
  if (placement && /^(top|bottom|left|right)(-start|-end)?$/g.test(placement)) {
    tooltipCom.currentPlacement = placement
  } else {
    if (tooltipCom.currentPlacement !== PLACEMENT) {
      tooltipCom.currentPlacement = PLACEMENT
    }
  }
}
// 获取含修饰符的对象 修饰符相关逻辑
function setAttribute (modifiers) {
  const attributeList = Object.keys(modifiers)
  if (attributeList.length) {
    attributeList.forEach(i => {
      tooltipCom[i] = modifiers[i]
    })
  }
}

function getPadding (el) {
  const style = window.getComputedStyle(el, null)
  const pL = parseInt(style.paddingLeft) || 0
  const pR = parseInt(style.paddingRight) || 0
  const pT = parseInt(style.paddingTop) || 0
  const pB = parseInt(style.paddingBottom) || 0
  return {
    pL, pR, pT, pB
  }
}

function checkEillipsis (box) {
  console.log('checkEillipsis')
  const range = document.createRange()
  range.setStart(box, 0)
  range.setEnd(box, box.childNodes.length)
  let rangeH = range.getBoundingClientRect().height
  let rangeW = range.getBoundingClientRect().width
  const { pT, pB, pL, pR } = getPadding(box)
  const verticalPadding = pT + pB
  const horizontalPadding = pL + pR
  if (rangeH + verticalPadding > box.clientHeight) {
    return true
  } else {
    if (rangeW + horizontalPadding > box.clientWidth) {
      return true
    } else {
      return false
    }
  }
}

export default {
  bind: function (el, binding) { // 初始化设置
    // console.log([el], 'bind', binding)
    const value = binding.value || el.innerText
    tooltipContent.set(el, value) // 保存value值
    if (!tooltipCom) { // 初始化组件 只需初始化一次
      tooltipCom = createTooltip()
    }
    const mouseenterFn = () => enterEvent(el, binding)
    tooltipFn.set(el, mouseenterFn)
    // 鼠标移入事件 显示Tooltip 和内容
    el.addEventListener('mouseenter', mouseenterFn)
    // 鼠标移出事件 关闭Tooltip
    el.addEventListener('mouseleave', leaveEvent)
  },
  update: function (el, binding) { // 组件的 VNode 更新时调用
    Vue.nextTick(() => el._eillipsis = checkEillipsis(el))
    const value = binding.value || el.innerText
    tooltipContent.set(el, value) // 重新设置value值
  },
  unbind: function (el) { // 指令与元素解绑时调用
    // 移出鼠标事件
    const mouseenterFn = tooltipFn.get(el)
    el.removeEventListener('mouseenter', mouseenterFn)
    el.removeEventListener('mouseleave', leaveEvent)
    tooltipContent.delete(el) // 删除保存的键值对
    tooltipFn.delete(el)
  }
}
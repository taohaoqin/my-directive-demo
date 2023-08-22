import surround from '@/components/surround'
import Vue from 'vue'

let contentMap = new WeakMap()
const ele = document.createElement('div')

function mount (el, vnode, type) {
  if (type === 'bind' && !contentMap.get(el)) {
    const parent = el.parentNode
    const component2 = Vue.extend(surround)
    const item = new component2()
    item.$slots.default = [vnode]
    item.$mount(ele)
    parent.replaceChild(item.$el, el)
    contentMap.set(el, item)
    return item
  }
  if (type === 'update') {
    const item = contentMap.get(el)
    item.$slots.default = [vnode]
  }
}

function filterDirective (binding, vnode) {
  const directiveName = binding.name
  const directiveRawName = binding.rawName
  const newVnode = { ...vnode }
  const index = newVnode.data.directives.findIndex(i => i.name === directiveName || i.rawName === directiveRawName)
  newVnode.data.directives = [...newVnode.data.directives]
  newVnode.data.directives[index].def = { ...newVnode.data.directives[index].def }
  newVnode.data.directives[index].def.bind = () => { }
  return newVnode
}

function init (el, binding, vnode, type) {
  const childVnode = filterDirective(binding, vnode)
  Vue.nextTick(() => {
    mount(el, childVnode, type)
  })
}

export default {
  bind: function (el, binding, vnode) { // 初始化设置
    // console.log('bind', el, vnode)
    init(el, binding, vnode, 'bind')
  },
  update: function (el, binding, vnode) { // 组件的 VNode 更新时调用
    // console.log('update', 123)
    init(el, binding, vnode, 'update')
  },
  unbind: function (el, binding, vnode) { // 指令与元素解绑时调用
    // console.log('unbind', binding)
    const item = contentMap.get(el)
    if (item) {
      if (vnode.key === undefined) { // 判断是否在v-for循环中
        const parent = item.$el.parentNode
        parent.replaceChild(el, item.$el)
        item.$destroy()
      }
      item.$el.remove()
    }
  }
}
import Vue from 'vue'
import tooltip from './tooltip'
import surround from './surround'

const directives = {
  tooltip,
  surround
}

Object.keys(directives).forEach(name => Vue.directive(name, directives[name]))
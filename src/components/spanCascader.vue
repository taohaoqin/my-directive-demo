<!-- eslint-disable prettier/prettier -->
<template>
  <span>
    <MyCascader
      ref="myCascader"
      :value="CascaderValue"
      @input="inputValue"
      @change="changeValue"
      :options="options"
      v-bind="$attrs"
    />
    <span
      class="span-datepicker-label-wrapper"
      @click="clickLabel"
    >
      <slot />
    </span>
  </span>
</template>
<script>
import { Cascader } from 'element-ui'
const MyCascader = {
  extends: Cascader,
  name: 'sCascader',
  data() {
    return {
      referenceDom: null
    }
  },
  computed: {
    reference() {
      return this.referenceDom || this.$refs.reference.$el.nextElementSibling
    }
  },
  mounted() {
    this.$refs.reference.style.display = 'none'
  }
}
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MyCascader
  },

  data() {
    return {
      CascaderValue: this.value
    }
  },
  mounted() {
    this.$refs.myCascader.referenceDom = this.$slots.default[0].elm
  },
  methods: {
    clickLabel() {
      this.$refs.myCascader.toggleDropDownVisible(true)
    },
    inputValue(val) {
      this.CascaderValue = val

      this.$nextTick(() => {
        this.$emit('input', this.$refs.myCascader.checkedValue)
        this.$emit('inputValue', this.$refs.myCascader.presentText)
      })
    },
    changeValue(val) {
      this.$nextTick(() => {
        this.$emit('change', val)
      })
    }
  }
}
</script>

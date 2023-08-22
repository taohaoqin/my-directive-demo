<template>
  <div class="surround">
    <slot>{{msg}}</slot>
  </div>
</template>
<script>
export default {
  name: 'surround',
  data() {
    return {
      msg: '默认'
    }
  }
}
</script>

<style>
.surround {
  /* width: 50px; */
  margin-bottom: 10px;
  height: 20px;
  border: 1px solid red;
  /* background: yellow; */
  /* border-radius: 50%; */
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
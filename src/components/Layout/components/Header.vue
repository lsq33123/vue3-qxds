<template>
  <div class="header flex flex-between">
    <div></div>
    <div>
      <el-button type="text" @click="onExit">退出</el-button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
// import { } from '@/api'
export default {
  components: {},
  setup() {
    const router = useRouter()
    const state = reactive({
      key1: 'value1',
      key2: 'value2'
    })

    const onExit = () => {
      router.replace('/login')
    }

    return {
      ...toRefs(state),
      onExit
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  line-height: 60px;
  border-bottom: 1px solid #eee;
}
</style>

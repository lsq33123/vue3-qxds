<template>
  <el-container :class="classObj" class="app-container">
    <el-aside class="side-container">
      <Aside v-model:isCollapse="isCollapse" />
    </el-aside>
    <el-container class="main-container">
      <el-header><Header /></el-header>
      <el-main class="main-wrap"><AppMain /></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { computed, reactive, toRefs } from 'vue'
import Aside from './components/Aside'
import Header from './components/Header'
import AppMain from './components/AppMain'
// import { } from '@/api'
export default {
  components: { Aside, Header, AppMain },
  setup() {
    const state = reactive({
      isCollapse: false
    })

    const classObj = computed(() => {
      return {
        'hide-sidebar': state.isCollapse
        // 'open-sidebar': !state.isCollapse
      }
    })

    return {
      ...toRefs(state),
      classObj
    }
  }
}
</script>

<style lang="scss" scoped></style>

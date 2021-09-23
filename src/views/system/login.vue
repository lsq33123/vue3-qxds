<template>
  <div class="container">
    <div class="login-wrap-form">
      <el-row class="title"> XXXXX </el-row>
      <el-row class="item">
        <el-input v-model="username" placeholder="请输入账号/手机号"></el-input>
      </el-row>
      <!-- <el-row class="item">
        <el-input v-model="password" placeholder="请输入密码"></el-input>
      </el-row> -->
      <el-row :gutter="20" class="item">
        <el-col :span="16">
          <el-input v-model="password" placeholder="请输入验证码"></el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" style="width: 100%" @click="onGetCode">获取验证码</el-button>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-button type="primary" style="width: 100%" @click="login">登 录</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { setCookie } from '@/utils/cookie'
import { setStore } from '@/utils/store'
import { getToken, sendSmsCode } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const state = reactive({
      username: '15607733238',
      password: ''
    })

    const onGetCode = () => {
      sendSmsCode({ mobile: state.username }).then((res) => {
        console.log('res:', res)
      })
    }

    const login = () => {
      getToken({ username: state.username, password: state.password }).then((res) => {
        if (res.code === 0 && res.data) {
          setStore('user_name', state.username)
          setCookie('F-token', 'Bearer ' + res.data.token)
          router.replace('/')
          ElMessage.success('登录成功')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    return {
      ...toRefs(state),
      login
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.title {
  font-size: 30px;
  font-weight: bold;
  line-height: 60px;
  justify-content: center;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.item {
  margin-top: 20px;
}
.container {
  width: 100vw;
  height: 100vh;
  // background: url('require(@/assets/logo2.jpg)');
  background-image: url(https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN), url('../../assets/wallpaper.jpg');
  background-size: 100%;
  background-repeat: no-repeat;
  @extend .flex-center;
  .login-wrap-form {
    width: 400px;
    height: 300px;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
    background: #fff;
  }
}
</style>

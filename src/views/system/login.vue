<template>
  <div class="container flex-cc">
    <div class="login-wrap-form">
      <el-row class="title"> 优胜汽修大师 </el-row>
      <el-row class="item">
        <el-input v-model="username" placeholder="请输入账号/手机号"></el-input>
      </el-row>
      <!-- <el-row class="item">
        <el-input v-model="password" placeholder="请输入密码"></el-input>
      </el-row> -->
      <el-row :gutter="20" class="item">
        <el-col :span="15">
          <el-input v-model="code" placeholder="请输入验证码" @keyup.enter="onLogin"></el-input>
        </el-col>
        <el-col :span="9">
          <el-button type="primary" class="wp100" :disabled="!isGetCode" @click="onGetCode">{{ getTimeText }}</el-button>
        </el-col>
      </el-row>
      <el-row class="item">
        <el-button type="primary" class="wp100" :loading="loginLoading" @click="onLogin">登 录</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
import { reactive, toRefs } from 'vue'
import { setStore } from '@/utils/store'
import { sendSmsCode, getVerifySmsCode } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const state = reactive({
      username: '15607733238',
      password: '',
      code: '',
      getTimeText: '获取验证码', //获取验证码按钮文本
      isGetCode: true, //是否可以获取验证码
      loginLoading: false //登录loadding
    })

    const onGetCode = () => {
      timedown(30) //倒计时30秒
      state.isGetCode = false
      sendSmsCode({ mobile: state.username })
        .then(() => {
          ElMessage.success('验证码已发送~')
        })
        .catch(() => {
          state.getTimeText = '重新发送'
          state.isGetCode = true
        })
    }

    const onLogin = () => {
      state.loginLoading = true
      getVerifySmsCode({ mobile: state.username, code: state.code }).then((res) => {
        state.loginLoading = false
        if (res.result.token) {
          setStore('user_name', state.username)
          setStore('x-token', res.result.token)
          router.replace('/')
          ElMessage.success('登录成功')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }

    const timedown = (time) => {
      if (time == 'undefined') {
        time = 60
      }
      time = time - 1
      state.isGetCode = false
      if (time >= 0) {
        setTimeout(function () {
          timedown(time)
        }, 1000)
        state.getTimeText = '重新发送(' + time + 's)'
      } else {
        //倒计时结束
        state.getTimeText = '重新发送'
        state.isGetCode = true
      }
    }

    return {
      ...toRefs(state),
      onLogin,
      onGetCode
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title {
  font-size: 30px;
  font-weight: bold;
  line-height: 60px;
  justify-content: center;
}
.item {
  margin-top: 20px;
}
.container {
  width: 100vw;
  height: 100vh;
  // background: url('require(@/assets/logo2.jpg)');
  background-image: url(https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN), url('../../assets/images/wallpaper.jpg');
  // background-size: 100%;
  background-size: cover;
  background-repeat: no-repeat;
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

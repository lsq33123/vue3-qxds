import axios from 'axios'
import { BASE_URL } from '@/config'
import { isEmpty } from './validate'
import { getCookie } from './cookie'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import router from '@/router/index'
// import qs from 'qs'

export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 20000
})

// const whiteList = ['/login']

request.interceptors.request.use(
  (req) => {
    // debugger
    const token = getCookie('F-token')
    req.headers['Authorization'] = token //添加token验证

    const { params } = req //请求参数
    for (const key in params) {
      if (isEmpty(params[key])) {
        delete params[key]
      }
    }
    return req
  },
  (err) => {
    debugger
    return err
  }
)

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (!err.response) {
      // ElMessage.error('服务器故障~')
      ElMessage('服务器故障~')
      return
    }
    if (err.response.status == 401) {
      ElMessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.replace({
          path: 'login'
          // query: {
          //   redirect: router.currentRoute.fullPath
          // }
        })
        // store.dispatch('LogOut').then(() => {
        //   // router.replace({
        //   //   path: 'login',
        //   //   query: {
        //   //     redirect: router.currentRoute.fullPath
        //   //   }
        //   // })
        //    location.reload() // 为了重新实例化vue-router对象 避免bug
        // })
      })
    }
    return Promise.reject(err)
  }
)

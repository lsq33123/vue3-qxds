import axios from 'axios'
import { BASE_URL } from '@/config'
import { isEmpty } from './validate'
import { ElMessage } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import router from '@/router/index'
import { getStore } from '@/utils/store'
// import qs from 'qs'

export const request = axios.create({
  baseURL: BASE_URL,
  timeout: 20000
})

// const whiteList = ['/login']

request.interceptors.request.use(
  (req) => {
    req.headers['x-access-token'] = getStore('x-token') // 让每个请求携带自定义token
    if (req.method === 'get' && req.params) {
      const { params } = req //请求参数
      for (const key in params) {
        if (isEmpty(params[key])) {
          delete params[key]
        }
      }
    } else if (req.method === 'post') {
      if (req.data) {
        req.data = { data: req.data }
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
  (res) => {
    const errorCode = {
      '401': '认证失败，无法访问系统资源',
      '403': '当前操作没有权限',
      '404': '访问资源不存在',
      default: '系统未知错误，请反馈给管理员'
    }
    const code = res.data.errcode || res.data.code || 0 // 未设置状态码则默认成功状态
    const msg = res.data.message || errorCode['default'] // 获取错误信息
    console.log('res:', res)
    console.log('msg:', msg)
    if (code === 8) {
      ElMessage({ message: msg, type: 'error' })
      return Promise.reject('参数错误~')
    } else {
      return res.data
    }
  },
  (err) => {
    debugger
    if (!err.response) {
      // ElMessage.error('服务器故障~')
      ElMessage({ type: 'error', message: '服务器故障~' })
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

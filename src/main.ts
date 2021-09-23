import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
// import router from './router'
import { setupRouter } from './router'
import store from './store'
import { getStore } from '@/utils/store'
import { setRem } from './postFlex'
setRem() //响应式布局
// import { createRouterGuards } from './permission'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import locale from 'element-plus/lib/locale/lang/zh-cn'
import '@/assets/style/index.scss'

const app = createApp(App)
app.use(store)
// app.use(router)
// createRouterGuards(router)
setupRouter(app) //设置路由
app.use(ElementPlus, {
  locale: locale,
  size: getStore('elui-size') || 'medium' // set element-ui default size
})

app.mount('#app')

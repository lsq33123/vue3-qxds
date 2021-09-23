/** @format */

import { request } from '@/utils/request'
import { HttpResponse } from '@/interface'
import { isAvailable, setStore } from '@/utils/store'
const EXPIRED_TIME = 60 * 1 //1小时过期

//获取token
export const getToken = (body: any): HttpResponse<any> => request.post('/token/login', body)
// 获取获取用户信息 及相关权限菜单  user_name为登录账号
export const getUserInfo = (user_name: any): HttpResponse<any> => request.get('/users/getUserInfo2/' + user_name)

//数据字典===========================================================
/**获取数据字典数分类*/
export const getDictTypeTree = async (params: any) => {
  const cacheKey = 'dictTree-' + (params.cacheId ? JSON.stringify(params.cacheId) : '')
  const data = isAvailable(cacheKey)
  if (params?.cache && data) {
    return data
  } else {
    const res: any = await request.get('/dict/getTypeList', { params })
    res.code === 0 && setStore(cacheKey, res, 'session', EXPIRED_TIME)
    return res
  }
}
/**获取数据字典数据 */
export const getDictDataList = async (params: any) => {
  const cacheKey = 'dictData-' + (params.cacheId ? JSON.stringify(params.cacheId) : '')
  const data = isAvailable(cacheKey)
  if (params?.cache && data) {
    return data
  } else {
    const res: any = await request.get('/dict/getDataList', { params })
    res.code === 0 && setStore(cacheKey, res, 'session', EXPIRED_TIME)
    return res
  }
}

// export const getDictTypeTree = (): HttpResponse<any> => request.get('/dict/getTypeList')

// export const getDictDataList = (params:any): HttpResponse<any> => request.get('/dict/getDataList', {params})
//新增数据字典分类
export const addDictType = (body: any) => request.post('/dict/addTypeList', body)
//修改数据字典分类
export const updateTypeList = (body: any) => request.post('/dict/updateTypeList', body)
//新增数据字典
export const addDictData = (body: any) => request.post('/dict/addDataList', body)
//修改数据字典
export const updateDataList = (body: any) => request.post('/dict/updateDataList', body)

//用户===========================================================
// 获取用户列表
export const getUersList = (params: any): HttpResponse<any> => request.get('/users/getUsersList', { params })
// 新增用户列表
export const addUersList = (params: any): HttpResponse<any> => request.post('/users/addUser', params)
// 更新用户账号状态
export const updateUersStatus = (id: any, status: any): HttpResponse<any> => request.put('/users/updateUserStatus/' + id, { status: status })
// 更新用户
export const updateUser = (id: any, params: any): HttpResponse<any> => request.put('/users/updateUser/' + id, params)

//角色===========================================================
// 获取角色列表
export const getRoleList = (params: any): HttpResponse<any> => request.get('/role/getRoleList', { params })
// 新增角色列表
export const addRoleList = (params: any): HttpResponse<any> => request.post('/role/addRole', params)
// 更新角色状态
export const updateRoleStatus = (id: any, status: any): HttpResponse<any> => request.put('/role/updateRoleStatus/' + id, { status: status })
// 更新角色
export const updateRole = (id: any, params: any): HttpResponse<any> => request.put('/role/updateRole/' + id, params)

//菜单===========================================================
// 获取菜单列表
export const getMenuList = (params: any): HttpResponse<any> => request.get('/menu/getMenuList', { params })
// 新增菜单列表
export const addMenuList = (params: any): HttpResponse<any> => request.post('/menu/addMenu', params)
// // 更新菜单状态
// export const updateRoleStatus = (id, status): HttpResponse<any> =>
// request.put('/role/updateRoleStatus/' + id, {status: status})
// 更新菜单
export const updateMenu = (id: any, params: any): HttpResponse<any> => request.put('/menu/updateMenu/' + id, params)

//===============================================================
//获取短信验证码
export const sendSmsCode = (body: any) => request.post('/login/sendSmsCode', body)
//短信验证码登录
export const getVerifySmsCode = (body: any) => request.post('/login/verifySmsCode', body)

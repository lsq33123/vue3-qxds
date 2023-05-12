import { request } from '@/utils/request'
import { HttpResponse } from '@/interface'

//获取菜单列表 list结构
export const getMenuList = (body: any): HttpResponse<any> => request.post('/menu/list', body)

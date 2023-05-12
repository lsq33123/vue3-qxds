<template>
  <ListModel>
    <template #top>
      <Toolbar>
        <template #left>
          <div>
            <el-input v-model="params.name" placeholder="请输入菜单名称" clearable class="w200 mr20" style="width: 300px" />
            <el-select v-model="params.state" placeholder="请选择使用状态" clearable class="w200 mr20">
              <el-option :value="1" label="启用">启用</el-option>
              <el-option :value="0" label="禁用">禁用</el-option>
            </el-select>
            <el-button type="primary" @click="loadData">查询</el-button>
          </div>
        </template>
      </Toolbar>
    </template>
    <template #center>
      <el-table :data="tableData" :height="height" row-key="menuId" :tree-props="{ children: 'children' }">
        <!-- <el-table-column type="index" label="序号" width="60px" /> -->
        <el-table-column prop="menuName" label="菜单名称" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column prop="icon" label="图标" min-width="120px">
          <template v-slot="scope">
            {{ scope.row.icon }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" min-width="60px" />
        <el-table-column prop="path" label="路由路径" min-width="100px" />
        <el-table-column prop="component" label="组件路径" min-width="100px" />
        <el-table-column prop="visible" label="是否显示" min-width="70px">
          <template v-slot="scope">
            <!-- {{ scope.row.status === 1 ? '隐藏' : '显示' }} -->
            <el-switch v-model="scope.row.visible" :active-value="1" :inactive-value="0" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="70px" :formatter="statusFormat" />
        <el-table-column prop="update_time" label="更新时间" min-width="100px">
          <template v-slot="scope">
            {{ onFormat(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <!-- <template v-slot="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)">新增</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </template>
    <template #bottom>
      <Pagination :total="total" v-model:page="listPage.page" v-model:pageSize="listPage.page_size" @pagination="loadData" />
    </template>
  </ListModel>

  <!-- 添加或修改菜单对话框 -->
  <el-dialog :title="title" v-model="isShow" width="750px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单">
            <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true" placeholder="选择上级菜单" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType">
              <el-radio :label="1">目录</el-radio>
              <el-radio :label="2">菜单</el-radio>
              <el-radio :label="3">按钮</el-radio>
              <el-radio :label="4">页内容</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="form.menuType != 3 && form.menuType != 4" label="菜单图标">
            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
              <IconSelect ref="iconSelect" @selected="selected" />
              <template #reference>
                <el-input v-model="form.icon" placeholder="点击选择图标" readonly>
                  <template #prefix>
                    <svg-icon v-if="form.icon" :icon-class="form.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                    <i v-else class="el-icon-search el-input__icon" />
                  </template>
                </el-input>
              </template>
              <!-- <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input> -->
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 3 && form.menuType != 4">
            <template #label>
              <span>
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
            </template>
            <el-radio-group v-model="form.isFrame">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 3 && form.menuType != 4" prop="path">
            <template #label>
              <span>
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
            </template>
            <el-input v-model="form.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 2">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                组件路径
              </span>
            </template>
            <el-input v-model="form.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 1 && form.menuType != 4">
            <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
            <template #label>
              <span>
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType == 4">
            <el-input v-model="form.apiPath" placeholder="请输入权限地址" maxlength="200" />
            <template #label>
              <span>
                <el-tooltip content="接口地址" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                权限地址
              </span>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 3 && form.menuType != 4">
            <template #label>
              <span>
                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                显示状态
              </span>
            </template>
            <el-radio-group v-model="form.visible">
              <el-radio v-for="dict in visibleOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType != 3 && form.menuType != 4">
            <template #label>
              <span>
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
            </template>
            <el-radio-group v-model="form.status">
              <el-radio v-for="dict in statusOptions" :key="dict.dictValue" :label="dict.dictValue">{{ dict.dictLabel }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.menuType == 2">
            <template #label>
              <span>
                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
                是否缓存
              </span>
            </template>
            <el-radio-group v-model="form.isCache">
              <el-radio :label="1">缓存</el-radio>
              <el-radio :label="0">不缓存</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="备注" v-if="form.menuType != 1">
            <el-input v-model="form.remark" placeholder="请输入备注" maxlength="200" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { dateFormat } from '@/utils/date'
import { arrayToTree } from '@/utils/array'
import { onMounted, reactive, toRefs } from 'vue'
import { getMenuList } from '@/api/system'
import { removeEmpty } from '@/utils/common'
import Toolbar from '@/components/Toolbar'
import ListModel from '@/components/ListModel'
import Pagination from '@/components/Pagination'
import { ElMessage } from 'element-plus'
export default {
  components: {
    Toolbar,
    ListModel,
    Pagination
  },
  setup() {
    const state = reactive({
      height: document.body.clientHeight - 160,
      title: '',
      tableData: [],
      menuOptions: [],
      isShow: false,
      form: {},
      total: 34,
      params: {},
      listPage: {
        page: 1,
        page_size: 20
      },
      visibleOptions: [
        { dictValue: 1, dictLabel: '显示' },
        { dictValue: 0, dictLabel: '隐藏' }
      ],
      statusOptions: [
        { dictValue: 1, dictLabel: '正常' },
        { dictValue: 0, dictLabel: '停用' }
      ],
      rules: {
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        path: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }]
      }
    })
    onMounted(() => {
      loadData()
    })

    const loadData = () => {
      const p = { ...state.params, ...state.listPage }
      getMenuList(removeEmpty(p)).then((res) => {
        const data = res.result.list || []
        state.tableData = arrayToTree(data, 0, 'menuId', 'parentId')
      })
    }

    const onFormat = (val) => (val ? dateFormat(new Date(val), 'YYYY-mm-DD hh:MM:ss') : '')

    const statusFormat = (row) => {
      if (row.menuType == '3') {
        return ''
      }
      return row.status ? '启用' : '禁用'
    }

    const reset = () => {
      state.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: 1,
        orderNum: undefined,
        isFrame: 0,
        isCache: 1,
        visible: 1,
        status: 1
      }
    }

    const getTreeselect = () => {
      getMenuList().then((res) => {
        state.menuOptions = []
        const menu = { menuId: 0, menuName: '主类目', children: [] }
        menu.children = arrayToTree(res.result.list, 0, 'menuId', 'parentId')
        state.menuOptions.push(menu)
      })
    }

    const handleUpdate = (row) => {
      reset()
      getTreeselect()
      state.form = { ...row }
      state.isShow = true
      state.title = '修改菜单'
    }
    const cancel = () => {
      state.isShow = false
      reset()
    }
    return {
      ...toRefs(state),
      loadData,
      onFormat,
      statusFormat,
      handleUpdate,
      cancel
    }
  }
}
</script>

<style land="scss" scoped></style>

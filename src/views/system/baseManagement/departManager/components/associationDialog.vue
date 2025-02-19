<template>
  <div>
    <el-row>
      <el-col :span="11">
        <sv-card title="关联用户选择">
          <div class="filter-container">
            <el-input
              v-model="listQuery.username"
              style="width: 200px"
              class="filter-item"
              placeholder="登录账户"
              @keyup.enter.native="handleFilter"
            />
            <el-input
              v-model="listQuery.name"
              style="width: 200px"
              class="filter-item"
              placeholder="名称"
              @keyup.enter.native="handleFilter"
            />
            <el-button class="filter-item" type="primary" style="margin-left: 10px" @click="handleFilter">搜 索</el-button>
            <el-button class="filter-item" type="primary" @click="handleReset">重 置</el-button>
          </div>
          <!-- 列表 -->
          <sv-table
            ref="userTable"
            table-height-change="400"
            :table-index="true"
            :selection="true"
            :refresh="tableInfo.refresh"
            :data.sync="tableInfo.data"
            :field-list="tableInfo.fieldList"
            :api="pageQuery"
            :query="listQuery"
            @selection-change="selectionChange"
          />
        </sv-card>
      </el-col>
      <el-col :span="1" style="text-align: center; margin: 0 20px">
        <div style="margin-top: 150px">
          <el-button v-if="showButtons" type="primary" @click="addAssocUser">添加</el-button>
        </div>
        <div style="margin-top: 50px">
          <el-button v-if="showButtons" type="danger" @click="deleteAssocUser">移除</el-button>
        </div>
      </el-col>
      <el-col :span="11">
        <sv-card title="已关联用户：">
          <div class="filter-container">
            <el-input
              v-model="listQuery.username"
              style="width: 200px"
              class="filter-item"
              placeholder="登录账户"
              @keyup.enter.native="handleAssocFilter"
            />
            <el-input
              v-model="listQuery.name"
              style="width: 200px"
              class="filter-item"
              placeholder="名称"
              @keyup.enter.native="handleAssocFilter"
            />
            <el-button class="filter-item" type="primary" style="margin-left: 10px" @click="handleAssocFilter">搜 索</el-button>
            <el-button class="filter-item" type="primary" @click="handleAssocReset">重 置</el-button>
          </div>
          <sv-table
            ref="assocTable"
            table-height-change="400"
            :table-index="true"
            :selection="true"
            :refresh="assocTableInfo.refresh"
            :data.sync="assocTableInfo.data"
            :field-list="assocTableInfo.fieldList"
            :api="userPageQuery"
            :query="assocListQuery"
            @selection-change="assocSelectionChange"
          />
        </sv-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pageQuery } from '@/views/system/baseManagement/userManager/api'
import { addDepartUser, delDepartUser, userPageQuery } from '@/views/system/baseManagement/departManager/api'
import { parseTime } from '@/utils'

export default {
  name: 'AssociationDialog',
  props: {
    departId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      id: undefined,
      pageQuery,
      userPageQuery,
      tableInfo: {
        refresh: 1,
        data: [],
        fieldList: [
          {
            prop: 'name',
            label: '用户姓名'
          },
          {
            prop: 'username',
            label: '登录账号'
          }
        ]
      },
      listQuery: {
        page: 1,
        limit: 20,
        isDisabled: '0'
      },
      assocTableInfo: {
        refresh: 1,
        data: [],
        fieldList: [
          {
            prop: 'name',
            label: '用户姓名'
          },
          {
            prop: 'username',
            label: '登录账号'
          }
        ]
      },
      assocListQuery: {
        page: 1,
        limit: 20
      },
      selectedUser: [],
      selectedAssocUser: []
    }
  },
  computed: {
    userType() {
      return this.$store.getters.type
    },
    showButtons() {
      return this.userType.includes('ADMIN')
    }
  },
  mounted() {
    this.getList()
    this.getAssocList()
  },
  methods: {
    getList() {
      this.tableInfo.refresh = Math.random()
    },
    getAssocList() {
      this.assocListQuery.departId = this.departId
      this.assocTableInfo.refresh = Math.random()
    },
    handleFilter() {
      this.getList()
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        isDeleted: '0'
      }
      this.getList()
    },
    handleAssocFilter() {
      this.getAssocList()
    },
    handleAssocReset() {
      this.assocListQuery = {
        page: 1,
        limit: 20,
        departId: this.departId
      }
      this.getAssocList()
    },
    selectionChange(val) {
      this.selectedUser = val
    },
    assocSelectionChange(val) {
      this.selectedAssocUser = val
    },
    async addAssocUser() {
      if (!this.$refs.userTable.checkRow()) return
      // eslint-disable-next-line no-unused-vars
      for (const user of this.selectedUser) {
        const form = {
          departId: this.departId,
          userId: user.id,
          crtTime: parseTime(new Date())
        }
        await addDepartUser(form)
      }
      this.$notify({
        title: '成功',
        type: 'success',
        message: '操作成功',
        duration: 2000
      })
      this.getAssocList()
    },
    async deleteAssocUser() {
      if (!this.$refs.assocTable.checkRow()) return
      // eslint-disable-next-line no-unused-vars
      for (const member of this.selectedAssocUser) {
        await delDepartUser(member.id)
      }
      this.$notify({
        title: '成功',
        type: 'success',
        message: '操作成功',
        duration: 2000
      })
      this.getAssocList()
    }
  }
}
</script>

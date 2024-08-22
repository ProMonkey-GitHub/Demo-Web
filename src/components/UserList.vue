<template>
  <el-main>
    <el-input v-model="searchQuery" placeholder="搜索用户" class="input-with-select">
      <template v-slot:append>
        <el-button type="primary" @click="searchUsers">搜索</el-button>
      </template>
    </el-input>
    <el-table :data="users" style="width: 100%">
      <el-table-column prop="uid" label="用户ID"></el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column prop="birthday" label="生日"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row.uid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button type="primary" @click="handleAddUser">新增用户</el-button>

    <el-dialog title="新增用户" v-model="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="newUser">
        <el-form-item label="用户名">
          <el-input v-model="newUser.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="newUser.gender" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="newUser.birthday" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="newUser.role" placeholder="请选择">
            <el-option label="user" value="user"></el-option>
            <el-option label="admin" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitNewUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      title="修改用户信息"
      v-model="editDialogVisible"
      width="30%"
      :before-close="handleEditClose"
    >
      <el-form :model="editUser">
        <el-form-item label="用户ID">
          <el-input v-model="editUser.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editUser.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editUser.gender" placeholder="请选择">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="editUser.birthday" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editUser.role" placeholder="请选择">
            <el-option label="user" value="user"></el-option>
            <el-option label="admin" value="admin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditUser">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </el-main>
</template>

<script>
import axios from 'axios'
import { Search } from '@element-plus/icons-vue'

export default {
  data() {
    return {
      Search,
      dialogVisible: false,
      editDialogVisible: false,
      newUser: {
        userName: '',
        gender: '',
        birthday: '',
        role: ''
      },
      editUser: {
        id: 0,
        userName: '',
        gender: '',
        birthday: '',
        role: ''
      },
      users: [],
      searchQuery: '',
      currentPage: 1,
      pageSize: 5,
      total: 0
    }
  },
  methods: {
    handleAddUser() {
      this.dialogVisible = true
      this.newUser = {
        // 重置表单数据
        userName: '',
        gender: '',
        birthday: '',
        role: ''
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    async submitNewUser() {
      try {
        await axios.post('http://localhost:8080/api/users/add', this.newUser)
        this.$message.success('用户信息添加成功')
        this.dialogVisible = false
        this.fetchUsers() // 刷新用户列表
      } catch (error) {
        this.$message.error('用户信息添加失败')
        console.error(error)
      }
    },
    async fetchUsers() {
      // 调用API获取用户列表
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/fetch?page=${this.currentPage}&page_size=${this.pageSize}`
        )
        this.$message.success('用户信息获取成功')
        this.users = response.data.data.users
        this.total = response.data.data.total
      } catch (error) {
        this.$message.error('用户信息获取失败')
        console.error(error)
      }
    },
    async searchUsers() {
      // 根据searchQuery搜索用户
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/search?page=${this.currentPage}&page_size=${this.pageSize}&keyword=${this.searchQuery}`
        )
        this.$message.success('用户信息搜索成功')
        this.users = response.data.data.users
        this.total = response.data.data.total
      } catch (error) {
        this.$message.error('用户信息搜索失败')
        console.error(error)
      }
    },
    handleEdit(user) {
      // 打开编辑用户表单
      this.editDialogVisible = true
      this.editUser = {
        // 重置表单数据
        id: user.uid,
        userName: user.name,
        gender: user.gender,
        birthday: user.birthday,
        role: user.role
      }
    },
    handleEditClose() {
      this.editDialogVisible = false
    },
    async submitEditUser() {
      try {
        await axios.post('http://localhost:8080/api/users/edit', this.editUser)
        this.$message.success('用户信息修改成功')
        this.editDialogVisible = false
        this.fetchUsers() // 刷新用户列表
      } catch (error) {
        this.$message.error('用户信息修改失败')
        console.error(error)
      }
    },
    async handleDelete(userId) {
      // 调用API删除用户
      try {
        await axios.post(`http://localhost:8080/api/users/delete?id=${userId}`)
        this.fetchUsers() // 刷新用户列表
        this.$message.success('用户信息删除成功')
      } catch (error) {
        this.$message.error('用户信息删除失败')
        console.error(error)
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchUsers()
    }
  },
  created() {
    this.fetchUsers()
  }
}
</script>

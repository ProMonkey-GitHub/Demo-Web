<template>
  <el-main>
    <el-input v-model="searchQuery" placeholder="搜索用户" class="input-with-select">
      <template v-slot:append>
        <el-button type="primary" :icon="Search" @click="searchUsers">搜索</el-button>
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
          <el-button type="danger" size="small" @click="handleDelete(row.id)">删除</el-button>
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
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker v-model="newUser.birthday" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="newUser.role" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitNewUser">确 定</el-button>
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

export default {
  data() {
    return {
      dialogVisible: false,
      newUser: {
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
        this.$message.success('用户添加成功')
        this.dialogVisible = false
        this.fetchUsers() // 刷新用户列表
      } catch (error) {
        this.$message.error('添加用户失败')
        console.error(error)
      }
    },
    async fetchUsers() {
      // 调用API获取用户列表
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/fetch?page=${this.currentPage}&page_size=${this.pageSize}`
        )
        this.$message.success('用户信息拉取成功')
        this.users = response.data.data.users
        this.total = response.data.data.total
        console.log(response)
      } catch (error) {
        this.$message.error('拉取用户信息失败')
        console.error(error)
      }
    },
    searchUsers() {
      // 根据searchQuery搜索用户
    },
    handleEdit(user) {
      // 打开编辑用户表单
    },
    async handleDelete(userId) {
      // 调用API删除用户
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

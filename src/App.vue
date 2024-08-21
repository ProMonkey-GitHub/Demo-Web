<template>
  <el-container>
    <el-header class="header">用户信息管理</el-header>
    <el-container>
      <router-view />
    </el-container>
  </el-container>
</template>

<script>

</script>

<style scoped>
.header{
  font-family: 'Arial', sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #1880f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
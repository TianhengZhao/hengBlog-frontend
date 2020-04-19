<template>
  <el-menu :default-active="activeIndex" class="menu" mode="horizontal" @select="handleSelect">
    <el-menu-item index="1">我的博客</el-menu-item>
    <el-menu-item index="2">聊天</el-menu-item>
    <el-submenu index="2" class="info">
      <template slot="title" >名字</template>
      <el-menu-item index="2-1">修改头像</el-menu-item>
      <el-menu-item index="2-2">修改密码</el-menu-item>
      <el-menu-item index="2-3">退出登录</el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>/* eslint-disable */
  export default {
    name: 'mainpage'
  }
</script>

<style scoped>
.info{
  float:right
}
</style>

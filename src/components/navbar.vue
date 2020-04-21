<template>
  <el-menu  :default-active="$route.path" mode="horizontal" router>    <!--router使得index成为导航路由-->
    <el-menu-item index="/">我的博客</el-menu-item>
    <el-submenu index="2" v-if="sharedState.is_authenticated">
      <template slot="title">我的名字</template>
      <el-menu-item index="2-1">修改头像</el-menu-item>
      <el-menu-item index="2-2">修改密码</el-menu-item>
      <el-menu-item index="2-3" @click="logout">退出登录</el-menu-item>
    </el-submenu>
  </el-menu>

</template>

<script>/* eslint-disable */
import store from '../store'
  export default {
    name: 'navbar',
    data () {
      return {
        sharedState: store.state
      }
    },
    methods: {
      logout (e) {
        store.logoutAction()
        this.$router.push('/login')
      }
    }

  }
</script>
<style scoped>
</style>

<template>
  <el-menu  :default-active="$route.path" mode="horizontal" router>    <!--router使得index成为导航路由-->
    <el-menu-item index="/">我的博客</el-menu-item>
    <el-submenu index="2" v-if="sharedState.is_authenticated" class="setting">
      <template slot="title" >{{sharedState.user_name}}</template>
      <el-menu-item :index="'/'+sharedState.user_id">我的主页</el-menu-item>   <!--动态设置路由-->
      <el-menu-item index="2-2">修改信息</el-menu-item>
      <el-menu-item index="2-3" @click="logout">退出登录</el-menu-item>
    </el-submenu>
    <el-menu-item v-else class="setting" index="/login">登录</el-menu-item>
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
  .setting{
    float: right;
  }
  .sub{
    width:50px;
  }
</style>

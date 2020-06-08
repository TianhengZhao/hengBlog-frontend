<template>
  <el-menu  :default-active="$route.path" mode="horizontal" router>    <!--router使得index成为导航路由-->
    <el-menu-item index="/" class="el-icon-s-home">我的博客</el-menu-item>
    <el-submenu index="2" v-if="sharedState.is_authenticated" class="setting">
      <template slot="title" >{{sharedState.user_name}}</template>
      <el-menu-item :index="'/user/'+sharedState.user_id" >我的主页</el-menu-item>   <!--动态设置路由-->
      <el-menu-item index="/notifications">消息通知
        <el-badge  is-dot class="red_dot display_none" id="badge"></el-badge>
      </el-menu-item>
      <el-menu-item index="2-3" @click="logout">退出登录</el-menu-item>
    </el-submenu>
    <el-menu-item v-else class="setting" index="/login">登录</el-menu-item>
  </el-menu>

</template>

<script>/* eslint-disable */
import store from '../store'
import axios from 'axios'
  export default {
    name: 'navbar',
    data () {
      return {
        sharedState: store.state    //不能用
      }
    },
    methods: {
      logout (e) {
        store.logoutAction()
        this.$router.push('/login')
      }
    },
    mounted () {
      $(function(){
        let since = 0

        setInterval(function () {                // 设置间隔
          var new_received_likes = 0
          var new_received_comment = 0
          var new_received_followers = 0
          if (window.localStorage.getItem('token')){
            let myid = JSON.parse(atob(window.localStorage.getItem('token').split('.')[1])).id
          const path = 'user/hasNewNoti/' + myid + '?since=' + since
          axios.get(path)
            .then((response) => {
              if (response.data) {
                for (var i = 0; i < response.data.length; i++) {
                  switch (response.data[i].name) {
                    case 'new_received_likes':
                      new_received_likes = response.data[i].payload_json
                      break

                    case 'new_received_comment':
                      new_received_comment = response.data[i].payload_json
                      break

                    case 'new_received_followers':
                      new_received_followers = response.data[i].payload_json
                      break
                  }
                  since = response.data[i].timestamp
                }
                if (new_received_likes + new_received_comment + new_received_followers > 0)
                  $('#badge').removeClass('display_none')
                else
                  $('#badge').addClass('display_none')
              }
            })
        }
        },10000)

        })

    }

  }
</script>
<style scoped>
  .setting{
    float: right;
  }
  .display_none{
    display: none;
  }

</style>

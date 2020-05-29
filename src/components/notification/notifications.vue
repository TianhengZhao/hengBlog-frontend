<template>
  <el-container class="containe" v-if="user">
    <el-aside  class="aside">
      <div class="info1">
        <div class="ava"><img :src='user._links.avatar'/></div>
        <div class="ava" ><h2>{{this.user.username}}</h2></div>
      </div>
      <el-divider></el-divider>
      <el-menu default-active="/notifications/receivedComments" active-text-color="#dd6161" router>
        <el-menu-item index="/notifications/receivedComments">
          <i class="el-icon-chat-line-round"></i>
          <span slot="title" class="option">新评论</span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedLikes">
          <i class="el-icon-star-off"></i>
          <span slot="title" class="option">新的赞</span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedFollowers">
          <i class="el-icon-user"></i>
          <span slot="title" class="option">新粉丝</span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedMessages">
          <i class="el-icon-message"></i>
          <span slot="title" class="option">新私信</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>/* eslint-disable */
import store from '../../store'
export default {
    name: 'notifications',
  data () {
    return {
      sharedState: store.state,
      user: ''
    }
  },
  methods:{
    getUser (id) {
      const path = '/user/'+id
      this.$axios.get(path)
        .then((response) => {
          if(response.status === 200)
            this.user= response.data
          console.log(this.user)
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error)
          //this.$router.push("/NotFound")                  这里的问题还没解决
        });
    },
  },
  created () {
      this.getUser(this.sharedState.user_id)
  }
}
</script>

<style scoped>
  .containe{
    height: 500px;                  /*如何设置和页面登高 height=100%*/
  }
  .ava{
    float: left;
    margin: 15px;
  }
  .info1{
    margin-top: 20px;
    display: inline-block;
  }
  .aside{
    border-radius: 5px;
    box-shadow: 0 0 10px #cac6c6;
    width: 250px;
    height: 100%;
  }
  img{
    width: 60px;
    height: 60px;
    border-radius: 50%;

  }


</style>

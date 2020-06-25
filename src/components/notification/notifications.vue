<template>
  <el-container class="containe" v-if="user">
    <el-aside  class="aside">
      <div class="info1">
        <div class="ava"><img :src='user._links.avatar'/></div>
        <div class="ava" ><h2>{{this.user.username}}</h2></div>
      </div>
      <el-divider></el-divider>
      <el-menu default-active="/notifications/followedPosts" active-text-color="#dd6161" router>
        <el-menu-item index="/notifications/followedPosts">
          <i class="el-icon-document"></i>
          <span slot="title" class="option">新博客</span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedComments">
          <i class="el-icon-chat-line-round"></i>
          <span slot="title" class="option">新评论<el-badge  is-dot class="red_dot display_none" id="badge1"></el-badge></span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedLikes">
          <i class="el-icon-star-off"></i>
          <span slot="title" class="option">新的赞<el-badge  is-dot class="red_dot display_none" id="badge2"></el-badge></span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedFollowers">
          <i class="el-icon-user"></i>
          <span slot="title" class="option">新粉丝<el-badge  is-dot class="red_dot display_none" id="badge3"></el-badge></span>
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
import axios from 'axios'
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

        });
    },
  },
  created () {
      this.getUser(this.sharedState.user_id)
  },
  mounted () {
    $(function(){
      let since = 0

      setInterval(function () {                // 设置间隔
        var new_received_likes=0
        var new_received_comment=0
        var new_received_followers=0
        let myid = JSON.parse(atob(window.localStorage.getItem('token').split('.')[1])).id
        const path = 'user/hasNewNoti/'+myid+'?since='+since
        axios.get(path)
          .then((response)=>{
            if(response.data)
            {
              for(var i = 0; i < response.data.length; i++) {
                switch (response.data[i].name) {
                  case 'new_received_likes':
                    new_received_likes = response.data[i].payload_json
                    if(new_received_likes>0)
                      $('#badge2').removeClass('display_none')
                    else
                      $('#badge2').addClass('display_none')
                    break

                  case 'new_received_comment':
                    new_received_comment = response.data[i].payload_json
                    if(new_received_comment>0)
                      $('#badge1').removeClass('display_none')
                    else
                      $('#badge1').addClass('display_none')
                    break

                  case 'new_received_followers':
                    new_received_followers = response.data[i].payload_json
                    if(new_received_followers>0)
                      $('#badge3').removeClass('display_none')
                    else
                      $('#badge3').addClass('display_none')
                    break
                }
                since = response.data[i].timestamp
              }
            }
          })
      },10000)
    })

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
  .display_none{
    display: none;
  }

</style>

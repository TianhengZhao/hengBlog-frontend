<template>
  <el-container v-if="user">
    <el-aside  class="aside">
      <div class="info1">
        <div class="ava">
          <img :src='this.user._links.avatar' alt="头像"/>
        </div>
        <div class="ava" >
          <h2>{{this.user.username}}</h2>
        </div>
      </div>
      <el-divider></el-divider>
      <el-menu
        default-active="/notifications/followedPosts"
        active-text-color="#dd6161"
        router
      >
        <el-menu-item index="/notifications/followedPosts">
          <i class="el-icon-document"></i>
          <span slot="title" class="option">新博客</span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedComments">
          <i class="el-icon-chat-line-round"></i>
          <span slot="title" class="option">
            新评论
            <el-badge
              is-dot
              class="red_dot display_none"
              id="badge1"
            ></el-badge>
          </span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedLikes">
          <i class="el-icon-star-off"></i>
          <span slot="title" class="option">
            新的赞
            <el-badge
              is-dot
              class="red_dot display_none"
              id="badge2"
            ></el-badge>
          </span>
        </el-menu-item>
        <el-menu-item index="/notifications/receivedFollowers">
          <i class="el-icon-user"></i>
          <span slot="title" class="option">
            新粉丝
            <el-badge
              is-dot
              class="red_dot display_none"
              id="badge3"
            ></el-badge>
          </span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <div class="wrap">
        <router-view class="route"></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script>
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
  methods: {
    getUser (id) {
      const path = '/user/' + id
      this.$axios.get(path)
        .then((response) => {
          if (response.status === 200) {
            this.user = response.data
          }
          console.log(this.user)
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created () {
    this.getUser(this.sharedState.user_id)
  },
  mounted () {
    $(function () {
      let since = 0
      setInterval(function () { // 设置间隔
        var newReceivedLikes = 0
        var newReceivedComments = 0
        var newReceivedFollowers = 0
        let myid = JSON.parse(atob(window.localStorage.getItem('token').split('.')[1])).id
        const path = 'user/hasNewNoti/' + myid + '?since=' + since
        axios.get(path)
          .then((response) => {
            if (response.data) {
              for (var i = 0; i < response.data.length; i++) {
                switch (response.data[i].name) {
                  case 'newReceivedLikes':
                    newReceivedLikes = response.data[i].payload_json
                    if (newReceivedLikes > 0) {
                      $('#badge2').removeClass('display_none')
                    } else {
                      $('#badge2').addClass('display_none')
                    }
                    break
                  case 'newReceivedComments':
                    newReceivedComments = response.data[i].payload_json
                    if (newReceivedComments > 0) {
                      $('#badge1').removeClass('display_none')
                    } else {
                      $('#badge1').addClass('display_none')
                    }
                    break
                  case 'newReceivedFollowers':
                    newReceivedFollowers = response.data[i].payload_json
                    if (newReceivedFollowers > 0) {
                      $('#badge3').removeClass('display_none')
                    } else {
                      $('#badge3').addClass('display_none')
                    }
                    break
                }
                since = response.data[i].timestamp
              }
            }
          })
      }, 1000000) // 自己玩 大一点
    })
  }
}
</script>

<template>
  <el-container v-if='user'>
    <el-aside class='aside'>
      <div class='info1'>
        <div class='ava'>
          <img :src='this.user._links.avatar' />
        </div>
        <div class='ava'>
          <h2>{{ this.user.username }}</h2>
        </div>
      </div>
      <ul id='list'>
        <li v-if='this.user.sex === null' class='info2'>
          <h6>性别: -</h6>
        </li>
        <li v-else-if="this.user.sex === '1'" class='info2'>
          <h6>性别: 男</h6>
        </li>
        <li v-else class='info2'>
          <h6>性别: 女</h6>
        </li>
        <li class='info2'>
          <h6>
            注册时间:{{ $moment(user.reg_since).format('YYYY/MM/DD H:mm') }}
          </h6>
        </li>
        <!--格式化 UTC 时间为本地时间-->
        <li v-if='this.user.about_me === null' class='info2'>
          <h6>简介: -</h6>
        </li>
        <li v-else class='info2'>
          <h6>简介:{{ this.user.about_me }}</h6>
        </li>
      </ul>
      <el-button
        v-if='this.user.id === sharedState.user_id'
        class='butt'
        type='primary'
        round
        @click='editInfo'
        >编辑资料</el-button
      >
      <el-button
        v-else-if='user.is_following === false'
        class='butt'
        type='primary'
        round
        @click='follow(user.id, user.username)'
        >添加关注</el-button
      >
      <!--参数不加this-->
      <el-button
        v-else
        class='butt'
        type='danger'
        round
        @click='unfollow(user.id, user.username)'
        >取消关注</el-button
      >
    </el-aside>
    <el-container>
      <div class='wrap'>
        <ul id='menu'>
          <li>
            <router-link v-bind:to="{ name: 'hisPosts' }" class='nav-link'>TA的文章</router-link>
          </li>
          <li>
            <router-link v-bind:to="{ name: 'followers' }" class='nav-link'>TA的粉丝</router-link>
          </li>
          <li>
            <router-link v-bind:to="{ name: 'following' }" class='nav-link'>TA的关注</router-link>
          </li>
        </ul>
        <router-view class='route'></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import store from '../../store'
import axios from 'axios'

export default {
  name: 'profile',
  data () {
    return {
      sharedState: store.state,
      tabPosition: 'top',
      user: ''
    }
  },
  methods: {
    getUser (id) {
      const path = '/user/' + id
      axios
        .get(path)
        .then((response) => {
          if (response.status === 200) {
            this.user = response.data
            console.log(this.user)
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    editInfo () {
      this.$router.push('/thisuser/editProfile')
    },
    follow (id, name) {
      const path = '/user/follow/' + id
      axios
        .get(path)
        .then((response) => {
          if (response.data === 'Success') {
            this.$message({
              type: 'success',
              message: '已成功关注' + name + '!'
            })
            this.getUser(id)
          } else {
            this.$message.error('关注失败！')
          }
        })
        .catch((error) => {
          console.error(error)
        })
    },
    unfollow (id, name) {
      const path = '/user/unfollow/' + id
      axios
        .get(path)
        .then((response) => {
          if (response.data === 'Success') {
            this.$message({
              type: 'success',
              message: '已取消关注' + name + '!'
            })
            this.getUser(id)
          } else {
            this.$message.error('取消关注失败！')
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  created () {
    // 页面渲染后自动执行
    const userId = this.$route.params.id
    this.getUser(userId)
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate (to, from, next) {
    this.getUser(to.params.id)
    next()
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/style.scss";
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
  box-shadow: 0 0 10px $gre_color;
  width: 22%;
  height: 100%;
  position:fixed;
  overflow: auto;
}
.info1 img{
  width: 60px;
  height: 60px;
  border-radius: 50%;

}
.info2{
  text-align: left;
  list-style: none;
  margin-top: 30px;
  margin-bottom: 30px;
}
#list:after{
  content: "";
  display: table;
  clear: both;
}
.butt{
  margin: 20px;
  background-color: $dep_color;
  border: none;
  &:hover{
    @include hov;
  }
}
.wrap{
  width: 75%;
  height: 500px;
  overflow: auto;
  margin-left: 25%;
}
#menu{
  height: 30px;
  margin: 20px;
  padding-left: 0;
}
#menu li{
  background-color: $dep_color;
  display: block;
  float: left;
}
.nav-link{
  color: white;
  font-size: small;
  &:hover{
    @include hov;
  }
  &:active{
    background-color: $hov_color;
    color: $yel_color;
  }
}
.route{
  float: left;
  margin-left: 30px;
  margin-top: 5px;
  width: 80%;
}
</style>

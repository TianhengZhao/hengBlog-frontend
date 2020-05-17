<template>
  <el-container class="containe" >
    <el-aside  class="aside">
      <div class="info1">
        <div class="ava"><img :src='this.user._links.avatar'/></div>
        <div class="ava" ><h2>{{this.user.username}}</h2></div>
      </div>
      <ul id="list">
      <li v-if="this.user.sex === null" class="info2"><h6>性别: - </h6></li>
      <li v-else-if="this.user.sex === '1'" class="info2"><h6>性别: 男 </h6></li>
      <li v-else class="info2"><h6>性别: 女 </h6></li>
      <li class="info2"><h6>注册时间:{{$moment(user.reg_since).format('LLL') }}</h6></li>   <!--格式化 UTC 时间为本地时间-->
      <li v-if="this.user.about_me === null" class="info2"><h6>简介: - </h6></li>
      <li v-else class="info2"><h6>简介:{{this.user.about_me}}</h6></li>
      </ul>
      <el-button v-if="this.user.id === sharedState.user_id" id="button" type="primary" round @click="editInfo">编辑资料</el-button>
      <el-button v-else-if="user.is_following === false" id="button" type="primary" round @click="follow(user.id,user.username)">添加关注</el-button> <!--参数不加this-->
      <el-button v-else id="button" type="danger" round @click="unfollow(user.id,user.username)">取消关注</el-button>
    </el-aside>
    <el-container>
      <div class="wrap">
      <ul id="menu">
        <li >
          <router-link v-bind:to="{ name: 'hisPosts' }" v-bind:active-class="'active'" class="nav-link">TA的文章</router-link>
        </li>
        <li >
          <router-link v-bind:to="{ name: 'followers' }" v-bind:active-class="'active'" class="nav-link">TA的粉丝</router-link>
        </li>
        <li>
          <router-link v-bind:to="{ name: 'following' }" v-bind:active-class="'active'" class="nav-link">TA的关注</router-link>
        </li>
      </ul>
      <router-view class="route"></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script>/* eslint-disable */
import store from '../store'
import axios from 'axios'
import hisPosts from '@/components/user/hisPosts'
import followers from '@/components/user/followers'
  export default {
    name: 'profile',

    data () {
      return {
        sharedState: store.state,
        tabPosition: 'top',
        user: {
          id: '',
          username: '',
          email: '',
          about_me: '',
          reg_since: '',
          sex: '',
          is_following:'',
          _links: {
            self: '',
            avatar: ''
          }
        }
      }
        },
        methods: {
          getUser (id) {
            const path = '/user/'+id
            axios.get(path)
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
          editInfo(e){
            this.$router.push("/user/editProfile")   // 为什么/login就uncaught promise？？？？
          },
          follow(id, name){
            const path = '/user/follow/'+id
            axios.get(path)
              .then((response) => {
                if(response.data === 'Success')
                  this.$message({
                    type: 'success',
                    message: '已成功关注'+name+'!'
                  })
                else{
                  this.$message.error('关注失败！')
                }
              })
              .catch((error) => {

                console.error(error)

              });
          },
          unfollow(id, name){
            const path = '/user/unfollow/'+id
            axios.get(path)
              .then((response) => {
                if(response.data === 'Success')
                  this.$message({
                    type: 'success',
                    message: '已取消关注'+name+'!'
                  })
                else{
                  this.$message.error('取消关注失败！')
                }
              })
              .catch((error) => {

                console.error(error)

              });
          }
        },
       created () {   //页面渲染后自动执行
            const user_id = this.$route.params.id
            this.getUser(user_id)
          },
          // 当 id 变化后重新加载数据
       beforeRouteUpdate (to, from, next) {
            this.getUser(to.params.id)
            next()
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
  #button{
    margin: 20px;
  }
  .wrap{
    width: 80%;
  }
  #menu{
    height: 30px;
    list-style:none;
    margin: 20px;
    padding-left: 0px;
  }
  #menu li{
    float: left;
  }
  .nav-link{
    color: #2c3e50;
    text-decoration:none;
    border-bottom:1px solid #bebebe;
    padding: 0;
    margin: 10px;
    padding-bottom: 5px;
  }
  .nav-link:hover{
    color: #3a8ee6;
    border-bottom:1px solid #3a8ee6;
  }
  .nav-link:checked{
    color: #3a8ee6;
    border-bottom:1px solid #3a8ee6;
  }
  .route{
    float: left;
    margin-left: 30px;
    margin-top: 20px;
    width: 100%;
  }

</style>

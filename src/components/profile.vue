<template>
  <el-container>
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
      <el-button v-else id="button" type="primary" round >添加关注</el-button>
    </el-aside>
    <el-container>
      <el-main> <el-tabs :tab-position="tabPosition" style="height: 200px;">
        <el-tab-pane label="TA的文章"><his-posts v-bind:user_id=this.user.id></his-posts></el-tab-pane>
        <el-tab-pane label="TA的粉丝">TA的粉丝</el-tab-pane>
        <el-tab-pane label="TA的关注">TA的关注</el-tab-pane>
      </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>/* eslint-disable */
import store from '../store'
import axios from 'axios'
import hisPosts from '@/components/user/hisPosts'

  export default {
    name: 'profile',
    components:{
      hisPosts
    },
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
              })
              .catch((error) => {
                // eslint-disable-next-line
                console.error(error)
                //this.$router.push("/NotFound")                  这里的问题还没解决
              });
          },
          editInfo(e){
            this.$router.push("/user/editProfile")   // 为什么/login就uncaught promise？？？？
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

</style>

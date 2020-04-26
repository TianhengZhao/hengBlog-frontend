<template>
  <el-container>
    <el-aside  class="aside">
      <div class="info1">
        <div class="ava"><img src="../assets/avatar/1.jpg"/></div>
        <div class="ava" ><h3></h3></div>
      </div>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>/* eslint-disable */
import store from '../store'
import axios from 'axios'
  export default {
    name: 'profile',
    data () {
      return {
        sharedState: store.state,
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
            const path = '/user/1' // document.getElementById(id)
            console.log(path)
            axios.get(path)
              .then((response) => {
                console.log(response.data)
                this.user= response.data

              })
              .catch((error) => {
                // eslint-disable-next-line
                console.error(error)
              });
          }
        },
       created () {   //页面渲染后自动执行
            const user_id = this.$route.params.id
            console.log('create')
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
    border:2px solid #2c3e50;
    width: 250px;
  }
  img{
    width: 60px;
    height: 60px;
  }
</style>

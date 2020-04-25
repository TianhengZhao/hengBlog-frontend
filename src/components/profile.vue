<template>
  <el-container>
    <el-aside  class="aside">
      <div class="info1">
        <div class="ava"><el-avatar :size="60" ><img src="../assets/avatar/1.jpg"/></el-avatar></div>
        <div class="ava"><h3>{{sharedState.user_name}}</h3></div>
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
  export default {
    name: 'profile',
    data () {
      return {
        sharedState: store.state

      }
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
</style>

<template>
  <div  v-if="fans" >
    <div v-for="(items, index) in fans.items"  v-bind:key="index" class="wrap">
      <router-link v-bind:to="{name:'profile',params:{id:items.id}}">
        <img v-bind:src="items._links.avatar" class="ava">
      </router-link>
      <div class="top">
        <router-link v-bind:to="{name:'profile',params:{id:items.id}}" class="name">
          {{items.username}}
        </router-link>
      </div>
    <div class="about">{{items.about_me}}</div>
      <el-button  id="button" type="primary" round size="mini">添加关注</el-button>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page=this.fans._meta.page
      :page-size="10"
      layout="total,prev, pager, next, jumper"
      :total="this.fans._meta.total_items">
    </el-pagination>
  </div>
</template>

<script>/* eslint-disable */
import store from '../../store'
import axios from 'axios'
export default {
    name: 'followers',
  data(){
    return{
      sharedState: store.state,
      fans: '',
      id:0,
      totalItems:0
    }
  },
  methods:{
    getFans(){
      let page=1
      let iid=this.$route.params.id
      const path='user/getOnesFans/'+iid+'?page='+page    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.fans=response.data
          this.totalItems=this.fans._meta.total_items
        })
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {                                    //改变页码
      const path='user/getOnesFans/'+iid+'?page='+val    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.fans=response.data
        })
    }

  },
  created () {
      this.getFans()
  }
}
</script>

<style scoped>
.wrap{
  height: 80px;
  border: 1px solid gainsboro;
  border-radius: 5px;
}
  .ava{
    height: 40px;
    width: 40px;
    margin: 20px;
    float: left;

  }
  .top{
    margin-top: 17px;
    margin-right: 5px;
    height: 25px;
  }
.name{
  float: left;

}
  .about{
    float: left;
    font-size: small;
    height: 24px;
    text-align: left;
  }
  #button{
    float: right;
    margin-right: 10px;
    margin-top: -16px;
  }
</style>

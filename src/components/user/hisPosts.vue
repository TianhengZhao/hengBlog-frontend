<template>
  <div  id="panel">
    <div>{{user_id}}</div>
    <div v-for="(items, index) in posts.items"  v-bind:key="index" class="post_item">
      <router-link v-bind:to="{name:'profile',params:{id:items.author.id}}">
        <img v-bind:src="items.author._links.avatar" class="post_ava">
      </router-link>
      <div class="post_top">
        <router-link v-bind:to="{name:'post',params:{id:items.id}}" class="post_title">
          {{items.title}}
        </router-link>
      </div>
      <div class="post_body">
        <vue-markdown
          class="post_summary"
          :source="items.summary"
        >
        </vue-markdown>
      </div>
      <div class="post_bottom">
        <div class="buttons" v-if="items.author && items.author.id == sharedState.user_id">
          <el-button size="mini"  icon="el-icon-delete" circle type="danger" @click="del(items.id)"></el-button>
        </div>
        <div class="info">
          <i id="time">{{ $moment(items.timestamp).format('LLL') }}</i>
          <el-divider direction="vertical"></el-divider>
          <i class="el-icon-view" >{{items.views}}</i>
        </div>
      </div>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page=this.posts._meta.page
      :page-size="10"
      layout="total,prev, pager, next, jumper"
      :total="this.posts._meta.total_items">
    </el-pagination>
  </div>
</template>

<script>/* eslint-disable */
import store from '../../store'
import axios from 'axios'

export default {
    name: 'hisPosts',
    props:['user_id'],
    data(){
      return{
        sharedState: store.state,
        posts: '',
        id:6,
        totalItems:0
      }
    },
  methods:{
    getPosts(){
      let page=1
      if (typeof this.$route.query.page != 'undefined') {              //用到 typeof
        page = this.$route.query.page
      }
      const path='post/getOnesPosts/'+this.id+'?page=${page}'    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.posts=response.data
          this.totalItems=this.posts._meta.total_items
        })

    }
  },
   created () {
      this.getPosts()
   }
}
</script>

<style scoped>
  .post_item{
    border: #bebebe solid 1px;
    border-radius: 5px;
    height: 150px;
    margin: 5px;
  }
  .post_ava{
    height: 50px;
    width: 50px;
    margin: 20px;
    float: left;
    display: inline;
  }
  .post_top{
    margin-top: 20px;
    margin-right: 5px;
    height: 30px;
  }
  .post_title{
    float: left;
    font-size: large;
  }
  .post_body{
    padding-left: 90px;
    height: 64px;
  }
  .post_summary{
    float: left;
    font-size: small;
    height: 24px;
    text-align: left;
  }
  .buttons{
    display: inline;
    float: left;
    margin-left: 90px;
  }
  .info{
    float: right;
    font-size: smaller;
    color: #bebebe;
    margin-right: 5px;
    display: inline;
  }
</style>

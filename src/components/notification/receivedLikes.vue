<template>
  <div  v-if="likes" >
    <div v-if="likes.has_new" class="has_new">
      <el-button type="text" class="el-icon-circle-check" @click="getNewlikes(true)">全部标记已读</el-button>
    </div>
    <div v-else class="has_new">
      <el-button type="text" class="el-icon-check" disabled>全部已读</el-button>
    </div>
    <div v-for="(like, index) in likes.items"  v-bind:key="index" class="like_item">
      <el-badge v-if="like.is_new" is-dot class="red_dot">
        <router-link v-bind:to="{name:'hisPosts',params:{id:like.author.id}}">
          <img v-bind:src="like.author._links.avatar" class="like_new_ava">
        </router-link>
      </el-badge>
      <router-link v-else v-bind:to="{name:'hisPosts',params:{id:like.author.id}}">
        <img v-bind:src="like.author._links.avatar" class="like_ava">
      </router-link>
      <div class="like_top">
        <router-link v-bind:to="{name:'hisPosts',params:{id:like.author.id}}" class="like_title">
          {{like.author.username}}
        </router-link>
        <span class="like_title">赞了你的评论</span>
        <router-link v-bind:to="{name:'post',params:{id:like.comment.post.id}}" class="like_title">
          {{like.comment.body}}
        </router-link>
      </div>
      <div class="like_time">
        <i style="font-style: normal">{{ $moment(like.timestamp).format('YYYY/MM/DD H:mm') }}</i>  <!--去掉i标签斜体样式-->
      </div>
    </div>
    <!----------------------------------------------------------------------------------------->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page=this.likes._meta.page
      :page-size="5"
      layout="total,prev, pager, next, jumper"
      :total="this.likes._meta.total_items">
    </el-pagination>
  </div>
</template>

<script>/* eslint-disable */
import axios from 'axios'
import store from '../../store'
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../../assets/bootstrap-markdown/js/marked.js'
import VueMarkdown from 'vue-markdown'    //解析markdown原文为html

export default {
  name: 'receivedLikes',
  data(){
    return{
      sharedState: store.state,
      likes:'',
    }
  },
  methods:{
    getNewlikes(mark){
      let page = 1
      const user_id = this.sharedState.user_id
      const path = 'user/receivedLikes/'+user_id+'?page='+page +'&mark='+mark
      this.$axios.get(path)
        .then(response => {
          if(response.status === 200){
            console.log(response.data)
            this.likes = response.data
          }
        })
        .catch(error => {
          this.$message.error('获取新的赞失败！')
        })
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {                                    //改变页码
      const user_id = this.sharedState.user_id
      const path = 'user/receivedLikes/'+user_id+'?page='+page +'&mark='+mark
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.likes=response.data
        })
    }
  },
  created () {
    this.getNewlikes(false)
  }
}
</script>

<style scoped>
  .has_new{
    padding: 5px;
    text-align: left;
  }
  .like_item{
    border: #eeeeee solid 1px;
    height: 80px;
    margin: 5px;
  }
  .red_dot{
    margin: 18px;
    float: left;
  }
  .like_new_ava{
    height: 30px;
    width: 30px;
    float: left;
    display: inline;
  }
  .like_ava{
    height: 30px;
    width: 30px;
    margin: 18px;
    float: left;
    display: inline;
  }
  .like_top{
    margin-top: 15px;
    margin-right: 5px;
    height: 20px;
  }
  .like_title{
    float: left;
    font-size: small;
  }
  .like_time{
    font-size:12px;
    color: #8c939d;
    padding-left: 66px;
    text-align: left;
    font-style: normal;
  }
</style>

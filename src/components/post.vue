<template>
  <!-------------------------------------------------展示文章------------------------------------------------->
  <div class="container" v-if="post">
    <div class="title"><h3 class="el-icon-tickets">{{this.post.title}}</h3></div>
    <div class="summary"><span>{{this.post.summary}}</span></div>
    <div class="function">
      <div>
        <router-link v-bind:to="{name:'hisPosts',params:{id:post.author.id}}">{{this.post.author.username}}</router-link>
      </div>
      <div class="buttons" v-if="post.author && post.author.id === sharedState.user_id">
        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="del"></el-button>
      </div>
      <div class="info">
        <i id="time" class="el-icon-time">{{ $moment(post.timestamp).format('YYYY/MM/DD H:mm') }}</i>
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-view" >{{post.views}}</i>
      </div>
    </div>
   <el-divider></el-divider>
    <div class="body">
    <vue-markdown
      :source="this.post.body"
      :toc-first-level="1"
      :toc-last-level="3"
     >
    </vue-markdown>
    </div>
    <!-------------------------------------------------显示评论------------------------------------------------->
    <div class="divide">
    <el-divider><i class="el-icon-chat-line-round">评论区</i></el-divider>
      <el-form v-if="sharedState.is_authenticated" :model="contentForm" :rules="rules" ref="contentForm" id="addComment">
       <el-form-item prop="body">
         <el-input type="textarea" v-model="contentForm.body" id="com_content"></el-input>
       </el-form-item>
        <el-button type="primary"  class="but" size="mini" @click="submit(contentForm)">评 论</el-button>
      </el-form>
      <el-alert v-else
        type="warning"
        description="登录后方可发表评论！"
        show-icon>
      </el-alert>
      <div v-if="comments" id="panel">
        <div v-for="(items, index) in comments.items"  v-bind:key="index" class="comment_item">
          <router-link v-bind:to="{name:'hisPosts',params:{id:items.author.id}}">
            <img v-bind:src="items.author._links.avatar" class="comment_ava">
          </router-link>
          <div class="comment_top">
            <router-link v-bind:to="{name:'hisPosts',params:{id:items.author.id}}" class="comment_title">
              {{items.author.username}}
            </router-link>
          </div>
          <div class="comment_time">
            <i style="font-style: normal">{{ $moment(items.timestamp).format('YYYY/MM/DD H:mm') }}</i>  <!--去掉i标签斜体样式-->
          </div>
          <div class="comment_body">
            <vue-markdown
              class="comment_summary"
              :source="items.body"
            >
            </vue-markdown>
          </div>
          <div class="comment_info">
            <el-button v-if='items.author.id === sharedState.user_id || post.author.id === sharedState.user_id' type="text" class="info_but el-icon-delete-solid" @click="del_com(items.id)">删除</el-button>
            <el-button v-if='sharedState.is_authenticated' type="text" class="info_but el-icon-s-comment" id="reply">回复</el-button>
          </div>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page=this.comments._meta.page
          :page-size="5"
          layout="total,  prev, pager, next, jumper"
          :total="this.comments._meta.total_items">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>/* eslint-disable */
import axios from 'axios'
import store from '../store'
import '../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../assets/bootstrap-markdown/js/marked.js'
import VueMarkdown from 'vue-markdown'    //解析markdown原文为html

  export default {
    name: 'post',
    components:{
      VueMarkdown
    },
    data(){
      var checkBody = (rule, value, callback)=>{
        if(value === '')
          callback(new Error('内容不能为空'))
        else if(value.length>120)
          callback(new Error('评论过长'))
        else callback()
      }
      return{
        sharedState:store.state,
        post:"",
        comments:'',
        contentForm:{
          body:''
        },
        postForm:{
          title:'',
          summary:'',
          body:''
        },
        rules:{
          body:[{validator:checkBody,trigger:'blur'}]
        }
      }
    },
    methods:{
      getPost(){
        let postId = this.$route.params.id
        axios.get('post/getPost/'+postId)
          .then((response)=>{
            console.log(response.data)
            this.post=response.data
          })
      },
      del(){
        this.$confirm('确认删除该博客?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            const path = 'post/getPost/' + this.post.id
            this.$axios.delete(path)
            .then((response)=> {
              if(response.data == 'Success') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.$router.push('/')
              }
              else  this.$router.push(this.$route.query.redirect)
            })
        })
        },
      getComments(){
        let postId = this.$route.params.id
        let page = 1
        if (typeof this.$route.query.page != 'undefined') {              //用到 typeof
          page = this.$route.query.page
        }
        const path='post/getComments/'+postId+'?page='+page
        axios.get(path)
          .then((response)=>{
            console.log(response.data)
            this.comments=response.data
          })

      },
      submit(contentForm){
        this.$refs.contentForm.validate((valid) => {
          if (valid) {
            axios.post('comment/add',{
              article_id:this.$route.params.id,
              body:this.contentForm.body
            })
              .then((response)=>{
                console.log(response)
                if (response.status === 201) {
                  this.$message({             //message消息提示
                    message: '评论成功！',
                    type: 'success'
                  });
                  this.getComments()
                  this.contentForm.body=''
                }
              })
              .catch((error) => {
                this.$message.error('评论失败！');
              });
          }
        })
      },
      handleSizeChange(val) {
      },
      handleCurrentChange(val) {                                    //改变页码
        let postId = this.$route.params.id
        const path='comment/getComments/'+postId+'?page='+val    //在url中添加参数
        axios.get(path)
          .then((response)=>{
            console.log(response.data)
            this.comments=response.data
          })
      },
      del_com(id){
        this.$confirm('确认删除该评论?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const path = 'comment/delete/' + id
          this.$axios.delete(path)
            .then((response)=> {
              if(response.data === 'Success') {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getComments()
              }
              else  this.$message.error('删除失败！')
            })
        })
      }
    },
    created () {
      this.getPost()
      this.getComments()
      $(document).ready(function() {
          $('#reply').on('click',function(){
           
        })
      })
        /* $(document).ready(function() {
           $("#com_content").markdown({
             autofocus:false,
             savable:false,
             iconlibrary: 'fa',  // 使用Font Awesome图标
             language: 'zh'
           })
         })*/
    }

  }
</script>

<style scoped>
  .container{
    width:80%;
    margin: auto;
  }
  .container:after{
    content: "";
    display: table;
    clear: both;
  }
.title{
  margin:20px;
}
  .summary{
    margin:20px;
    font-style: oblique;
  }
  .body{

    width: 100%;
    text-align: left;
  }
  .body:after{
    content: "";
    display: table;
    clear: both;
  }
  .buttons{
    float: left;
    margin-bottom: 5px;
  }
  .info{
    float: right;
    font-size: smaller;
    color: #bebebe;
  }
  .function{
    height: 40px;
  }
  .divide{
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .but{
    margin-bottom: 15px;
  }
  .comment_item{
    border: #eeeeee dashed 1px;
    height: 150px;
    margin: 5px;
  }
  .comment_ava{
    height: 30px;
    width: 30px;
    margin: 18px;
    float: left;
    display: inline;
  }
  .comment_top{
    margin-top: 15px;
    margin-right: 5px;
    height: 25px;
  }
  .comment_title{
    float: left;
  }
  .comment_time {
    font-size:12px;
    color: #8c939d;
    padding-left: 66px;
    text-align: left;
    font-style: normal;
  }
  .comment_body{
    padding-left: 66px;
    height: 60px;
  }
  .comment_summary{
    float: left;
    font-size: small;
    height: 24px;
    text-align: left;
  }
  .comment_info{
    height: 28px;
    float: right;
    margin-right: 5px;
  }
  .info_but{
    font-size: smaller;
    color: #8c939d;
  }
</style>

<template>
  <!--------------------------主界面--------------------------->
  <div class="container">
    <div class="title"><h3 class="el-icon-tickets">{{this.post.title}}</h3></div>
    <div class="summary"><span>{{this.post.summary}}</span></div>
    <div class="function">
      <div>
        <router-link v-bind:to="{name:'profile',params:{id:this.post.author.id}}">{{this.post.author.username}}</router-link>
      </div>
      <div class="buttons" v-if="post.author && post.author.id == sharedState.user_id">
        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="del"></el-button>
      </div>
      <div class="info">
        <i id="time">{{ $moment(post.timestamp).format('LLL') }}</i>
        <el-divider direction="vertical"></el-divider>
        <i class="el-icon-view" >{{post.views}}</i>
      </div>
    </div>
   <el-divider></el-divider>
    <div>
    <vue-markdown
      :source="this.post.body"
      :toc-first-level="1"
      :toc-last-level="3"
      class="body"
     >
    </vue-markdown>
    </div>
  </div>
</template>

<script>/* eslint-disable */
import axios from 'axios'
import store from '../store'
import VueMarkdown from 'vue-markdown'
  export default {
    name: 'post',
    components:{
      VueMarkdown
    },
    data(){
      var checkTitle = (rule,value,callback)=>{
        if(value === '')
          callback(new Error('标题不能为空'))
        else if(value.length>20)
          callback(new Error('标题过长'))
        else callback()
      }
      var checkSummary = (rule,value,callback)=>{
        if(value.length>100)
          callback(new Error('摘要过长'))
        else callback()
      }
      var checkBody = (rule, value, callback)=>{
        if(value === '')
          callback(new Error('内容不能为空'))
        else callback()
      }
      return{
        sharedState:store.state,
        post:"",
        postForm:{
          title:'',
          summary:'',
          body:''
        },
        rules:{
          title:[{validator:checkTitle,trigger:'blur'}],
          summary:[{validator:checkSummary,trigger:'blur'}],
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
        }
    },
    created () {
      this.getPost()

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
    float: left;
    width: 100%;
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
</style>

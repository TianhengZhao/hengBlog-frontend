<template>
  <div class="container">
    <el-form v-if="sharedState.is_authenticated" :model="postForm" :rules="rules" ref="postForm">   <!--rules绑定form的规则-->
      <el-form-item prop="title">
        <el-input v-model="postForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item prop="summary">
        <el-input v-model="postForm.summary" placeholder="摘要"></el-input>
      </el-form-item>
      <el-form-item prop="body">
        <el-input type="textarea" v-model="postForm.body" placehoder="内容" id="post-body"></el-input>
      </el-form-item>
      <el-button type="primary"  @click="submit(postForm)" class="but">发 表</el-button>
    </el-form>
    <el-divider class="divide"><i class="el-icon-document">所有文章</i></el-divider>
    <div v-if="posts" id="panel">                   <!--getPosts()加载完成后才显示，因为用到了posts数据-->
      <div v-for="(items, index) in posts.items"  v-bind:key="index" class="post_item">
         <router-link v-bind:to="{name:'hisPosts',params:{id:items.author.id}}">
           <img v-bind:src="items.author._links.avatar" class="post_ava">
         </router-link>
        <div class="post_top">
        <router-link v-bind:to="{name:'post',params:{id:items.id}}" class="post_title">
          {{items.title}}
        </router-link>
          <router-link v-bind:to="{name:'hisPosts',params:{id:items.author.id}}" class="post_name">by:{{items.author.username}}</router-link>
        </div>
        <div class="post_body">
        <vue-markdown
          class="post_summary"
          :source="items.summary"
        >
        </vue-markdown>
        </div>
        <div class="post_bottom">
        <div class="buttons" v-if="items.author && items.author.id === sharedState.user_id">
          <el-button size="mini"  icon="el-icon-delete" circle type="danger" @click="del(items.id)"></el-button>
        </div>
          <div class="info">
          <i id="time" class="el-icon-time">{{ $moment(items.timestamp).format('YYYY/MM/DD H:mm') }}</i>
          <el-divider direction="vertical"></el-divider>
          <i class="el-icon-view" >{{items.views}}</i>
          </div>
        </div>
      </div>
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page=this.posts._meta.page
      :page-sizes="[3, 6, 10]"
      :page-size="3"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.posts._meta.total_items">
    </el-pagination>
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
  name: 'home',
  components:{
    VueMarkdown
  },
  data() {
    var checkTitle = (rule,value,callback)=>{
      if(value === '')
        callback(new Error('标题不能为空'))
      else if(value.length>20)
        callback(new Error('标题过长'))
      else callback()
    }
    var checkSummary = (rule,value,callback)=>{
      if(value.length>50)
        callback(new Error('摘要过长'))
      else callback()
    }
    var checkBody = (rule, value, callback)=>{
      if(value === '')
        callback(new Error('内容不能为空'))
      else callback()
    }
    return{
      sharedState: store.state,
      posts: '',
      totalItems: 0,
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
    submit(postForm){
      this.$refs.postForm.validate((valid) => {
        if (valid) {
          axios.post('post/add',{
                  title:this.postForm.title,
                  summary:this.postForm.summary,
                  body:this.postForm.body
                })
                  .then((response)=>{
                    console.log(response)
                    if (response.status === 201) {
                      this.$message({             //message消息提示
                        message: '发表成功！',
                        type: 'success'
                      });
                      this.getPosts()
                      this.postForm.title=''
                      this.postForm.summary=''
                      this.postForm.body=''
              }
            })
            .catch((error) => {
              this.$message.error('发表失败！');
            });
        }
      })
    },
    handleSizeChange(val) {                 //这两个函数有bug还没改好
      const path='post/getPosts?page='+1+'&per_page='+val    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.posts=response.data
        })
    },
    handleCurrentChange(val) {                                    //改变页码
      const path='post/getPosts?page='+val+'&per_page='+this.posts._meta.per_page    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.posts=response.data
        })

    },
    getPosts(){
      let page=1
      let per_page=3
      if (typeof this.$route.query.page != 'undefined') {              //用到 typeof
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page != 'undefined') {
        per_page = this.$route.query.per_page
      }
      const path='post/getPosts?page='+page+'&per_page='+per_page    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.posts=response.data
          this.totalItems=this.posts._meta.total_items
        })
        .catch((error) => {
          // handle error

        })

    },
    del(id){
      this.$confirm('确认删除该博客?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const path = 'post/getPost/' + id
        this.$axios.delete(path)
          .then((response)=> {
            if(response.data == 'Success') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.$router.go(0);
              //this.$router.push('/').catch(err => {console.log(err)})
              //location.reload()
            }
            else  {
             // this.$router.push('/')
              this.$message.error('删除失败！')
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  created () {
    this.getPosts()
    $(document).ready(function() {
      $("#post-body").markdown({
        autofocus:false,
        savable:false,
        iconlibrary: 'fa',  // 使用Font Awesome图标
        language: 'zh'
      })
    })
  }
}
</script>

<style scoped>
  .container{
    width:900px;
    margin-top: 20px;
  }
  #panel{
    margin-top:20px;
    margin-bottom: 20px;
  }
  .divide{
    margin-top: 50px;
    margin-bottom: 50px;
  }
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
  .post_name{
    float: right;
    font-size: small;
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
  .info {
    float: right;
    font-size: smaller;
    color: #bebebe;
    margin-right: 5px;
    display: inline;
  }

</style>


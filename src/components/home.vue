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
    <div v-if="posts" id="panel">                   <!--getPosts()加载完成后才显示，因为用到了posts数据-->
      <div v-for="(items, index) in posts.items"  v-bind:key="index" class="post_item">
         <router-link v-bind:to="{name:'profile',params:{id:items.author.id}}">
           <img v-bind:src="items.author._links.avatar" class="post_ava">
         </router-link>
        <div class="post_top">
        <router-link v-bind:to="{name:'profile',params:{id:items.author.id}}" class="post_title">          <!--待修改-->
          {{items.title}}
        </router-link>
          <router-link v-bind:to="{name:'profile',params:{id:items.author.id}}" class="post_name">by:{{items.author.username}}</router-link>
        </div>
        <vue-markdown
          class="post_summary"
          :source="items.summary"
        >
        </vue-markdown>
      </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
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
    VueMarkdown                           //什么意思？？？？
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
      sharedState: store.state,
      posts: '',
      iter_pages: [],
      totalItems: 0,
      postForm:{
        title:'',
        summary:'',
        body:'',
        errors:0,
        titleError:null,
        bodyError:null
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
              if (response.data === 'Success') {
                this.$message({             //message消息提示
                  message: '恭喜你，注册成功！',
                  type: 'success'
                });
              }
            })
        }
      })
    },
    handleSizeChange(val) {
      const path='post/getPosts?page=${page}&per_page='+val    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.posts=response.data
        })
    },
    handleCurrentChange(val) {                                    //改变页码
      const path='post/getPosts?page='+val+'&per_page=${per_page}'    //在url中添加参数
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
      const path='post/getPosts?page=${page}&per_page=${per_page}'    //在url中添加参数
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
  .post_item{
    border: #bebebe solid 1px;
    border-radius: 5px;
    height: 120px;
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
  .post_summary{
    float: left;
    font-size: small;
  }
</style>


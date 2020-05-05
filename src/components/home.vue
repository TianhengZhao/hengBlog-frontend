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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="1"
      :page-size="3"
      layout="total,  prev, pager, next, jumper"
      :total="totalPages">
    </el-pagination>
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
        totalPages: '',
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
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
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
          this.posts=response.data
        })

      }



    },
    created () {
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
</style>

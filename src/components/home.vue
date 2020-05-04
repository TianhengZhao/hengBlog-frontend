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
  </div>
</template>

<script>/* eslint-disable */
import axios from 'axios'
import store from '../store'
import '../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../assets/bootstrap-markdown/js/marked.js'

  export default {
    name: 'home',
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

</style>

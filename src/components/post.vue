<template>
  <div class="container">
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
            //this.post=response.data
          })
      }

    },
    created () {
      this.getPost()

    }

  }
</script>

<style scoped>

</style>

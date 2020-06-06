<template>
  <div  v-if="comments" >
    <div v-if="comments.has_new" class="has_new">
      <el-button type="text" class="el-icon-circle-check" @click="getNewComments(true)">全部标记已读</el-button>
    </div>
    <div v-else class="has_new">
      <el-button type="text" class="el-icon-check" disabled>全部已读</el-button>
    </div>
    <div v-for="(comment, index) in comments.items"  v-bind:key="index" class="comment_item">
      <el-badge v-if="comment.is_new" is-dot class="red_dot">
        <router-link v-bind:to="{name:'hisPosts',params:{id:comment.author.id}}">
          <img v-bind:src="comment.author._links.avatar" class="comment_new_ava">
        </router-link>
      </el-badge>
      <router-link v-else v-bind:to="{name:'hisPosts',params:{id:comment.author.id}}">
        <img v-bind:src="comment.author._links.avatar" class="comment_ava">
      </router-link>
      <div class="comment_top">
        <router-link v-bind:to="{name:'hisPosts',params:{id:comment.author.id}}" class="comment_title">
          {{comment.author.username}}
        </router-link>
        <span class="comment_title">评论了你的文章</span>
        <router-link v-bind:to="{name:'post',params:{id:comment.post.id}}" class="comment_title">
          《{{comment.post.title}}》
        </router-link>
      </div>
      <div class="comment_time">
        <i style="font-style: normal">{{ $moment(comment.timestamp).format('YYYY/MM/DD H:mm') }}</i>  <!--去掉i标签斜体样式-->
      </div>
      <div class="comment_body" v-if="!comment.disabled">
        <router-link v-if="comment.parent !== null" v-bind:to="{name:'hisPosts',params:{id:comment.parent.author.id}}" class="comment_parent">
          @{{comment.parent.author.username}}:
        </router-link>
        <vue-markdown
          class="comment_summary"
          :source="comment.body"
        >
        </vue-markdown>
      </div>
        <!---------------------------------------------------------------------------------------->
        <div v-else class="comment_disable"><el-alert
          title="该内容已被屏蔽"
          type="error"
          :closable="false">
        </el-alert></div>
        <div v-if="!comment.disabled" class="comment_info">
          <el-button type="text" class="info_but el-icon-s-release" @click="disableOrEnable_com(comment.id, comment.disabled)">屏蔽</el-button>
          <el-button type="text" class="info_but el-icon-delete-solid" @click="del_com(comment.id)">删除</el-button>
          <el-button v-if='sharedState.is_authenticated' type="text" class="info_but el-icon-s-comment reply child" @click="add_com(comment.id,comment.post.id)">回复</el-button>
        </div>
        <div v-else class="comment_info">
          <el-button v-if='sharedState.is_authenticated' type="text"
                     class="info_but el-icon-document-remove" @click="disableOrEnable_com(comment.id, comment.disabled)">取消屏蔽</el-button>
        </div>
    <!--------------------------------------------------------------------------------------------->
    </div>
    <el-form  :model="contentForm" :rules="rules" ref="contentForm" id="addComment" class="display_none">
      <el-form-item prop="body">
        <el-input type="textarea" v-model="contentForm.body"></el-input>
      </el-form-item>
      <el-button type="primary"  size="mini" @click="submit_des(contentForm)">评 论</el-button>
      <el-button size="mini" @click="cancle_com">取 消</el-button>
    </el-form>
        <!----------------------------------------------------------------------------------------->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page=this.comments._meta.page
      :page-size="5"
      layout="total,prev, pager, next, jumper"
      :total="this.comments._meta.total_items">
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
    name: 'receivedComments',
  components:{
    VueMarkdown
  },
    data(){
      var checkBody = (rule, value, callback)=>{
        if(value === '')
          callback(new Error('评论不能为空'))
        else if(value.length>100)
          callback(new Error('评论过长'))
        else callback()
      }
      return{
        sharedState: store.state,
        comments:'',
        contentForm:{
          body:'',
          parentId:0,
          articleId:0
        },
        rules:{
          body:[{validator:checkBody,trigger:'blur'}]
        }
      }
    },
  methods:{
      getNewComments(mark){
        let page = 1
        const user_id = this.sharedState.user_id
        const path = 'user/receivedComments/'+user_id+'?page='+page+'&mark='+mark
        this.$axios.get(path)
        .then(response => {
          if(response.status === 200){
            console.log(response.data)
            this.comments = response.data
          }
        })
        .catch(error => {
          this.$message.error('获取新评论失败！')
        })
      },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {                                    //改变页码
      const user_id = this.sharedState.user_id
      const path = 'user/reveivedCommets/'+user_id+'?page='+val+'&mark=false'
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
        const path = 'comment/comments/' + id
        this.$axios.delete(path)
          .then((response)=> {
            if(response.data === 'Success') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getNewComments(false)
              this.contentForm.body=''
              this.contentForm.parentId=0
              this.contentForm.articleId =0
              $('#addComment').addClass('display_none')
            }
            else  this.$message.error('删除失败！')
          })
      })
    },
    disableOrEnable_com(id, enabled){
      const path = 'comment/comments/'+id+'/disableOrEnable'
      axios.put(path,{
        "disableOrEnable":!enabled
      })
        .then(response => {
          if (response.data === 'Success') {
            this.getNewComments(false);
            console.log(response)
          }
        })
        .catch(error => {
          this.$message.error('操作失败！')
        })
    },
    submit_des(contentForm){
      this.$refs.contentForm.validate((valid) => {
        if (valid) {                                           // 子评论
          this.$axios.post('comment/comments',{
            'article_id':this.contentForm.articleId,
            'body':this.contentForm.body,
            'parentId':this.contentForm.parentId
          })
            .then((response)=>{
              console.log(response)
              if (response.status === 201) {
                this.$message({             //message消息提示
                  message: '评论成功！',
                  type: 'success'
                });
                this.getNewComments(false)
                this.contentForm.body=''
                this.contentForm.parentId=0
                this.contentForm.articleId =0
                $('#addComment').addClass('display_none')
              }
            })
            .catch((error) => {
              this.$message.error('评论失败！');
            });
        }
      })

    },
    cancle_com(){
      this.contentForm.body=''
      this.contentForm.parentId=0
      this.contentForm.articleId =0
        $('#addComment').addClass('display_none')
    },
    add_com(id,aid){
      this.contentForm.body=''
      this.contentForm.parentId = id
      this.contentForm.articleId = aid
    },
  },
  created () {
      this.getNewComments(false)
    $("body").on('click', ".reply", function () {            // 为什么？？？ 为什么body？？？？
      var $comment = $(this).closest('.comment_item');
      console.log($comment)
      $('#addComment').removeClass('display_none')
      $comment.after($('#addComment'));
    })
  }
}
</script>

<style scoped>
  .has_new{
    padding: 5px;
    text-align: left;
  }
  .comment_item{
    border: #eeeeee dashed 1px;
    height: 150px;
    margin: 5px;
  }
  .red_dot{
    margin: 18px;
    float: left;
  }
  .comment_new_ava{
    height: 30px;
    width: 30px;
    float: left;
    display: inline;
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
    height: 20px;
  }
  .comment_title{
    float: left;
    font-size: small;
  }
  .comment_time{
    font-size:12px;
    color: #8c939d;
    padding-left: 66px;
    text-align: left;
    font-style: normal;
  }
  .comment_body{
    padding-left: 66px;
    height: 64px;
  }
  .comment_parent{
    float: left;
    font-size: small;
  }
  .comment_summary{
    float: left;
    font-size: small;
    height: 24px;
    text-align: left;
  }
  .comment_disable{
    width: 80%;
    margin:auto;
    height: 60px;
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
  .info_but:hover{
    color: #409eff;
  }
  .display_none{
    display: none;
  }
</style>

<template>
  <div  v-if="posts" >
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
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../../assets/bootstrap-markdown/js/marked.js'
import VueMarkdown from 'vue-markdown'    //解析markdown原文为html
export default {
    name: 'hisPosts',

    components:{
    VueMarkdown                           //什么意思？？？？
  },
    data(){
      return{
        sharedState: store.state,
        posts: '',
        id:0,
        totalItems:0
      }
    },
  methods:{
    getPosts(){
      let page=1
      let iid=this.$route.params.id
      const path='post/getOnesPosts/'+iid+'?page='+page    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.posts=response.data
          this.totalItems=this.posts._meta.total_items
        })
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {                                    //改变页码
      const path='post/getOnesPosts/'+iid+'?page='+val    //在url中添加参数
      axios.get(path)
        .then((response)=>{
          console.log(response.data)
          this.posts=response.data
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

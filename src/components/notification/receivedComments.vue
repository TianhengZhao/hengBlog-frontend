<template>
  <div  v-if="comments" >
    <div v-for="(items, index) in comments.items"  v-bind:key="index" class="post_item">
      <router-link v-bind:to="{name:'hisPosts',params:{id:items.author.id}}">
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
          <i id="time" class="el-icon-time">{{ $moment(items.timestamp).format('YYYY/MM/DD H:mm') }}</i>
          <el-divider direction="vertical"></el-divider>
          <i class="el-icon-view" >{{items.views}}</i>
        </div>
      </div>
    </div>
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
import store from '../../store'

export default {
    name: 'receivedComments',
    data(){
      return{
        sharedState: store.state,
        comments:''
      }
    },
  methods:{
      getNewComments(){
        let page = 1
        if (typeof this.$route.query.page != 'undefined') {              //用到 typeof
          page = this.$route.query.page
        }
        const user_id = this.sharedState.user_id
        const path = 'user/reveivedCommets/'+user_id+'?page='+page
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

      }
  },
  created () {
      this.getNewComments()
  }
}
</script>

<style scoped>

</style>

<template>
  <div v-if='posts'>
    <div class='total'>
      <span class='el-icon-document'>共{{ this.totalItems }}篇文章</span>
    </div>
    <div
      v-for='(items, index) in posts.items'
      v-bind:key='index'
      class='post_item'
    >
      <router-link :to="{ name: 'hisPosts', params: { id: items.author.id } }">
        <img
          v-bind:src='items.author._links.avatar'
          class='post_ava'
          alt='头像'
        />
      </router-link>
      <div class='post_top'>
        <router-link
          v-bind:to="{ name: 'post', params: { id: items.id } }"
          class='post_title'
        >
          {{ items.title }}
        </router-link>
      </div>
      <div class='post_body'>
        <vue-markdown class='post_summary' :source='items.summary'>
        </vue-markdown>
      </div>
      <div class='post_bottom'>
        <div
          class='hp_del_but'
          v-if='items.author && items.author.id === sharedState.user_id'
        >
          <el-button
            size='mini'
            icon='el-icon-delete'
            circle
            type='danger'
            @click='del(items.id)'
          ></el-button>
        </div>
        <div class='hp_info'>
          <i id='time' class='el-icon-time'>
            {{ $moment(items.timestamp).format('YYYY/MM/DD H:mm') }}
          </i>
          <el-divider direction='vertical'></el-divider>
          <i class='el-icon-view'>{{ items.views }}</i>
        </div>
      </div>
    </div>
    <el-pagination
      @current-change='handleCurrentChange'
      @size-change='handleSizeChange'
      :current-page='this.posts._meta.page'
      :page-size='5'
      layout='total,prev, pager, next, jumper'
      :total='this.posts._meta.total_items'
    >
    </el-pagination>
  </div>
</template>

<script>
import store from '../../store'
import axios from 'axios'
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../../assets/bootstrap-markdown/js/marked.js'
import VueMarkdown from 'vue-markdown' // 解析markdown原文为html
export default {
  name: 'hisPosts',
  components: {
    VueMarkdown
  },
  data () {
    return {
      sharedState: store.state,
      posts: '',
      id: 0,
      totalItems: 0
    }
  },
  methods: {
    getPosts () {
      console.log(this.$route)
      let page = 1
      let iid = this.$route.params.id
      const path = 'post/getOnesPosts/' + iid + '?page=' + page // 在url中添加参数
      axios.get(path).then((response) => {
        console.log(response.data)
        this.posts = response.data
        this.totalItems = this.posts._meta.total_items
      })
    },
    handleSizeChange (val) {},
    handleCurrentChange (val) {
      // 改变页码
      let iid = this.$route.params.id
      const path = 'post/getOnesPosts/' + iid + '?page=' + val // 在url中添加参数
      axios.get(path).then((response) => {
        console.log(response.data)
        this.posts = response.data
      })
    },
    del (id) {
      this.$confirm('确认删除该博客?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const path = 'post/getPost/' + id
          this.$axios.delete(path).then((response) => {
            if (response.data === 'Success') {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getPosts()
            } else {
              // this.$router.push('/')
              this.$message.error('删除失败！')
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created () {
    this.getPosts()
  },
  beforeRouteUpdate (to, from, next) {
    next()
    this.getPosts()
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/style.scss";
.total{
  padding: 5px;
  text-align: left;
  color: $gre_color;
  font-size: smaller;
  margin-bottom: 20px;
}
.hp_del_but{
  display: inline;
  float: left;
  margin-left: 90px;
}
.hp_info{
  float: right;
  font-size: smaller;
  color: $gre_color;
  margin-right: 5px;
  display: inline;
}
</style>

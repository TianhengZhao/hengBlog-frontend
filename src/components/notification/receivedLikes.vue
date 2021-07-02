<template>
  <div v-if='likes'>
    <div v-if='likes.has_new' class='has_new'>
      <el-button
        type='text'
        class='el-icon-circle-check'
        @click='getNewlikes(true)'
        >全部标记已读</el-button
      >
    </div>
    <div v-else class='has_new'>
      <el-button type='text' class='el-icon-check' disabled>全部已读</el-button>
    </div>
    <div v-for='(like, index) in likes.items' v-bind:key='index' class='r_item'>
      <el-badge v-if='like.is_new' is-dot class='red_dot'>
        <router-link :to="{ name: 'hisPosts', params: { id: like.author.id } }">
          <img
            v-bind:src='like.author._links.avatar'
            class='r_new_ava'
            alt='头像'
          />
        </router-link>
      </el-badge>
      <router-link
        v-else
        v-bind:to="{ name: 'hisPosts', params: { id: like.author.id } }"
      >
        <img
          v-bind:src='like.author._links.avatar'
          class='comment_ava'
          alt='头像'
        />
      </router-link>
      <div class='r_top'>
        <router-link
          v-bind:to="{ name: 'hisPosts', params: { id: like.author.id } }"
          class='comment_title_info'
        >
          {{ like.author.username }}
        </router-link>
        <span class='comment_title_s'>赞了你的评论:</span>
        <router-link
          v-bind:to="{ name: 'post', params: { id: like.comment.post.id } }"
          class='comment_title_info'
        >
          {{ like.comment.body }}
        </router-link>
      </div>
      <div class='comment_time'>
        <i style='font-style: normal'>
          {{ $moment(like.timestamp).format('YYYY/MM/DD H:mm') }}
        </i>
        <!--去掉i标签斜体样式-->
      </div>
    </div>
    <!----------------------------------------------------------------------------------------->
    <el-pagination
      @current-change='handleCurrentChange'
      @size-change='handleSizeChange'
      :current-page='this.likes._meta.page'
      :page-size='5'
      layout='total,prev, pager, next, jumper'
      :total='this.likes._meta.total_items'
    >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../../store'
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../../assets/bootstrap-markdown/js/marked.js'
export default {
  name: 'receivedLikes',
  data () {
    return {
      sharedState: store.state,
      likes: ''
    }
  },
  methods: {
    getNewlikes (mark) {
      let page = 1
      const userId = this.sharedState.user_id
      const path =
        'user/receivedLikes/' + userId + '?page=' + page + '&mark=' + mark
      this.$axios
        .get(path)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data)
            this.likes = response.data
          }
        })
        .catch((error) => {
          if (error) {
            console.log(error)
          }
          this.$message.error('获取新的赞失败！')
        })
    },
    handleSizeChange (val) {},
    handleCurrentChange (val) {
      // 改变页码
      const userId = this.sharedState.user_id
      const path =
        'user/receivedLikes/' + userId + '?page=' + val + '&mark=' + false // 这里的mark无法表示
      axios.get(path).then((response) => {
        console.log(response.data)
        this.likes = response.data
      })
    }
  },
  created () {
    this.getNewlikes(false)
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/style/receive.scss";
</style>

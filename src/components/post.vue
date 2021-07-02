<template>
  <!-- 展示文章 -->
  <div class='container' v-if='post'>
    <div class='title'>
      <h3 class='el-icon-tickets'>{{ this.post.title }}</h3>
    </div>
    <div class='summary'>
      <span>{{ this.post.summary }}</span>
    </div>
    <div class='function'>
      <div>
        <router-link
          v-bind:to="{ name: 'hisPosts', params: { id: post.author.id } }"
          class='name_link'
        >
          {{ this.post.author.username }}
        </router-link>
      </div>
      <div
        class='post_com_but'
        v-if='post.author && post.author.id === sharedState.user_id'
      >
        <el-button
          type='danger'
          icon='el-icon-delete'
          size='mini'
          circle
          @click='del'
        ></el-button>
      </div>
      <div class='info'>
        <i id='time' class='el-icon-time'>
          {{ $moment(post.timestamp).format('YYYY/MM/DD H:mm') }}
        </i>
        <el-divider direction='vertical'></el-divider>
        <i class='el-icon-view'>{{ post.views }}</i>
      </div>
    </div>
    <el-divider></el-divider>
    <div class='body'>
      <vue-markdown
        :source='this.post.body'
        :toc-first-level='1'
        :toc-last-level='3'
      >
      </vue-markdown>
    </div>
    <!-------------------------------------------------显示评论------------------------------------------------->
    <div class='divide'>
      <el-divider><i class='el-icon-chat-line-round'>评论区</i></el-divider>
      <!-----------------------进行一级评论------------------------------->
      <el-form
        v-if='sharedState.is_authenticated'
        :model='contentForm'
        :rules='rules'
        ref='contentForm'
      >
        <el-form-item prop='body'>
          <el-input
            type='textarea'
            v-model='contentForm.body'
            class='com_content'
          ></el-input>
        </el-form-item>
        <el-button
          type='primary'
          class='but'
          size='mini'
          @click='submit(contentForm)'
        >
          评 论
        </el-button>
      </el-form>
      <el-alert
        v-else
        type='warning'
        description='登录后方可发表评论！'
        show-icon
      >
      </el-alert>
      <!-----------------------进行子评论------------------------------->
      <el-form
        :model='descontentForm'
        :rules='rules'
        ref='descontentForm'
        id='addComment'
        class='display_none'
      >
        <el-form-item prop='body'>
          <el-input
            type='textarea'
            v-model='descontentForm.body'
            class='des_content'
          ></el-input>
        </el-form-item>
        <el-button
          type='primary'
          class='but'
          size='mini'
          @click='submit_des(descontentForm)'
        >
          评 论
        </el-button>
        <el-button class='but' size='mini' @click='cancle_com'>取 消</el-button>
      </el-form>
      <!-----------------------------------------显示一级评论--------------------------------------------->
      <div v-if='comments' id='panel'>
        <div
          v-for='(items, index) in comments.items'
          v-bind:key='index'
          class='comment_container'
        >
          <!--一级评论＋子评论容器-->
          <div class='comment_item'>
            <router-link
              v-bind:to="{ name: 'hisPosts', params: { id: items.author.id } }"
            >
              <img
                v-bind:src='items.author._links.avatar'
                class='comment_ava'
                alt='头像'
              />
            </router-link>
            <div class='comment_top'>
              <router-link
                v-bind:to="{
                  name: 'hisPosts',
                  params: { id: items.author.id },
                }"
                class='comment_title'
              >
                {{ items.author.username }}
              </router-link>
            </div>
            <div class='comment_time'>
              <i style='font-style: normal'>
                {{ $moment(items.timestamp).format('YYYY/MM/DD H:mm') }}
              </i>
              <!--去掉i标签斜体样式-->
            </div>
            <div v-if='!items.disabled' class='comment_body'>
              <vue-markdown class='comment_summary' :source='items.body'></vue-markdown>
            </div>
            <div v-else class='comment_disable'>
              <el-alert title='该内容已被屏蔽' type='error' :closable='false'></el-alert>
            </div>
            <div v-if='!items.disabled' class='comment_info'>
              <el-button
                v-if='sharedState.is_authenticated && post.author.id === sharedState.user_id'
                type='text'
                class='info_but el-icon-s-release'
                @click='disableOrEnable_com(items.id, items.disabled)'
              >
                屏蔽
              </el-button>
              <el-button
                v-if='items.author.id === sharedState.user_id || post.author.id === sharedState.user_id'
                type='text'
                class='info_but el-icon-delete-solid'
                @click='del_com(items.id)'
              >
                删除
              </el-button>
              <!---------乱入 为了不窜行 待改------------------------------------------->
              <el-button
                v-if='sharedState.is_authenticated && post.author.id !== sharedState.user_id'
                type='text'
              ></el-button>
              <el-button
                v-if='items.author.id !== sharedState.user_id && post.author.id !== sharedState.user_id'
                type='text'
              ></el-button>
              <!---------------------------------------------------------------------->
              <el-button
                v-if='sharedState.is_authenticated'
                type='text'
                class='info_but el-icon-s-comment reply'
                @click='add_des_com(items.id)'
              >
                回复
              </el-button>
              <el-button
                v-if='sharedState.is_authenticated'
                type='text'
                v-bind:class="{
                  active_like:items.likers_id.indexOf(sharedState.user_id) !== -1,
                }"
                class='info_but el-icon-star-off'
                @click='like_unlike_com(items)'
              >
                {{ items.likers_id.length }}
              </el-button>
              <!--length的使用-->
            </div>
            <div v-else class='comment_info'>
              <el-button
                v-if='sharedState.is_authenticated && post.author.id === sharedState.user_id'
                type='text'
                class='info_but el-icon-document-remove'
                @click='disableOrEnable_com(items.id, items.disabled)'
              >
                取消屏蔽
              </el-button>
            </div>
            <!-----------------------------------------------------显示子评论----------------------------------------------->    
            <div v-if='items.descendants'>
              <div
                v-for='(des_com, dindex) in items.descendants'
                v-bind:key='dindex'
                class='des_item'
              >
                <router-link
                  v-bind:to="{
                    name: 'hisPosts',
                    params: { id: items.author.id },
                  }"
                >
                  <img
                    v-bind:src='des_com.author._links.avatar'
                    class='comment_ava'
                    alt='头像'
                  />
                </router-link>
                <div class='comment_top'>
                  <router-link
                    v-bind:to="{
                      name: 'hisPosts',
                      params: { id: des_com.author.id }
                    }"
                    class='comment_title'
                  >
                    {{ des_com.author.username }}
                  </router-link>
                </div>
                <div class='comment_time'>
                  <i style='font-style: normal'>
                    {{ $moment(des_com.timestamp).format('YYYY/MM/DD H:mm') }}
                  </i>
                  <!--去掉i标签斜体样式-->
                </div>
                <div v-if='!des_com.disabled' class='comment_body'>
                  <router-link
                    v-bind:to="{
                      name: 'hisPosts',
                      params: { id: des_com.parent.author.id }
                    }"
                    class='comment_summary_name'
                  >
                    @{{ des_com.parent.author.username }} :
                  </router-link>
                  <vue-markdown class='comment_summary' :source='des_com.body'>
                  </vue-markdown>
                </div>
                <div v-else class='comment_disable'>
                  <el-alert title='该内容已被屏蔽' type='error' :closable='false'></el-alert>
                </div>
                <div v-if='!des_com.disabled' class='comment_info'>
                  <el-button
                    v-if='sharedState.is_authenticated && post.author.id === sharedState.user_id'
                    type='text'
                    class='info_but el-icon-s-release'
                    @click='disableOrEnable_com(des_com.id, des_com.disabled)'
                  >
                    屏蔽
                  </el-button>
                  <el-button
                    v-if='des_com.author.id === sharedState.user_id || post.author.id === sharedState.user_id'
                    type='text'
                    class='info_but el-icon-delete-solid'
                    @click='del_com(des_com.id)'
                  >
                    删除
                  </el-button>
                  <el-button
                    v-if='sharedState.is_authenticated'
                    type='text'
                    class='info_but el-icon-s-comment reply child'
                    @click='add_des_com(des_com.id)'
                  >
                    回复
                  </el-button>
                  <el-button
                    v-if='sharedState.is_authenticated'
                    type='text'
                    v-bind:class="{
                      active_like:des_com.likers_id.indexOf(sharedState.user_id) !== -1,
                    }"
                    class='info_but el-icon-star-off'
                    @click='like_unlike_com(des_com)'
                  >
                    {{ des_com.likers_id.length }}
                  </el-button>
                  <!--length的使用-->
                </div>
                <div v-else class='comment_info'>
                  <el-button
                    v-if='sharedState.is_authenticated && post.author.id === sharedState.user_id'
                    type='text'
                    class='info_but el-icon-document-remove'
                    @click='disableOrEnable_com(des_com.id, des_com.disabled)'
                  >
                    取消屏蔽
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          @current-change='handleCurrentChange'
          @size-change='handleSizeChange'
          :current-page='this.comments._meta.page'
          :page-size='5'
          layout='total,  prev, pager, next, jumper'
          :total='this.comments._meta.total_items'
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store'
import '../assets/bootstrap-markdown/js/bootstrap-markdown.js'
import '../assets/bootstrap-markdown/js/bootstrap-markdown.zh.js'
import '../assets/bootstrap-markdown/js/marked.js'
import VueMarkdown from 'vue-markdown' // 解析markdown原文为html
import '../assets/jquery.sticky'

export default {
  name: 'post',
  components: {
    VueMarkdown
  },
  data () {
    var checkBody = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('评论不能为空'))
      } else {
        if (value.length > 100) {
          callback(new Error('评论过长'))
        } else callback()
      }
    }
    return {
      sharedState: store.state,
      post: '',
      comments: '',
      likes_count: '',
      contentForm: {
        body: ''
      },
      descontentForm: {
        parentId: 0,
        body: ''
      },
      postForm: {
        title: '',
        summary: '',
        body: ''
      },
      rules: {
        body: [{ validator: checkBody, trigger: 'blur' }]
      }
    }
  },
  methods: {
    getPost () {
      let postId = this.$route.params.id
      axios.get('post/getPost/' + postId).then((response) => {
        console.log(response.data)
        this.post = response.data
      })
    },
    del () {
      this.$confirm('确认删除该博客?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const path = 'post/getPost/' + this.post.id
        this.$axios.delete(path).then((response) => {
          if (response.data === 'Success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$router.push('/')
          } else {
            this.$router.push(this.$route.query.redirect)
          }
        })
      })
    },
    getComments () {
      let postId = this.$route.params.id
      let page = 1
      if (typeof this.$route.query.page !== 'undefined') {
        page = this.$route.query.page
      }
      const path = 'post/getComments/' + postId + '?page=' + page
      axios.get(path).then((response) => {
        console.log(response.data)
        this.comments = response.data
      })
    },
    submit (contentForm) {
      this.$refs.contentForm.validate((valid) => {
        if (valid) {
          // 一级评论
          axios
            .post('comment/comments', {
              article_id: this.$route.params.id,
              body: this.contentForm.body,
              parentId: 0
            })
            .then((response) => {
              console.log(response)
              if (response.status === 201) {
                this.$message({
                  message: '评论成功！',
                  type: 'success'
                })
                this.getComments()
                this.contentForm.body = ''
              }
            })
            .catch((error) => {
              if (error) {
                console.log(error)
              }
              this.$message.error('评论失败！')
            })
        }
      })
    },
    submit_des (descontentForm) {
      this.$refs.descontentForm.validate((valid) => {
        if (valid) {
          // 子评论
          axios
            .post('comment/comments', {
              article_id: this.$route.params.id,
              body: descontentForm.body,
              parentId: descontentForm.parentId
            })
            .then((response) => {
              console.log(response)
              if (response.status === 201) {
                this.$message({
                  // message消息提示
                  message: '评论成功！',
                  type: 'success'
                })
                this.getComments()
                this.descontentForm.body = ''
                this.descontentForm.parentId = 0
                $('#addComment').addClass('display_none')
              }
            })
            .catch((error) => {
              if (error) {
                console.log(error)
              }
              this.$message.error('评论失败！')
            })
        }
      })
    },
    cancle_com () {
      this.descontentForm.body = ''
      this.descontentForm.parentId = 0
      $('#addComment').addClass('display_none')
    },
    add_des_com (id) {
      this.descontentForm.parentId = id
      console.log(this.descontentForm)
    },
    handleSizeChange (val) {},
    handleCurrentChange (val) {
      // 改变页码
      let postId = this.$route.params.id
      const path = 'post/getComments/' + postId + '?page=' + val // 在url中添加参数
      axios.get(path).then((response) => {
        console.log(response.data)
        this.comments = response.data
      })
    },
    disableOrEnable_com (id, enabled) {
      const path = 'comment/comments/' + id + '/disableOrEnable'
      axios
        .put(path, {
          disableOrEnable: !enabled
        })
        .then((response) => {
          if (response.data === 'Success') {
            this.getComments()
            console.log(response)
          }
        })
        .catch((error) => {
          if (error) {
            console.log(error)
          }
          this.$message.error('操作失败！')
        })
    },
    del_com (id) {
      this.$confirm('确认删除该评论?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const path = 'comment/comments/' + id
        this.$axios.delete(path).then((response) => {
          if (response.data === 'Success') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getComments()
            $('#addComment').addClass('display_none')
            this.descontentForm.body = ''
            this.descontentForm.parentId = 0
          } else this.$message.error('删除失败！')
        })
      })
    },
    like_unlike_com (comment) {
      // 参数为comment
      let path = '' // 先定义path
      if (comment.likers_id.indexOf(this.sharedState.user_id) !== -1) {
        // 点过赞，则取消点赞
        path = 'comment/comments/' + comment.id + '/unlike'
      } else {
        // 未点过赞，点赞
        path = 'comment/comments/' + comment.id + '/like'
      }
      axios
        .get(path)
        .then((response) => {
          if (response.data === 'Success') {
            this.getComments()
            console.log(response)
          }
        })
        .catch((error) => {
          if (error) {
            console.log(error)
          }
          this.$message.error('点赞失败！')
        })
    }
  },
  created () {
    this.getPost()
    this.getComments()
    $(document).ready(function () {
      $('body').on('click', '.reply', function () {
        // body!!!!!
        var $comment = $(this).closest('.comment_item')
        if ($comment.hasClass('child')) {
          $('#addComment').addClass('alt_width')
          this.descontentForm.body = ''
          this.descontentForm.parentId = 0
        }
        console.log($comment)
        $('#addComment').removeClass('display_none')
        $comment.after($('#addComment'))
      })
    })
  }
}
</script>

<style lang='scss' scoped>
@import '../assets/style/style.scss';
.container {
  width: 80%;
  margin: auto;
  padding-top: 20px;
}
.container:after{
  content: "";
  display: table;
  clear: both;
}
.title{
  margin:20px;
}
.summary{
  margin:20px;
  font-style: oblique;
}
.name_link{
  color: $bla_color;
  &:hover{
    color: $yel_color ;
  }
}
.body{
  width: 100%;
  text-align: left;
}
.body:after{
  content: "";
  display: table;
  clear: both;
}
.post_com_but{
  float: left;
  margin-bottom: 5px;
}
.info{
  float: right;
  font-size: smaller;
  color: $gre_color;
}
.function{
  height: 40px;
}
.divide{
  margin-top: 50px;
  margin-bottom: 50px;
}
.but{
  margin-bottom: 15px;
}
.comment_container:after{
  content: "";
  display: table;
  clear: both;
}
.comment_item{
  border: $gre_color dashed 1px;
  height: 150px;
  margin: 5px;
}
.comment_ava{
  height: 30px;
  width: 30px;
  margin: 18px;
  float: left;
  display: inline;
}
.comment_disable{
  width: 80%;
  margin:auto;
  height: 60px;
}
.comment_top{
  margin-top: 15px;
  margin-right: 5px;
  height: 25px;
}
.comment_time {
  font-size: 0.75rem;
  color: $gre_color;
  padding-left: 66px;
  text-align: left;
  font-style: normal;
}
.comment_body{
  height: 60px;
  overflow: auto;
}
.comment_summary{
  @include comment_summary;
}
.comment_summary_name{
  @include comment_summary;
  &:hover{
    color: $yel_color ;
  }
}
.comment_info{
  height: 28px;
  float: right;
  margin-right: 5px;
}
.info_but{
  font-size: smaller;
  color: $bla_color;
  &:hover{
    color: $yel_color ;
  }
}

.active_like{
  color: $red_color;
}
.des_item{
  margin-top: 5px;
  width: 90%;
  float: right;
  border: $gre_color dashed 1px;
}
.des_item:after{
  content: "";
  display: table;
  clear: both;
}
.alt_width{
  width: 90%;
  float: right;
}
.fansile{
  width: 100px;
}
</style>

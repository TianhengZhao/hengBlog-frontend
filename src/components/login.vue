<template>
  <div class='container_login'>
    <el-form
      ref='form'
      :model='form'
      :rules='rules'
      label-width='80px'
      class='login-page'
    >
      <img class='img_login' src='@/assets/logo.jpg' />
      <h2>HengBlog登录</h2>
      <el-form-item label='用  户:' prop='username'>
        <!--prop对应rules中的规则-->
        <el-input v-model='form.username' placeholder='请输入用户名'>
          <el-button slot='prepend' icon='el-icon-user'></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label='密 码:' prop='password'>
        <el-input
          v-model='form.password'
          type='password'
          placeholder='请输入密码'
        >
          <el-button slot='prepend' icon='el-icon-key'></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-link type='primary' id='signin' @click='signin'>注册</el-link>
      </el-form-item>
      <el-button type='primary' icon='el-icon-user-solid' @click='login(form)'>登 录</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store'
export default {
  name: 'login',
  data () {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        return callback() // 千万不要忘记返回！！
      }
    }
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        return callback()
      }
    }
    return {
      form: {
        username: '',
        password: '',
        rem: false
      },
      rules: {
        username: [{ validator: checkName, trigger: 'blur' }],
        password: [{ validator: checkPass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    login (form) {
      // 数据校验
      this.$refs.form.validate((valid) => {
        if (valid) {
          axios
            .post('/auth/loginData', {
              username: this.form.username,
              password: this.form.password
            })
            .then((response) => {
              console.log(response)
              if (response.data !== false) {
                store.resetNotNewAction()
                window.localStorage.setItem('token', response.data) // 存入token值
                store.loginAction() // is_authenticated变为true
                this.$router.push('/')
              } else if (response.data === false) {
                // 在flask里return 'false'
                this.$message.error('用户名或密码错误！')
              }
            })
        }
      })
    },
    signin () {
      this.$router.push('signin') // 跳转到注册页面
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/style.scss';
.img_login {
  width:120px;
  height:120px;
}
.container_login {
  @include container_in;
  margin-top: 10px;
}
.login-page {
  border-radius: 5px;
  margin: auto;
  width: 40%;
  padding: 35px 55px 15px;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px $gre_color;
}
#signin {
  float: right;
  &:hover{
    color: $yel_color ;
    text-decoration: $yel_color ;
  }
}
</style>

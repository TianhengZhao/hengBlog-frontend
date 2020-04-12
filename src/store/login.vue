<template>
  <div class="container">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="login-page" >
      <img src="@/assets/logo.jpg">
      <h2>HengBlog登录</h2>
      <el-form-item label="用  户:" prop="username">    <!--prop对应rules中的规则-->
        <el-input v-model="form.username" placeholder="请输入用户名">
          <el-button slot="prepend" icon="el-icon-user"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="密 码:">
        <el-input v-model="form.password" type="password" placeholder="请输入密码">
          <el-button slot="prepend" icon="el-icon-key"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
          <el-checkbox label="记住密码" name="remember" id="rem">
          </el-checkbox>
        <el-link type="primary" id="signin" @click="signin">注册</el-link>
      </el-form-item>
      <el-button type="primary" icon="el-icon-user-solid" @click="login">登 录</el-button>
    </el-form>
  </div>
</template>

<script>/* eslint-disable */
  export default {
    name: 'login',
    data() {
      return {
        form: {
          username: "",
          password: ""
        },
        rules: {
          username: [{ required: true, message: "请输入用户名", trigger: "blur" }]
        }
      };
    },
    methods: {
      login() {
        // 数据校验
        this.$refs.form.validate(valid => {
          if (valid) {
            console.log('验证成功')
          }
        });
      },
      signin(){
        this.$router.push("signin")    //跳转到注册页面
      }


    }
  };
</script>
<style scoped>
  img {
    width:120px;
    height:120px;
  }
  .container {
    margin-top: 100px;
    width: 100%;
    height: 100%;
  }
  .login-page {
    border-radius: 5px;
    margin: auto;
    width: 350px;
    padding: 35px 55px 15px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }
  #rem {
    float: left;
  }
  #signin {
    float: right;
  }
</style>

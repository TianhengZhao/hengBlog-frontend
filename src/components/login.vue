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
      <el-form-item label="密 码:" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码">
          <el-button slot="prepend" icon="el-icon-key"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
          <el-checkbox label="记住密码" name="remember" id="rem" v-model="form.rem">
          </el-checkbox>
        <el-link type="primary" id="signin" @click="signin">注册</el-link>
      </el-form-item>
      <el-button type="primary" icon="el-icon-user-solid" @click="login(form)">登 录</el-button>
    </el-form>
  </div>
</template>

<script>/* eslint-disable */
import axios from 'axios'
import store from '../store'
  export default {
    name: 'login',
    data() {
      var checkName = (rule,value,callback)=> {
        if (value === '') {
          callback(new Error('请输入用户名'));
        }
        else return callback();                              //千万不要忘记返回！！
      };
      var checkPass = (rule,value,callback)=> {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        else return callback();
      };
      return {
        form: {
          username: "",
          password: "",
          rem:false

        },
        rules: {
          username: [{ validator: checkName, trigger: "blur" }],
          password: [{ validator: checkPass, trigger: "blur" }]
        }
      };
    },
    methods: {
      login(form){
        // 数据校验
        this.$refs.form.validate((valid) => {
          if (valid) {
            axios.post('/auth/loginData', {   //localhost换成ip呢？？？？
               username: this.form.username,
               password: this.form.password,
               rem:this.form.rem
             })
               .then((response) => {
                 console.log(response)
                 if (response.data !== 'Wrong') {
                   store.resetNotNewAction();  //登录成功后，修改store中状态，为什么此处把is_new变成false？？？？
                   window.localStorage.setItem('token',response.data );   //存入token值
                   store.loginAction();        //is_authenticated变为true
                   this.$router.push("/");

                 }
                 else if(response.data === 'Wrong'){
                   this.$message.error('用户名或密码错误！');
                 }

               })
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
    margin-top: 10px;
    width: 100%;
    height: 100%;
  }
  .login-page {
    border-radius: 5px;
    margin: auto;
    width: 500px;
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

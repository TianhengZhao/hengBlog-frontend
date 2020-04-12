<template>
  <div class="container">
  <el-form :model="sForm" :rules="rules" ref="sForm" label-width="100px" class="sForm">
    <el-form-item  label="用户名" prop="name">
      <el-input v-model="sForm.name" placeholder="长度不超过20字符"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password" >
      <el-input type="password" v-model="sForm.password"  placeholder="长度3-15位"></el-input>
    </el-form-item>
    <el-form-item  label="确认密码" prop="checkpass" >
      <el-input  type="password" v-model="sForm.checkpass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="sForm.email"></el-input>
    </el-form-item>
    <el-button type="primary"  @click="signin(sForm)" class="but">注 册</el-button>
    <el-button   @click="back" class="but">返 回</el-button>
  </el-form>
  </div>
</template>

<script>/* eslint-disable */
  export default {
    name: 'signin',
    data(){
      var checkName = (rule,value,callback)=>{
        if (value === '') {
          callback(new Error('用户名不能为空'));
        }
        else if(value.length>20){
           callback(new Error('用户名过长'));
        }
        else callback();     //必须要有callback返回
      };  //分号
      var checkPass = (rule,value,callback)=>{
        console.log(value)
        if (value == '') {
          callback(new Error('密码不能为空'));
        }
        else if(value.length<3 || value.length>15)
        {
           callback(new Error('密码长度不符'));
        }
        else callback();
      };
      var checkPass1 = (rule,value,callback)=>{
        if (value === '') {
          return callback(new Error('确认密码不能为空'));
        }
        else if(value !== this.sForm.password)
        {
          return callback(new Error('两次输入密码不一致'));
        }
        else {callback();}
      };
      var checkEmail = (rule,value,callback)=> {
        let reg= /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/   //邮箱格式正则表达式
        if (value === '') {
          return callback(new Error('邮箱不能为空'));
        }
        else if(!reg.test(value))
        {
          return callback(new Error('邮箱格式不正确'));
        }
        else {callback();}
      };
      return{
        sForm: {
          name:"",
          password:"",
          checkpass:"",
          email:""
        },
        rules:{
          name: [{ validator:checkName, trigger: "blur" }],
          password:[{validator:checkPass,trigger:'blur'}],//prop值是“password”，sForm里是“password”，rules里也应为“password”
          checkpass:[{validator:checkPass1, trigger: 'blur'}],
          email:[{validator:checkEmail, trigger: 'blur'}]
        }
      }
    },
    methods: {
      back(){
        this.$router.push("/");    //返回到登录页面
      }
    }

  }
</script>

<style scoped>
  .container {
    margin-top: 100px;
    width: 100%;
    height: 100%;
  }
  .sForm{
    margin: auto;
    width: 550px;
  }

</style>

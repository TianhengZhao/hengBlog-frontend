<template>
  <div class='container_50'>
    <el-form
      :model='sForm'
      :rules='rules'
      ref='sForm'
      label-width='100px'
      class='sForm'
    >
      <el-form-item label='用户名' prop='username'>
        <el-input
          v-model='sForm.username'
          placeholder='长度不超过20字符'
        ></el-input>
      </el-form-item>
      <el-form-item label='密码' prop='password'>
        <el-input
          type='password'
          v-model='sForm.password'
          placeholder='长度3-15位'
        ></el-input>
      </el-form-item>
      <el-form-item label='确认密码' prop='checkpass'>
        <el-input
          type='password'
          v-model='sForm.checkpass'
          autocomplete='off'
        ></el-input>
      </el-form-item>
      <el-form-item label='邮箱' prop='email'>
        <el-input v-model='sForm.email'></el-input>
      </el-form-item>
      <el-button type='primary' @click='signin(sForm)' class='but'>注 册</el-button>
      <el-button @click='back' class='but'>返 回</el-button>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
import store from '../store.js'
import router from '../router'
export default {
  name: 'signin',
  data () {
    var checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('用户名不能为空'))
      } else if (value.length > 20) {
        callback(new Error('用户名过长'))
      } else {
        callback()
      }
    } // 分号
    var checkPass = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('密码不能为空'))
      } else if (value.length < 3 || value.length > 15) {
        callback(new Error('密码长度不符'))
      } else {
        callback()
      }
    }
    var checkPass1 = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('确认密码不能为空'))
      } else if (value !== this.sForm.password) {
        return callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      let reg =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/ // 邮箱格式正则表达式
      if (value === '') {
        return callback(new Error('邮箱不能为空'))
      } else if (!reg.test(value)) {
        return callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    return {
      sForm: {
        username: '',
        password: '',
        checkpass: '',
        email: ''
      },
      rules: {
        name: [{ validator: checkName, trigger: 'blur' }],
        password: [{ validator: checkPass, trigger: 'blur' }], // prop值是“password”，sForm里是“password”，rules里也应为“password”
        checkpass: [{ validator: checkPass1, trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }]
      }
    }
  },
  methods: {
    signin (sForm) {
      this.$refs.sForm.validate((valid) => {
        // this.$refs[sForm].validate会显示validate无定义
        if (valid) {
          axios
            .post('/auth/signinData', {
              username: this.sForm.username,
              password: this.sForm.password,
              email: this.sForm.email
            })
            .then((response) => {
              console.log(response)
              if (response.status === 201) {
                this.$message({
                  // message消息提示
                  message: '恭喜你，注册成功！',
                  type: 'success'
                })
                store.setNewAction() // 注册成功后，修改store中状态，要把is_new更新为true
                router.push('/')
              } else if (response.data === 'Wrong Name') {
                this.$message.error('该用户名已使用！')
              } else if (response.data === 'Wrong Email') {
                this.$message.error('该邮箱已使用！')
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    back () {
      router.push('/').catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/style/style.scss';
.container_50 {
  @include container_in;
  margin-top: 50px;
}
.sForm {
  margin: auto;
  width: 45%;
}
</style>

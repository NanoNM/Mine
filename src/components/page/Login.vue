<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">后台管理系统</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="username">
            <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="password"
            v-model="param.password"
            @keyup.enter.native="submitForm()"
          >
            <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <!-- <el-checkbox v-model="param.isautologin">自动登录</el-checkbox> -->
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()">登录</el-button>
        </div>
        <p class="login-tips">Tips : 管理员系统并不支持记住登陆</p>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      socketo: null,
      url: this.Common.url + "/admin/login",
      param: {
        username: "",
        password: "",
        isautologin: "false",
      },
      rules: {
        username: [
          {
            required: true,
            message: "你咋回事??",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "你咋回事??",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {},
  methods: {
    submitForm() {
      var that = this;
      this.$axios
        .post(this.Common.url + "/admin/login", this.param)
        .then((resp) => {
          if (resp["data"]["code"] == that.Common.ERROR["codes"]["LOGIN_SUCCESS"]) {
            this.$message.success("登陆成功");
            sessionStorage.setItem("user", JSON.stringify(resp["data"]));
            that.Common.socketObj = new WebSocket(
              that.Common.socket_url + "/admin/tcpServer/" + JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"]
            );
            this.$router.push("/Dashboard");
          } else {
            this.$message.error("登录失败: " + resp["data"]["code"]);
          }
        })
        .catch((err) => {
          this.$message.error("登录失败: " + err + " 建议打开控制台查看");
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/img/login-bg.jpg);
  background-size: 100%;
}

.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}

.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}

.ms-content {
  padding: 30px 30px;
}

.login-btn {
  text-align: center;
}

.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}

.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>

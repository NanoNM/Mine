<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">后台管理系统</div>
            <el-form
                    :model="param"
                    :rules="rules"
                    ref="login"
                    label-width="0px"
                    class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                            type="password"
                            placeholder="密码"
                            v-model="param.password"
                            @keyup.enter.native="submitForm()">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <!-- <el-checkbox v-model="param.isautologin">自动登录</el-checkbox> -->
                <div class="login-btn">

                    <el-button type="primary" @click="submitForm()" :disabled="loginDisable">登录</el-button>
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
                loginDisable: false,
                param: {
                    username: "",
                    password: "",
                    isautologin: "false",
                },
                rules: {
                    username: [
                        {
                            required: true,
                            message: "没名字我怎么登录 宝贝??",
                            trigger: "blur",
                        },
                    ],
                    password: [
                        {
                            required: true,
                            message: "没密码我怎么登录 宝贝??",
                            trigger: "blur",
                        },
                    ],
                },
            };
        },

        mounted() {
          // console.log(this.Common.url);
        },
        methods: {
            submitForm() {
                this.loginDisable=true
                let that = this;
                this.$axios({
                    url: this.Common.url + "/errorcode",
                    method: "get",
                    headers: {
                        Accept:
                            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    },
                })
                    .then((respanse) => {
                        this.Common.ERROR = respanse["data"];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
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
                          that.loginDisable=false
                        } else {
                            this.$message.error("登录失败: " + resp["data"]["code"]);
                          that.loginDisable=false
                        }
                    })
                    .catch((err) => {
                        this.$message.error("登录失败: " + err + " 建议打开控制台查看");
                        console.log(err);
                      that.loginDisable=false
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
        /*background-image: url(../../assets/img/login-bg.jpg);*/
        background-color: #72767b;
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
        background: #c8c9cc;
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

<template>
  <div id="app" @click="clicked">
    <router-view></router-view>
  </div>
</template>

<style>
@import "./assets/css/main.css";
@import "./assets/css/color-dark.css";
/*深色主题*/
/*@import "./assets/css/theme-green/color-green.css";*/
/*浅绿色主题*/
</style>

<script>
export default {
  name: "app",
  data() {
    return {
      lTime: new Date().getTime(), // 最后一次点击的时间
      cTime: new Date().getTime(), //当前时间
      // tOut: 60 * 10 * 1000,   //超时时间10min
      tOut: 60 * 10 * 1000 * 3, //60 * 10 * 1000 * 3,
      t1: "",
    };
  },
  mounted() {
    window.onbeforeunload = (e) => {
      e = e || window.event;
      if (e) {
        e.returnValue = "";
      }

      this.loginout(); //调用自己的方法

      // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+

      //return '确认关闭??';
    };
    this.$axios
      .get(this.Common.url + "/autologin?" + "token=" + this.$cookies.get("token"))
      .then((resp) => {
        if (resp["data"] !== "") {
          this.$message.success("登陆成功");
          sessionStorage.setItem("user", JSON.stringify(resp["data"]));
          this.$router.push("/Dashboard");
        } else {
          this.$router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //拉取服务的错误信息
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
    this.t1 = setInterval(this.tTime, 1000);
  },
  methods: {
    toCloseFun() {},
    clicked() {
      this.lTime = new Date().getTime(); //当界面被点击更新点击时间
    },
    tTime() {
      this.cTime = new Date().getTime();
      if (this.cTime - this.lTime > this.tOut) {
        //未登录状态
        if (sessionStorage.getItem("user") === undefined) {
          this.lTime = new Date().getTime();
        } else {
          this.loginout();
          this.$alert("登录超时，请重新登录", "提示", {
            confirmButtonText: "确定",
          });
        }
      }
    },
    // 退出登录点击事件
    loginout() {
      this.$axios
        .get(
          this.Common.url +
            "/userloginout?" +
            "name=" +
            JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"]
        )
        .then((resp) => {
        })
        .catch((err) => {
          console.log(err);
        });
      sessionStorage.removeItem("user");
      this.$cookies.remove("token");
      this.$router.push("/login");
    },
    test(e) {
      alert(e);
    },
  },
};
</script>
>

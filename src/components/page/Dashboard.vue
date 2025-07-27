<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height: 252px">
                  <el-card class="box-card">
                    <div class="user-info-list" style="color: #222222;font-size: 15px">
                      SpringBoot启动时间
                      <span>{{systemData["springBootStartTime"] || "未获取"}}</span>
                    </div>
                    <div class="user-info-list" style="color: #130f0f;font-size: 15px">
                      SpringBoot运行时间
                      <span>{{systemData["springBootRunningTime"] || "未获取"}}</span>
                    </div>
                  </el-card>


<!--                    <div class="user-info">-->
<!--                        <div class="user-info-cont">-->
<!--                            <div class="user-info-name"></div>-->
<!--                        </div>-->
<!--                    </div>-->
                  <el-card class="box-card" style="margin-top: 3%;">
                      <div class="user-info-list" style="color: #222222;font-size: 15px">
                          MCServer启动时间
                          <span >{{systemData["mcServerStartTime"] || "未获取"}}</span>
                      </div>
                      <div class="user-info-list" style="color: #222222;font-size: 15px">
                          MCServer运行时间
                          <span>{{systemData["mcServerRunningTime"] || "未获取"}}</span>
                      </div>
                  </el-card>

<!--                    <div class="user-info">-->
<!--                        <div class="user-info-cont">-->
<!--                            <div class="user-info-name"></div>-->
<!--                        </div>-->
<!--                    </div>-->

                    <div class="user-info-list">

                    </div>
                </el-card>
                <el-card shadow="hover" style="height: 252px">
                    <div slot="header" class="clearfix">
                        <span>硬件信息 (仅供参考)</span>
                    </div>
                    处理器占用: {{ systeminfo["cpuUserInfo"] }}%
                    <el-progress
                            style="margin-top: 1%; margin-bottom: 1%"
                            :text-inside="true"
                            :stroke-width="26"
                            :percentage="Number(systeminfo['cpuUserInfo'])"
                            :color="customColors"
                    ></el-progress>
                    内存占用: {{ systeminfo["memoryUserInfo"] }}%
                    <el-progress
                            style="margin-top: 1%; margin-bottom: 1%"
                            :text-inside="true"
                            :stroke-width="26"
                            :percentage="Number(systeminfo['memoryUserInfo'])"
                            :color="customColors"
                    ></el-progress>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="24">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-cpu grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num" style="font-size: 25px">
                                        {{ systeminfo["system"] }} {{ systeminfo["cpuInfo"] }}
                                    </div>
                                    <div>系统信息</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height: 403px">
                    <div slot="header" class="clearfix">
                      <span>控制台</span>
                      <span>
                        <el-input placeholder="java运行参数" v-model="serverCom" size="medium" style="width: 70%;padding-left: 10%;">
                          <template #prepend>java -jar</template>
                          <template #append >
                            <el-select style=" width: 150px"  v-model="selectjar" :placeholder="selectjar" @change="" @focus="getServerJar()">
                              <el-option
                                  v-for="item in options"
                                  :key="item.value"
                                  :label="item.label"
                                  :value="item.value">
                              </el-option>
                            </el-select>
                          </template>
                        </el-input>
                      </span>
                        <el-link style="float: right; padding: 3px 0" :type="serverStat">状态</el-link>
                    </div>
                    <el-input id="mineconsole" type="textarea" :rows="11" v-model="ServerConsole"></el-input>
                    <el-input
                            style="padding: 20px 0px; width: 50%"
                            v-model="inputcmd"
                            placeholder="输入指令"
                    ></el-input>
                    <el-button style="margin-left: 1%" @click="sendcmd()" type="primary">发送</el-button>
                    <el-button style="margin-left: 1%" @click="startserver()" type="success">开机</el-button>
                    <el-button style="margin-left: 1%" @click="synchronizationConsole()" type="primary">同步数据</el-button>
                    <el-button style="margin-left: 1%" @click="stopserver()" type="danger">关机</el-button>
                    <el-button style="margin-left: 1%" @click="notsafestopserver()" type="danger">强制关机</el-button>
                    <el-button style="margin-left: 1%" @click="clearConsole()" type="danger">清空控制台</el-button>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="24">
            <el-col :span="24">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>快速设置</span>
                        <el-button
                                style="float: right; margin-left: 2%"
                                @click="getpropertis()"
                                type="success">获取文件
                        </el-button>
                        <el-button style="float: right" @click="setpropertis()" type="primary"
                        >提交修改
                        </el-button>
                    </div>

                    <div style="margin: 1%; width: 45%; display: inline-block" v-for="(val, key) in fastSetting" :key="key">
                        <el-input :placeholder="val" v-model="fastSetting[key]">
                            <template slot="prepend">{{ key }}</template>
                        </el-input>
                        <!-- {{key}}: <el-input style="width: 10%;" v-model="fastSetting['key']" :placeholder="val"></el-input>-->
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Schart from "vue-schart";
    import bus from "../common/bus";
    import LoginPage from "./Login";
    import pako from 'pako'

    export default {

        name: "dashboard",
        data() {
            return {
                serverStat: "danger",
                username: "",
                websocket: null,
                ServerConsole: "",
                inputcmd: "",
                adminToken: "",
                systeminfo: {
                    systemInfo: "",
                    cpuInfo: "",
                    cpuUserInfo: "",
                    memoryUserInfo: "",
                },
                serverCom: '',
                sepackage: '',
                systemData: '',
                setInterval: null,
                customColors: [
                    {
                        color: "#5cb87a",
                        percentage: 20,
                    },
                    {
                        color: "#5cb87a",
                        percentage: 40,
                    },
                    {
                        color: "#409eff",
                        percentage: 60,
                    },
                    {
                        color: "#e6a23c",
                        percentage: 80,
                    },
                    {
                        color: "#f56c6c",
                        percentage: 100,
                    },
                ],
                fastSetting: {},
              options: [{
                value: 'server.jar',
                label: 'server.jar'
              }],
              selectjar: 'server.jar'
            };
        },
        components: {},
        computed: {},
        mounted() {
            if (JSON.parse(sessionStorage.getItem("user"))["userModel"] == null){
              sessionStorage.removeItem("user");
              this.$cookies.remove("token");
              this.$router.push("/login");
            }
            if (window.history && window.history.pushState) {
                history.pushState(null, null, document.URL);
                window.addEventListener("popstate", this.goBack, false);
            }
            // this.setInterval = setInterval(this.getServerInfo, 5000);
            let user = sessionStorage.getItem("user");
            this.username = JSON.parse(user)["userModel"]["user_name"];
            this.websocket = this.Common.socketObj;
            this.socket(this.websocket);
        },
        activated() {

            let user = sessionStorage.getItem("user");
            this.username = JSON.parse(user)["userModel"]["user_name"];
            // this.websocket = new WebSocket(this.Common.socket_url + "/admin/tcpServer");
            // this.setInterval = setInterval(this.getServerInfo, 5000);
            // this.socket(this.websocket);
        },
        destroyed() {
            this.socketClose(this.websocket);
            window.removeEventListener("popstate", this.goBack, false);
        },
        deactivated() {
            // this.socketClose(this.websocket);
            clearInterval(this.setInterval);
        },
        methods: {
          getServerJar() {
            let that = this;
            this.$axios
                .get(
                    this.Common.url +
                    "/admin/getjar?" +
                    "name=" +
                    JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                    "&token=" +
                    this.adminToken
                )
                .then((resp) => {
                  let data = resp["data"]
                  // that.options.clear()
                  that.options.length = 0
                  for (let i=0;i<data.length;i++)
                  {
                    let option = {"value":"","label":""};
                    option["value"] = data[i]
                    option["label"] = data[i]

                    that.options.push(option)
                    // that.options[i]["value"] = data[i]
                    console.log(data[i]);
                  }

                })
                .catch((err) => {
                  console.log(err);
                });
          },
            setpropertis() {
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/setsetting?" +
                        "name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.adminToken +
                        "&jsonstr=" +
                        JSON.stringify(this.fastSetting)
                    )
                    .then((resp) => {
                        console.log(resp["data"]);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            getpropertis() {
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/getsetting?" +
                        "name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.adminToken
                    )
                    .then((resp) => {
                        this.fastSetting = resp["data"];
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            goBack() {
                this.loginout();
                alert("自动登出");
                //replace替换原路由，作用是避免回退死循环
            },
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
            getserverStat() {
                if (this.websocket.readyState == WebSocket.OPEN)
                    this.websocket.send(
                        '{"name":"Server","value":"getServerStat","username":"' +
                        this.username +
                        '","token":"' +
                        this.adminToken +
                        '"}'
                    );
            },
            getServerInfo() {
                // that = this
                if (sessionStorage.getItem("user") == null) {
                    return;
                }
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/getServerInfo?" +
                        "name=" +
                        this.username +
                        "&token=" +
                        this.adminToken
                    )
                    .then((resp) => {
                        if (resp["data"] != "") {
                            this.systeminfo["system"] = resp["data"]["systemInfo"];
                            this.systeminfo["cpuInfo"] = resp["data"]["cpuInfo"];
                            this.systeminfo["cpuUserInfo"] = resp["data"]["cpuUserInfo"];
                            this.systeminfo["memoryUserInfo"] = resp["data"]["memoryUserInfo"];

                        } else {
                            console.log("getServerInfoError");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
            synchronizationConsole(){
              this.$axios.get(
                this.Common.url +
                "/admin/synchronizationConsole?name=" +
                JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                "&token=" +
                this.Common.adminToken
                )
                .then((resp) => {
                  // console.log(resp['data'])

                  var strData = atob(resp['data'])
                  // Convert binary string to character-number array
                  var charData = strData.split('').map(function(x) { return x.charCodeAt(0) })
                  // Turn number array into byte-array
                  var binData = new Uint8Array(charData)
                  // unzip
                  var data = pako.inflate(binData)
                  // Convert gunzipped byteArray back to ascii string:
                  strData = String.fromCharCode.apply(null, new Uint16Array(data))
                  this.ServerConsole = strData
                  // console.log(strData)

                })
                .catch((err) => {
                  this.$message.error("失败: " + err + " 建议打开控制台查看");
                  console.log(err);
                });
            },
            startserver() {

              //         let string =
              // console.log(string)
                if (this.websocket.readyState == WebSocket.OPEN)
                    this.websocket.send(
                        '{"name":"cmd","value":"startserver","username":"' +
                        this.username +
                        '","token":"' +
                        this.adminToken +
                        '","startservercmd":" '+
                        this.serverCom +" "+
                        this.selectjar +
                        '"}'
                    );
            },
            clearConsole(){
              this.ServerConsole = '';
            },
            notsafestopserver(){
              if (this.websocket.readyState == WebSocket.OPEN)
                this.websocket.send(
                    '{"name":"cmd","value":"hardstop","username":"' +
                    this.username +
                    '","token":"' +
                    this.adminToken +
                    '"}'
                );
            },
            stopserver() {
                if (this.websocket.readyState == WebSocket.OPEN)
                    this.websocket.send(
                        '{"name":"cmd","value":"stop","username":"' +
                        this.username +
                        '","token":"' +
                        this.adminToken +
                        '"}'
                    );
            },
            sendcmd() {
                if (this.websocket.readyState == WebSocket.OPEN)
                    this.websocket.send(
                        '{"name":"cmd","value":"' +
                        this.inputcmd +
                        '","username":"' +
                        this.username +
                        '","token":"' +
                        this.adminToken +
                        '"}'
                    );
              this.inputcmd = "";
            },
            socketClose(web) {
                web.send("");
                web.close();
            },
            sendname() {
                this.websocket.send(
                    '{"name":"name","value":"' +
                    this.username +
                    '","token":"' +
                    this.adminToken +
                    '"}'
                );
            },
            socket(web) {
                var that = this;
                web.onopen = function () {
                    // that.setInterval = setInterval(that.getserverStat, 5000);
                    // this.$message.success('服务器长连接开启');
                };
                web.onclose = function () {
                    that.websocket.close();
                    // that.setInterval.clearInterval()
                    // this.$message.success('服务器长连接关闭');
                };
                web.onmessage = function (e) {
                    let json = JSON.parse(e.data);


                    if (json["name"] === "Authentication") {
                        that.adminToken = json["object"];
                        that.Common.adminToken = that.adminToken;
                        that.sendname();
                    } else if (json["name"] === "console") {
                        that.$nextTick(() => {
                          setTimeout(() => {
                            const textarea = document.getElementById('mineconsole');
                            textarea.scrollTop = textarea.scrollHeight;
                          }, 13)
                        })
                        if (that.ServerConsole.length>100000){
                          that.ServerConsole = "";
                        }
                        that.ServerConsole += json["object"];
                    } else if (json["name"] === "ServerStat") {
                        if (json["object"] == 1) {
                            // that.getServerInfo();
                            that.serverStat = "success";
                        } else {
                            that.serverStat = "danger";
                        }
                    } else if (json["name"] === "systemInfo") {
                        console.log(json["object"]);

                        that.systeminfo["system"] = json["object"]["systemInfo"];
                        that.systeminfo["cpuInfo"] = json["object"]["cpuInfo"];
                        that.systeminfo["cpuUserInfo"] = json["object"]["cpuUserInfo"];
                        that.systeminfo["memoryUserInfo"] = json["object"]["memoryUserInfo"];
                        that.systemData = json["object"]
                      // that.ServerConsole = json["console"];
                    }
                };
                // document.getElementById("sendBtn").onclick = function(){
                //     var txt = document.getElementById("sendTxt").value;
                //     websocket.send(txt);
                // }
                // document.getElementById("close").onclick = function(){
                //     websocket.close()
                // }
            },
        },
    };
</script>

<style scoped>
    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }
</style>

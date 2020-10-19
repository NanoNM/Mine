<template>
<div>
    <el-row :gutter="20">
        <el-col :span="8">
            <el-card shadow="hover" class="mgb20" style="height:252px;">
                <div class="user-info">
                    <img src="../../assets/img/img.jpg" class="user-avator" alt />
                    <div class="user-info-cont">
                        <div class="user-info-name"></div>
                        <div></div>
                    </div>
                </div>
                <div class="user-info-list">
                    上次登录时间：
                    <span>2019-11-01</span>
                </div>
                <div class="user-info-list">
                    上次登录地点：
                    <span>东莞</span>
                </div>
            </el-card>
            <el-card shadow="hover" style="height:252px;">
                <div slot="header" class="clearfix">
                    <span>语言详情</span>
                </div>Vue
                <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
                <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
                <el-progress :percentage="13.7"></el-progress>HTML
                <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
            </el-card>
        </el-col>
        <el-col :span="16">
            <el-row :gutter="20" class="mgb20">
                <el-col :span="24">
                    <el-card shadow="hover" :body-style="{padding: '0px'}">
                        <div class="grid-content grid-con-1">
                            <i class="el-icon-lx-people grid-con-icon"></i>
                            <div class="grid-cont-right">
                                <div class="grid-num">{{systeminfo}}</div>
                                <div>系统信息</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-card shadow="hover" style="height:403px;">
                <div slot="header" class="clearfix">
                    <span>控制台 当前token: {{adminToken}}</span>
                    <el-link style="float: right; padding: 3px 0" :type="serverStat">状态</el-link>
                </div>
                <el-input type="textarea" :rows="13" v-model="ServerConsole"></el-input>
                <el-input style="padding: 20px 0px; width:60%;" v-model="inputcmd" placeholder="输入指令"></el-input>
                <el-button style="margin-left:1%;" @click="sendcmd()" type="primary">发送</el-button>
                <el-button style="margin-left:1%;" @click="startserver()" type="success">开机</el-button>
                <el-button style="margin-left:1%;" @click="stopserver()" type="danger">关机</el-button>
                <el-button style="margin-left:1%;" type="danger">强制关机</el-button>
                <div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    data() {
        return {
            serverStat: 'danger',
            username: '',
            websocket: null,
            ServerConsole: '',
            inputcmd: '',
            adminToken: '',
            systeminfo: '',
            setInterval: null
        }
    },
    components: {

    },
    computed: {

    },
    mounted() {
        let user = sessionStorage.getItem('user')
        this.username = JSON.parse(user)['userModel']['user_name']
        this.websocket = new WebSocket(this.Common.socket_url + "/admin/tcpServer")
        this.socket(this.websocket)
    },
    activated() {
        let user = sessionStorage.getItem('user')
        this.username = JSON.parse(user)['userModel']['user_name']
        this.websocket = new WebSocket(this.Common.socket_url + "/admin/tcpServer")
        this.socket(this.websocket)
    },
    destroyed() {
        this.socketClose(this.websocket)
    },
    deactivated() {
        this.socketClose(this.websocket)
    },
    methods: {
        getserverStat() {
            console.log(WebSocket.OPEN)
            if (this.websocket.readyState == WebSocket.OPEN)
                this.websocket.send('{"name":"Server","value":"getServerStat","username":"' + this.username + '","token":"' + this.adminToken + '"}')
        },
        getServerInfo() {
            if (this.websocket.readyState == WebSocket.OPEN)
                this.websocket.send('{"name":"Server","value":"getServerInfo","username":"' + this.username + '","token":"' + this.adminToken + '"}')
        },
        startserver() {
            if (this.websocket.readyState == WebSocket.OPEN)
                this.websocket.send('{"name":"cmd","value":"startserver","username":"' + this.username + '","token":"' + this.adminToken + '"}')
        },
        stopserver() {
            if (this.websocket.readyState == WebSocket.OPEN)
                this.websocket.send('{"name":"cmd","value":"stop","username":"' + this.username + '","token":"' + this.adminToken + '"}')
        },
        sendcmd() {
            if (this.websocket.readyState == WebSocket.OPEN)
                this.websocket.send('{"name":"cmd","value":"' + this.inputcmd + '","username":"' + this.username + '","token":"' + this.adminToken + '"}')
        },
        socketClose(web) {
            web.send('');
            web.close()
        },
        socket(web) {
            var that = this
            web.onopen = function () {
                that.setInterval = setInterval(that.getserverStat, 3000);
                // this.$message.success('服务器长连接开启');
            }
            web.onclose = function () {
                that.setInterval.clearInterval()
                // this.$message.success('服务器长连接关闭');
            }
            web.onmessage = function (e) {
                let json = JSON.parse(e.data)
                if (json['Authentication'] != undefined) {
                    that.adminToken = json['Authentication']
                } else if (json['console'] != undefined) {
                    that.ServerConsole = json['console']
                } else if (json['ServerStat'] != undefined) {
                    console.log(json['ServerStat'])
                    if (json['ServerStat'] == 1) {
                        that.serverStat = "success"
                    } else {
                        that.serverStat = "danger"
                    }
                }
            }
            // document.getElementById("sendBtn").onclick = function(){
            //     var txt = document.getElementById("sendTxt").value;
            //     websocket.send(txt);
            // }
            // document.getElementById("close").onclick = function(){
            //     websocket.close()
            // }
        },
    }
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

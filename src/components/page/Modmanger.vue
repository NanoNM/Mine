<template>
    <el-row :gutter="24">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>模组管理器</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="getMod()"
                >取得信息
                </el-button
                >
            </div>
            <el-col :span="16">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>正常</span>
                    </div>
                    <el-table :data="normal" style="width: 100%" max-height="250">
                        <el-table-column label="模组名称" prop="modFilename" :key="Math.random()">
                        </el-table-column>
                        <el-table-column label="当前状态" prop="status" :key="Math.random()">
                        </el-table-column>
                        <el-table-column label="可用操作" prop="" :key="Math.random()">
                            <template slot-scope="scope">
                                <!-- <el-button type="success" icon="el-icon-check" circle></el-button> -->
                                <el-button type="warning" icon="el-icon-remove-outline"
                                           @click="modcmd('disable',scope.row.modFilename)">禁用
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete"
                                           @click="modcmd('remove',scope.row.modFilename)">删除
                                </el-button>
                                <el-button type="info" icon="el-icon-check" @click="getModinfo(scope.row)">更多信息
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>

                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>禁用中</span>
                    </div>
                    <el-table :data="disable" style="width: 100%" max-height="250">
                        <el-table-column label="模组名称" prop="modFilename" :key="Math.random()">
                        </el-table-column>
                        <el-table-column label="当前状态" prop="status" :key="Math.random()">
                        </el-table-column>
                        <el-table-column label="可用操作" prop="desc" :key="Math.random()">
                            <template slot-scope="scope">
                                <!-- <el-button type="success" icon="el-icon-check" circle></el-button> -->
                                <el-button type="success" icon="el-icon-circle-plus-outline"
                                           @click="modcmd('able',scope.row.modFilename)">启用
                                </el-button>
                            </template>

                            <!-- <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle></el-button> -->
                        </el-table-column>
                    </el-table>
                </el-card>

                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>垃圾箱</span>
                        <el-button type="danger" icon="el-icon-delete" style="float: right;" @click="">清空垃圾箱</el-button>
                    </div>
                    <el-table :data="removed" style="width: 100%" max-height="250">
                        <el-table-column label="模组名称" prop="modFilename" :key="Math.random()">
                        </el-table-column>
                        <el-table-column label="当前状态" prop="status" :key="Math.random()">
                        </el-table-column>
                        <el-table-column label="可用操作" prop="desc" :key="Math.random()">
                            <template slot-scope="scope">
                                <!-- <el-button type="success" icon="el-icon-check" circle></el-button> -->
                                <el-button type="success" icon="el-icon-circle-plus-outline"
                                           @click="modcmd('able',scope.row.modFilename)">启用
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete"
                                           @click="modcmd('completelyDelete',scope.row.modFilename)">彻底删除
                                </el-button>
                            </template>
                            <!-- <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle></el-button> -->
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>详细信息</span>
                    </div>
                    <json-viewer
                            :value="moreInfo"
                            :expand-depth=5
                            copyable
                            boxed
                            sort>
                    </json-viewer>
                </el-card>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>上传</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="getUploadUrl">上传到服务器
                        </el-button>
                    </div>
                    <el-upload class="upload-demo"
                               drag
                               :http-request="getUploadUrl"
                               action=""
                               multiple
                               :on-change="onFileChange"
                               :file-list="this.fileList"
                               :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip"></div>
                    </el-upload>
                </el-card>
            </el-col>
        </el-card>
    </el-row>
</template>

<style>
    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>

<script>

    export default {
        data() {
            return {
                fileList: [],
                tableData: [],
                moreInfo: ["点击一个模组获取他的信息"],
                upurl: this.Common.url + '/admin/upfilemods?' + "name=" + JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] + "&token=" + this.Common.adminToken

            };
        },
        mounted() {
        },
        methods: {
            getModinfo(file) {
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/moremodinfo?filename="+ file.modFilename +"&name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        that.Common.adminToken,
                        this.param
                    )
                    .then((resp) => {
                        that.moreInfo = resp["data"];
                    })
                    .catch((err) => {
                        this.$message.error("失败: " + err + " 建议打开控制台查看");
                        console.log(err);
                    });
            },
            onFileChange(prams) {
                console.log(prams)
                this.fileList.push(prams)
                console.log(this.fileList)
            },
            getUploadUrl() {
                let that = this
                if (this.fileList.length > 0) {
                    this.upurl = this.Common.url + '/admin/upfilemods?' + "name=" + JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] + "&token=" + this.Common.adminToken
                    let data = new FormData()
                    data.append("file", this.fileList.pop()['raw'])
                    this.$axios
                        .post(
                            this.upurl,
                            data
                        )
                        .then((resp) => {
                            that.getUploadUrl()
                        })
                        .catch((err) => {
                            this.$message.error("失败: " + err + " 建议打开控制台查看");
                            console.log(err);
                        });
                }
            },
            getMod() {
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/modScanning?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken
                    )
                    .then((resp) => {
                        that.tableData = resp["data"];
                    })
                    .catch((err) => {
                        this.$message.error("失败: " + err + " 建议打开控制台查看");
                        console.log(err);
                    });
            },
            modcmd(cmd, filename) {
              let that = this;
              if (cmd === "completelyDelete"){
                  this.$confirm("你确定要删除这个模组吗?\n‘"+filename+"’将会永远失去！（真的很久！）","提示",{
                    iconClass: "el-icon-question",//自定义图标样式
                    confirmButtonText: "确认",//确认按钮文字更换
                    cancelButtonText: "取消",//取消按钮文字更换
                    showClose: true,//是否显示右上角关闭按钮
                    type: "warning",//提示类型  success/info/warning/error
                  }).then(function(){

                  }).then((data) => {
                    this.$axios.get(
                      this.Common.url +
                      "/admin/modScanning?name=" +
                      JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                      "&token=" +
                      this.Common.adminToken +
                      "&cmd=" +
                      cmd +
                      "&filename=" + encodeURIComponent(filename)
                      )
                        .then((resp) => {
                          this.getMod();
                        })
                        .catch((err) => {
                          this.$message.error("失败: " + err + " 建议打开控制台查看");
                          console.log(err);
                        });
                    }).catch(function (err) {
                      //捕获异常
                    });
                }else{
                  if (cmd !== undefined) {
                    this.$axios.get(
                        this.Common.url +
                        "/admin/modScanning?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&cmd=" +
                        cmd +
                        "&filename=" + encodeURIComponent(filename)
                    )
                    .then((resp) => {
                      this.getMod();
                    })
                    .catch((err) => {
                      this.$message.error("失败: " + err + " 建议打开控制台查看");
                      console.log(err);
                    });
                  }
                }
            }
        },

        computed: {
            normal() {
                return this.tableData.filter((item) => item.status === "normal");
            },
            removed() {
                return this.tableData.filter((item) => item.status === "removed");
            },
            disable() {
                return this.tableData.filter((item) => item.status === "disable");
            },
        },
    };
</script>

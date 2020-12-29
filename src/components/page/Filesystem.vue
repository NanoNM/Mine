<template>
    <el-row :gutter="20">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>文件管理器 仅提供简单功能 复杂操作请在FTP软件上完成</span>
            </div>

            <el-popover
                    placement="top-start"
                    width="400"
                    trigger="click">
                <div>
                    <el-input placeholder="请输入内容" v-model="newFilename"></el-input>
                    <el-button slot="reference" type="text" @click="mkFile()">上 传</el-button>
                </div>
                <el-button slot="reference" type="text">新建文件</el-button>
            </el-popover>
            /
            <el-popover
                    placement="top-start"
                    width="400"
                    trigger="click">
                <div>
                    <el-input placeholder="请输入内容" v-model="newFileFodername"></el-input>
                    <el-button slot="reference" type="text" @click="mkdir()">上 传</el-button>
                </div>
                <el-button slot="reference" type="text">新建文件夹</el-button>

                <el-button v-if="fileCopy['f']!=''" @click="doFileCopy()" slot="reference" type="text">粘贴</el-button>
                <el-button v-if="fileMove['f']!=''" @click="doFileMove()" slot="reference" type="text">粘贴</el-button>
            </el-popover>

            <div>
                <el-button v-for="(item,i) in titleShow" style="padding-top: 2px;font-size: 10px" type="text">
                    <span v-if="item['f'] === '/'" @click="getFileJson()">{{item['f']}}</span>
                    <span v-else @click="getFIleJsonFromTitle(item['f'],item['p'])">{{item['f']}}</span>
                </el-button>
            </div>
            <el-table
                    :data="Files"
                    :default-sort="{prop: 'attr', order: 'descending'}"
                    stripe
                    style="width: 100%"
                    max-height="650">
                <el-table-column
                        sortable
                        label="文件名"
                        width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.attr === 0"
                                   @click="getFIleJsonByName(scope.row.name,scope.row.filePath)">{{scope.row.name}}
                        </el-button>
                        <span v-else>{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        sortable
                        prop="size"
                        label="大小"
                        width="120">
                </el-table-column>
                <el-table-column
                        sortable
                        prop="md5"
                        label="MD5值"
                        width="120">
                </el-table-column>
                <el-table-column
                        prop="attr"
                        sortable
                        label="类型"
                        width="90">
                    <template slot-scope="scope">
                        <span v-if="scope.row.attr === 0">文件夹</span>
                        <span v-else>文件</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="type"
                        sortable
                        label="文件类型"
                        width="100">
                </el-table-column>
                <el-table-column
                        sortable
                        label="操作">
                    <template slot-scope="scope">
                        <span v-if="scope.row.attr === 1">
                            <el-button type="text"
                                       @click="fileRename(scope.row.filePath, scope.row.name)">重命名</el-button>
                            <el-button type="text" @click="fileEdit(scope.row.filePath)">编 辑</el-button>
                            <el-button type="text" @click="fileDownLoad(scope.row.filePath)">下 载</el-button>
                            <el-button type="text"
                                       @click="fileCopyFun(scope.row.filePath, scope.row.name)">复 制</el-button>
                            <el-button type="text"
                                       @click="fileMoveFun(scope.row.filePath, scope.row.name)">移 动</el-button>
                            <el-button type="text" @click="fileDelete(scope.row.filePath)">删 除</el-button>
                        </span>
                        <span v-else>
<!--                            <el-button type="text" @click="">重命名</el-button>-->
<!--                            <el-button type="text" @click="">下 载</el-button>-->
<!--                            <el-button type="text" @click="">复 制</el-button>-->
<!--                            <el-button type="text" @click="">移 动</el-button>-->
<!--                            <el-button type="text" @click="">删 除</el-button>-->
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="修改名称" :visible.sync="dialogFormVisible">
                <el-input v-model="reNameFile['rename']">
                    <template slot="prepend">名称:</template>
                </el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="disVisible">取 消</el-button>
                    <el-button type="primary" @click="doFileRename()">重命名</el-button>
                </div>
            </el-dialog>
        </el-card>
        <section class="main">
            <el-dialog v-dialogDrag title="编辑文件" center :visible.sync="dialogDragVisible" width="80%">
                <p>你要编辑的文件地址 {{this.editFilePath}}</p>
                <el-input
                        type="textarea"
                        :rows="20"
                        placeholder="请输入内容"
                        v-model="content">
                </el-input>
                <span slot="footer" class="dialog-footer">
                <el-button @click="dialogDragVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit()">提 交</el-button>
            </span>
            </el-dialog>
        </section>
    </el-row>

</template>

<script>
    export default {
        name: "Filesystem.vue",
        data() {
            return {
                fileCopy: {"f": "", "name": ""},
                fileMove: {"f": "", "name": ""},
                newFileFodername: '',
                newFilename: '',
                dialogDragVisible: false,
                visible: false,
                titleShow: [{"f": "/", "p": ""}],
                Files: [],
                reNameFile: {
                    "name": "",
                    "rename": ""
                },
                dialogFormVisible: false,
                content: '',
                editFilePath: '',
            }
        },
        mounted() {

        },
        activated() {
            this.getFileJson();
        },
        methods: {
            fileMoveFun(filePath, name) {
                this.fileMove["f"] = filePath;
                this.fileMove["name"] = name;
                this.fileCopy = {"f": "", "name": ""}
            },
            doFileMove() {
                let dest = this.titleShow[this.titleShow.length - 1]["p"]
                if (dest == "") {
                    dest = this.fileMove["name"]
                } else {
                    dest = dest + "/" + this.fileMove["name"]
                }
                let that = this;
                this.$axios
                    .get(this.Common.url +
                        "/admin/filemove" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&source=" + this.fileMove["f"] +
                        "&dest=" + dest,

                        {
                            headers: {},
                        },
                    )
                    .then((resp) => {
                        if (resp["data"] == that.Common.ERROR["codes"]["FILE_MOVE_SUCCESS"]) {
                            let tempJson = that.titleShow.pop()
                            if (tempJson.p === '') {
                                that.getFileJson()
                            } else {
                                that.getFIleJsonByName(tempJson.f, tempJson.p)
                            }
                        } else {
                            this.$message.error("失败")
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                this.fileMove = {"f": "", "name": ""}
            },
            fileCopyFun(filePath, name) {
                this.fileCopy["f"] = filePath;
                this.fileCopy["name"] = name;
                this.fileMove = {"f": "", "name": ""}
            },
            doFileCopy() {
                let dest = this.titleShow[this.titleShow.length - 1]["p"]
                if (dest == "") {
                    dest = this.fileCopy["name"]
                } else {
                    dest = dest + "/" + this.fileCopy["name"]
                }
                let that = this;
                this.$axios
                    .get(this.Common.url +
                        "/admin/filecopy" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&source=" + this.fileCopy["f"] +
                        "&dest=" + dest,

                        {
                            headers: {},
                        },
                    )
                    .then((resp) => {
                        if (resp["data"] == that.Common.ERROR["codes"]["FILE_COPY_SUCCESS"]) {
                            let tempJson = that.titleShow.pop()
                            if (tempJson.p === '') {
                                that.getFileJson()
                            } else {
                                that.getFIleJsonByName(tempJson.f, tempJson.p)
                            }
                        } else {
                            this.$message.error("失败")
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
                this.fileCopy = {"f": "", "name": ""}
            },
            mkdir() {
                let filePath;
                if (this.titleShow[this.titleShow.length - 1]["p"] === "") {
                    filePath = this.newFileFodername
                } else {
                    filePath = this.titleShow[this.titleShow.length - 1]["p"]
                    filePath = filePath + "/" + this.newFileFodername
                }
                let that = this;
                this.$axios.get(this.Common.url +
                    "/admin/mkdir" + "?name=" +
                    JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                    "&token=" +
                    this.Common.adminToken +
                    "&path=" + filePath,
                    {
                        headers: {},
                    },
                )
                    .then((resp) => {
                        if (resp["data"] == that.Common.ERROR["codes"]["FOLDER_CREATED_SUCCESSFULLY"]) {
                            let tempJson = that.titleShow.pop()
                            if (tempJson.p === '') {
                                that.getFileJson()
                            } else {
                                that.getFIleJsonByName(tempJson.f, tempJson.p)
                            }
                        } else {
                            this.$message.error("失败")
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            mkFile() {
                let filePath;
                if (this.titleShow[this.titleShow.length - 1]["p"] === "") {
                    filePath = this.newFilename
                } else {
                    filePath = this.titleShow[this.titleShow.length - 1]["p"]
                    filePath = filePath + "/" + this.newFilename
                }
                let that = this;
                this.$axios
                    .get(this.Common.url +
                        "/admin/makefile" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&path=" + filePath,
                        {
                            headers: {},
                        },
                    )
                    .then((resp) => {
                        if (resp["data"] == that.Common.ERROR["codes"]["FILE_CREATED_SUCCESSFULLY"]) {
                            let tempJson = that.titleShow.pop()
                            if (tempJson.p === '') {
                                that.getFileJson()
                            } else {
                                that.getFIleJsonByName(tempJson.f, tempJson.p)
                            }
                        } else {
                            this.$message.error("失败")
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            fileDelete(path) {
                let that = this;
                this.$axios
                    .get(this.Common.url +
                        "/admin/filedelete" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&path=" + path,
                        {
                            headers: {},
                        },
                    )
                    .then((resp) => {
                        if (resp["data"]["code"] === that.Common.ERROR["codes"]["FILE_REMOVE_SUCCESS"]) {
                            let tempJson = that.titleShow.pop()
                            console.log(tempJson)
                            if (tempJson.p === '') {
                                that.getFileJson()
                            } else {
                                that.getFIleJsonByName(tempJson.f, tempJson.p)
                            }
                        } else {
                            this.$message.error("失败")
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            fileEdit(path) {
                this.editFilePath = path
                let that = this;
                this.$axios
                    .get(this.Common.url +
                        "/admin/download" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&path=" + path,
                        {
                            headers: {},
                            responseType: 'text'//服务器返回的数据类型
                        },
                    )
                    .then((resp) => {
                        // let str = that.iconv.decode(resp.data, "GBK")
                        if (typeof (resp.data) == 'string') {
                            this.content = resp.data
                        } else {
                            this.content = JSON.stringify(resp.data)
                        }
                        this.dialogDragVisible = true
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            HTMLEncode(html) {
                let temp = document.createElement("div");
                (temp.textContent != null) ? (temp.textContent = html) : (temp.innerText = html);
                let output = temp.innerHTML;
                temp = null;
                return output;
            },
            onEditorChange({editor, html, text}) {
                this.content = html;
            },
            submit() {
                let formdata = new FormData()
                let that = this
                formdata.append('string', this.content)
                this.$axios
                    .post(this.Common.url +
                        "/admin/fileeditor" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&path=" + this.editFilePath,
                        formdata, {})
                    .then((resp) => {
                        if (resp["data"]["code"] === that.Common.ERROR["codes"]["FILE_EDIT_SUCCES"]) {

                        }
                        let tempJson = that.titleShow.pop()
                        console.log(tempJson)
                        if (tempJson.p === '') {
                            that.getFileJson()
                        } else {
                            that.getFIleJsonByName(tempJson.f, tempJson.p)
                        }
                        this.$message.success('成功');
                    })
                    .catch((err) => {
                        console.error(err);
                        this.$message.error('错误' + err);
                    });
                this.dialogDragVisible = false
            },
            disVisible() {
                this.dialogFormVisible = false
            },
            fileRename(name, filename) {
                this.dialogFormVisible = true
                this.reNameFile['name'] = name
            },
            fileDownLoad: function (path) {
                let that = this;
                this.$axios
                    .get(this.Common.url +
                        "/admin/download" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&path=" + path
                        ,
                        {
                            responseType: 'blob'//服务器返回的数据类型
                        })
                    .then((resp) => {
                        let filename = window.decodeURI(resp.headers['content-disposition'].split('=')[1], "UTF-8")
                        let blob = new Blob([resp.data], {type: "application/octet-stream"});
                        if (window.navigator.msSaveOrOpenBlob) {//msSaveOrOpenBlob方法返回bool值
                            navigator.msSaveBlob(blob, filename);//本地保存
                        } else {
                            let link = document.createElement('a');//a标签下载
                            link.href = window.URL.createObjectURL(blob);
                            link.download = filename;
                            link.click();
                            window.URL.revokeObjectURL(link.href);
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            doFileRename() {
                let reNameFileurl
                if (this.reNameFile['name'].lastIndexOf("/") !== -1) {
                    reNameFileurl = this.Common.url +
                        "/admin/renameFile" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&path=" + this.reNameFile['name'] +
                        "&rename=" + this.reNameFile['name'].substr(0, this.reNameFile['name'].lastIndexOf("/") + 1) + this.reNameFile['rename']
                } else {
                    reNameFileurl = this.Common.url +
                        "/admin/renameFile" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&path=" + this.reNameFile['name'] +
                        "&rename=" + this.reNameFile['rename']
                }
                // if ()
                let that = this;
                this.$axios
                    .get(reNameFileurl)
                    .then((resp) => {
                        that.dialogFormVisible = false
                        that.reNameFile = []
                        let tempJson = that.titleShow.pop()
                        if (tempJson.p === '') {
                            that.getFileJson()
                        } else {
                            that.getFIleJsonByName(tempJson.f, tempJson.p)
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            getFileJson() {
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/file" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        that.Common.adminToken
                    )
                    .then((resp) => {
                        that.Files = resp["data"];
                        that.titleShow = [{"f": "/", "p": ""}]
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            getFIleJsonByName(name, file) {
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/file" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        that.Common.adminToken +
                        "&path=" + file
                    )
                    .then((resp) => {
                        that.Files = resp["data"];
                        var json = {
                            "f": name,
                            "p": file
                        }
                        that.titleShow.push(json)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            getFIleJsonFromTitle(name, file) {
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/file" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        that.Common.adminToken +
                        "&path=" + file
                    )
                    .then((resp) => {
                        that.Files = resp["data"];
                        var json = {
                            "f": name,
                            "p": file
                        }
                        if (that.titleShow.pop().f !== json["f"]) {
                            while (true) {
                                var b = that.titleShow.pop().f === json["f"]
                                if (b) {
                                    break
                                }
                            }
                        }
                        that.titleShow.push(json)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }
    }
</script>

<style scoped>

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>
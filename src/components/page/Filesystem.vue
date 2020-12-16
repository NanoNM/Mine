<template>
    <el-row :gutter="20">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>文件管理器</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
            </div>
            <div>
                <el-button v-for="(item,i) in titleShow" style="padding-top: 2px;font-size: 10px" type="text">
                    <span v-if="item['f'] === '/'" @click="getFileJson()">{{item['f']}}</span>
                    <span v-else @click="getFIleJsonFromTitle(item['f'],item['p'])">{{item['f']}}</span>
                </el-button>
            </div>
            <el-table
                    :data="Files"
                    :default-sort = "{prop: 'date', order: 'descending'}"
                    stripe
                    style="width: 100%"
                    max-height="650">
                <el-table-column
                        sortable
                        label="文件名"
                        width="150">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.attr === 0" @click="getFIleJson(scope.row.name,scope.row.filePath)">{{scope.row.name}}</el-button>
                        <span v-else >{{scope.row.name}}</span>
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
                        label="类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.attr === 0">文件夹</span>
                        <span v-else >文件</span>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
    </el-row>
</template>

<script>
    export default {
        name: "Filesystem.vue",
        data(){
            return{
                titleShow :[{"f":"/","p":""}],
                Files:[]
            }
        },
        mounted() {

        },
        activated() {
            this.getFileJson();
        },
        methods: {
            getFileJson(){
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/file" +"?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        that.Common.adminToken
                    )
                    .then((resp) => {
                        that.Files = resp["data"];
                        that.titleShow = [{"f":"/","p":""}]
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            getFIleJson(name, file){
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/file" +"?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        that.Common.adminToken +
                        "&path=" + file
                    )
                    .then((resp) => {
                        that.Files = resp["data"];
                        var json = {
                            "f":name,
                            "p":file
                        }
                        that.titleShow.push(json)
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            getFIleJsonFromTitle(name, file){
                var that = this;
                this.$axios
                    .get(
                        this.Common.url +
                        "/admin/file" +"?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        that.Common.adminToken +
                        "&path=" + file
                    )
                    .then((resp) => {
                        that.Files = resp["data"];
                        var json = {
                            "f":name,
                            "p":file
                        }
                        if (that.titleShow.pop().f !== json["f"]) {
                            while (true) {
                                var b = that.titleShow.pop().f === json["f"]
                                if (b){
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
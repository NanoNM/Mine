<template>
  <el-card class="box-card">
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>
            <i class="el-icon-lx-cascades"></i> 成员管理(用户)
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container" >
        <div class="handle-box">
          <el-input v-model="regName" style="width: 150px" placeholder="用户名" class="handle-input mr10"></el-input>
          <el-input v-model="regPasswd" style="width: 150px" type="passworld" placeholder="密码" class="handle-input mr10"></el-input>
          <el-input v-model="regEmail" style="width: 150px" placeholder="邮箱" class="handle-input mr10"></el-input>
          <el-button type="primary" @click="regUser()">注册</el-button>
        </div>

        <div class="handle-box">
          <el-input v-model="suchUserName" style="width: 150px" placeholder="指定名字搜索" class="handle-input mr10"></el-input>
          <el-button type="primary" @click="suchUser()">搜索</el-button>
        </div>


        <el-table
            :data="tableData"
            border
            class="table"
            ref="multipleTable"
            header-cell-class-name="table-header"
            @selection-change="handleSelectionChange"
        >
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="user_name" label="用户名"></el-table-column>
          <el-table-column prop="create_time" label="注册时间"></el-table-column>
          <el-table-column prop="modify_time" label="修改时间"></el-table-column>
          <el-table-column prop="create_by" label="创建者"></el-table-column>

          <el-table-column prop="authority" label="状态">
            <template scope="scope">
              <p style="color: #67C23A" v-if="scope.row.authority=='user'">正常 <el-button type="text">封禁</el-button></p>
              <p style="color: #F56C6C" v-if="scope.row.authority=='ban'">封禁 <el-button type="text">解除</el-button></p>
            </template>
          </el-table-column>

          <el-table-column prop="authme_id" label="是否与Authme关联"></el-table-column>

          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                  type="text"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.$index, scope.row)"
              >修改密码</el-button>
              <el-button
                  type="text"
                  icon="el-icon-delete"
                  class="red"
                  @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-button @click="previousPage()">上一页</el-button>
          <el-button @click="nextPage()">下一页</el-button>

        </div>
      </div>

      <!-- 编辑弹出框 -->
      <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
        <el-input placeholder="输入密码" v-model="password">
          <template slot="prepend">密码</template>
        </el-input>
        <el-input placeholder="重复密码" @input="verifyPasswordFUN()" v-model="verifyPassword">
          <template slot="prepend">重复密码</template>
        </el-input>
        <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
    export default {
        name: 'basetable',
        data() {
            return {
              suchUserName:'',
              regName:'',
              regPasswd:'',
              regEmail:'',
              pageIndex: 1,
              tableData: [],
              multipleSelection: [],
              delList: [],
              editVisible: false,
              pageTotal: 0,
              form: {},
              idx: -1,
              id: -1,
              password:'',
              verifyPassword:'',
              verifyP: false,
            };
        },
        created() {
            this.getData();
        },
        methods: {
            verifyPasswordFUN(){
                this.verifyP = this.password == this.verifyPassword;
            },
            previousPage(){
                if (this.pageIndex!=1){
                    this.pageIndex-=1
                    this.getAllAdmin(this.pageIndex)
                }else{
                    this.$message.success("没有上一页啦!")
                }
            },
            nextPage(){
                this.pageIndex+=1
                this.getAllAdmin(this.pageIndex)
            },
            suchUser(){
              let that = this;
              if (this.suchUserName==""){
                this.getData();
              }
              this.$axios
                  .get(this.Common.url +
                      "/admin/suchuserbyname" + "?name=" +
                      JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                      "&token=" +
                      this.Common.adminToken +
                      "&suchname=" + this.suchUserName,
                  )
                  .then((resp) => {
                    console.log(resp["data"])

                    this.tableData = resp["data"]
                  })
                  .catch((err) => {
                    console.error(err);
                  });
            },
            regUser(){
                let that = this;
                this.$axios
                    .post(this.Common.url +
                        "/admin/registeruser" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken +
                        "&regname=" + this.regName +
                        "&passwd=" + this.regPasswd +
                        "&email=" + this.regEmail
                    )
                    .then((resp) => {
                        that.getData();
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            // 获取 easy-mock 的模拟数据
            getData() {
                this.getAllAdmin(1)
            },
            getAllAdmin(page){
                let that = this;
                this.$axios
                    .get(this.Common.url +
                        "/admin/getalluser" + "?name=" +
                        JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                        "&token=" +
                        this.Common.adminToken+
                        "&page=" +
                        page,
                        {
                            headers: {},
                        },
                    )
                    .then((resp) => {
                        this.tableData = resp["data"]
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
            // 触发搜索按钮
            handleSearch() {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                let that = this
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        if (row["user_name"] == JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"]){
                            this.$message.error('你不能删除你自己');
                        }else{
                            this.$axios
                                .get(this.Common.url +
                                    "/admin/deleteAdministrator" + "?name=" +
                                    JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                                    "&token=" +
                                    this.Common.adminToken+
                                    "&username=" +
                                    row["user_name"],
                                    {
                                        headers: {},
                                    },
                                )
                                .then((resp) => {
                                    console.log(resp["data"])
                                    that.getAllAdmin(this.pageIndex)
                                    // this.tableData = resp["data"]
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        }
                    })
                    .catch(() => {});
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                if (this.verifyP){
                    this.editVisible = false;
                    let that = this;
                    this.$axios
                        .post(this.Common.url +
                            "/admin/modifypassword" + "?name=" +
                            JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
                            "&token=" +
                            this.Common.adminToken+
                            "&username=" + this.form["user_name"]+
                            "&newps=" + this.verifyPassword,
                            {
                                headers: {},
                            },
                        )
                        .then((resp) => {
                            if (JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] == that.form["user_name"]){
                                this.$message.error("您的密码已变更请重新登录")
                                this.$router.push("/");
                                that.Common.socketObj.close()
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                }else{
                    this.$message.error(`两次密码不匹配`);
                }

                // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                // this.$set(this.tableData, this.idx, this.form);
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageIndex', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>

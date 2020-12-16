<template>
  <el-row :gutter="24">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>插件管理器</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="getMod()"
          >取得信息</el-button
        >
      </div>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>正常</span>
          </div>
          <el-table :data="normal" style="width: 100%" max-height="250">
            <el-table-column label="模组名称" prop="plguinFilename" :key="Math.random()">
            </el-table-column>
            <el-table-column label="当前状态" prop="status" :key="Math.random()">
            </el-table-column>
            <el-table-column label="可用操作" prop="" :key="Math.random()">
              <template slot-scope="scope">
                <!-- <el-button type="success" icon="el-icon-check" circle></el-button> -->
                <el-button type="warning" icon="el-icon-remove-outline" @click="modcmd('disable',scope.row.plguinFilename)">禁用</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="modcmd('remove',scope.row.plguinFilename)">删除</el-button>
                <el-button type="info" icon="el-icon-check" @click="getModinfo(scope.row)">更多信息</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>禁用中</span>
          </div>
          <el-table :data="disable" style="width: 100%" max-height="250">
              <el-table-column label="模组名称" prop="plguinFilename" :key="Math.random()">
              </el-table-column>
              <el-table-column label="当前状态" prop="status" :key="Math.random()">
              </el-table-column>
              <el-table-column label="可用操作" prop="desc" :key="Math.random()">
                <template slot-scope="scope">
                <!-- <el-button type="success" icon="el-icon-check" circle></el-button> -->
                  <el-button type="success" icon="el-icon-circle-plus-outline" @click="modcmd('able',scope.row.plguinFilename)">启用</el-button>
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
                  <el-button type="success" icon="el-icon-circle-plus-outline" @click="modcmd('able',scope.row.plguinFilename)">启用</el-button>
                <!-- <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                <el-button type="danger" icon="el-icon-delete" circle></el-button> -->
                </template>
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
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>上传</span>
          </div>
          <el-upload class="upload-demo" drag :action="this.updateURL" multiple>
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
      tableData: [],
      moreInfo: ["点击一个插件获取他的信息"],
      updateURL : this.Common.url + '/admin/upfileplugins?' + "name=" +JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +"&token=" + this.Common.adminToken
    };
  },
  mounted() {},
  methods: {
    getModinfo(file) {
      var that = this;
      this.$axios
        .get(
          this.Common.url +
            "/admin/moreplugininfo?filename="+ file.plguinFilename +"&name=" +
            JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
            "&token=" +
            that.Common.adminToken,
          this.param
        )
        .then((resp) => {
          that.moreInfo = resp["data"];
        })
        .catch((err) => {
          this.$message.error("登录失败: " + err + " 建议打开控制台查看");
          console.log(err);
        });
    },
    getMod() {
      var that = this;
      this.$axios
      .get(
      this.Common.url +
      "/admin/pluginScanning?name=" +
      JSON.parse(sessionStorage.getItem("user"))["userModel"]["user_name"] +
      "&token=" +
      this.Common.adminToken
      )
      .then((resp) => {
        that.tableData = resp["data"];
      })
      .catch((err) => {
        this.$message.error("登录失败: " + err + " 建议打开控制台查看");
        console.log(err);
      }); 
    },
    modcmd(cmd, filename){
      console.log(cmd)
      var that = this;
      if (cmd != undefined) {
        this.$axios
        .get(
        this.Common.url +
        "/admin/pluginScanning?name=" +
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
          this.$message.error("登录失败: " + err + " 建议打开控制台查看");
          console.log(err);
        });
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

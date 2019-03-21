<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addFormVisible = true">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="name" label="会员名称" width="120" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="电话" width="100" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="100" sortable>
			</el-table-column>
			<el-table-column prop="count" label="积分" width="100" sortable>
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" sortable>
        <template slot-scope="scope">
					<span>{{scope.row.sex==0?'女':'男'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="time" label="注册时间" width="120" sortable>
        <template slot-scope="scope">
          <span>{{new Date(parseInt(scope.row.time)).toLocaleString().replace(/:\d{1,2}$/,' ')}}</span>
        </template>
			</el-table-column>
			<el-table-column prop="dec" label="备注" min-width="100" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="会员名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="editForm.phone"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="editForm.email"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- <el-form-item label="注册时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.time"></el-date-picker>
				</el-form-item> -->
				<el-form-item label="备注">
					<el-input type="textarea" v-model="editForm.dec"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="会员名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone">
					<el-input v-model="addForm.phone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱">
					<el-input v-model="addForm.email"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<!-- <el-form-item label="注册时间">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.time"></el-date-picker>
				</el-form-item> -->
				<el-form-item label="备注">
					<el-input type="textarea" v-model="addForm.dec"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from "../../common/js/util";
import Mock from "mockjs"; //delete
import {
  getUserListPage,
  removeUser,
  batchRemoveUser,
  editUser,
  addUser,
  httpGet,
  httpPost
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      users: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [], //列表选中列

      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        id: 0,
        name: "",
        phone: 0,
        sex: 0,
        email: "",
        time: "",
        dec: ""
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        name: "",
        phone: "",
        sex: 1,
        email: "",
        time: "",
        dec: ""
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers();
    },
    //获取用户列表
    getUsers() {
      let param = {
        pno: this.page // 当前页码 不传的话默认1
        // field, // 排序字段 有 'rgt'和'count'(注册时间，积分) 两种选择 不传默认为'rgt'
        // sort // 排序方式 1或-1 默认为-1(降序)
      };
      httpGet("/vip/getviplist", param)
        .then(res => {
          this.listLoading = false;
          console.log("res get", res);
          this.total = res.data.pCount;
          this.listLoading = false;
          this.users = [];
          for (let i = 0; i < res.data.items.length; i++) {
            this.users.push({
              id: i,
              phone: res.data.items[i].phone ? res.data.items[i].phone : "null",
              name: res.data.items[i].name ? res.data.items[i].name : "null",
              email: res.data.items[i].email ? res.data.items[i].email : "null",
              dec: res.data.items[i].dec ? res.data.items[i].dec : "null",
              time: res.data.items[i].rgt ? res.data.items[i].rgt : "null",
              sex: res.data.items[i].gender,
              count: res.data.items[i].count
            });
          }
        })
        .catch(() => {
          this.listLoading = false;
          console.log(err);
        });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;

          let para = { id: row.id };
          removeUser(para).then(res => {
            this.listLoading = false;

            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    },
    //显示编辑界面
    handleEdit: function(index, row) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
      // console.log(this.editForm)
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;

            let para = Object.assign({}, this.editForm);
            para.time =
              !para.time || para.time == ""
                ? ""
                : util.formatDate.format(new Date(para.time), "yyyy-MM-dd");
            editUser(para).then(res => {
              this.editLoading = false;

              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.editFormVisible = false;
              this.getUsers();
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          console.log(this.addForm);
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;

            // let para = Object.assign({}, this.addForm);
            // para.time =
            //   !para.time || para.time == ""
            //     ? ""
            //     : util.formatDate.format(new Date(para.time), "yyyy-MM-dd");
            // addUser(para).then(res => {
            //   this.addLoading = false;
            //
            //   this.$message({
            //     message: "提交成功",
            //     type: "success"
            //   });
            //   this.$refs["addForm"].resetFields();
            //   this.addFormVisible = false;
            //   this.getUsers();
            // });
            httpPost("/vip/addvip", this.addForm)
              .then(res => {
                this.addFormVisible = false;
                this.addLoading = false;
                console.log(33, res);
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                // this.$refs["addForm"].resetFields();
                this.getUsers();
              })
              .catch(err => {
                this.addLoading = false;
                this.addFormVisible = false;
                console.log(err);
              });
          });
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;

          let para = { ids: ids };
          batchRemoveUser(para).then(res => {
            this.listLoading = false;

            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUsers();
          });
        })
        .catch(() => {});
    }
  },
  created() {
    this.getUsers();
  }
};
</script>

<style scoped>
</style>
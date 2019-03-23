<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="id" width="10">
			</el-table-column>
			<el-table-column type="index" min-width="60">
			</el-table-column>
			<el-table-column prop="user" label="客户名字" min-width="100">
			</el-table-column>
			<el-table-column prop="phone" label="客户电话" min-width="100">
			</el-table-column>
			<el-table-column prop="ordernum" label="订单单号" min-width="100">
			</el-table-column>
			<el-table-column prop="price" label="价格" min-width="80">
			</el-table-column>
			<el-table-column prop="color" label="颜色" min-width="100">
			</el-table-column>
			<el-table-column prop="mark" label="备注" min-width="80">
			</el-table-column>
			<el-table-column prop="acceptStore" label="受理店铺" min-width="100">
			</el-table-column>
			<el-table-column prop="accept" label="受理人" min-width="80">
			</el-table-column>
			<el-table-column prop="accepttime" label="下单时间" min-width="100">
        <template slot-scope="scope">
          <span>{{new Date(parseInt(scope.row.accepttime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}</span>
        </template>
			</el-table-column>
			<el-table-column prop="complete" label="是否完成" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.complete==0?'未完成':'已完成'}}</span>
        </template>
			</el-table-column>
			<el-table-column prop="cpltime" label="完成时间" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.cpltime==0?'未完成':new Date(parseInt(scope.row.cpltime)).toLocaleString().replace(/:\d{1,2}$/,' ')}}</span>
        </template>
			</el-table-column>
			<el-table-column prop="cpler" label="负责人" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.cpler==0?'':scope.row.cpler}}</span>
        </template>
			</el-table-column>
			<el-table-column label="操作" min-width="150">
				<template slot-scope="scope">
					<el-button v-if="scope.row.complete==0" type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">完成</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="12" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<!-- <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="员工名称" prop="name">
					<el-input v-model="editForm.newName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="电话">
					<el-input v-model="editForm.newPhone"></el-input>
				</el-form-item>
				<el-form-item label="工资">
					<el-input v-model="editForm.salary"></el-input>
				</el-form-item>
				<el-form-item label="性别">
          <el-radio-group v-model="editForm.gender">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="2">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="身份">
          <el-radio-group v-model="editForm.ident">
						<el-radio class="radio" :label="'manager'">店长</el-radio>
						<el-radio class="radio" :label="'staff'">普通员工</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog> -->

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-form-item label="电话" prop="vipPhone">
					<el-input v-model="addForm.vipPhone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="颜色" prop="color">
					<el-input v-model="addForm.color" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类别" prop='typeId'>
          <el-select v-model="addForm.typeId" placeholder="请选择">
            <el-option
              v-for="(item,index) in allPrice"
              :key="index"
              :label="item.title"
              :value="item.typeId">
            </el-option>
          </el-select>
				</el-form-item>
				<el-form-item label="备注" prop="mark">
					<el-input v-model="addForm.mark" auto-complete="off"></el-input>
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
      sort:'accepttime',//排序字段 默认为'accepttime',可选'acceptStore','price','complete','cpltime'
      listLoading: false,
      sels: [], //列表选中列

      editLoading: false,
      //编辑界面数据
      editForm: {
        id: 0
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        mark: [{ required: true, message: "请输入备注", trigger: "blur" }],
        vipPhone: [
          {
            required: true,
            pattern: /^1\d{10}$/,
            message: "手机号格式不正确",
            trigger: "blur"
          }
        ],
        color: [{ required: true, message: "请输入颜色", trigger: "blur" }],
        typeId: [{ required: true, message: "请选择类型", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        mark: "",
        vipPhone: "",
        color: "",
        typeId: ""
      },
      canaddstaff: false,
      allPrice: []
    };
  },
  methods: {
    //性别显示转换
    formatSex: function(row, column) {
      return row.sex == 1 ? "男" : row.sex == 0 ? "女" : "未知";
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getUsers(this.page,this.sort);
    },
    //获取用户列表
    getUsers(page,sort) {
      let param = {
        pno: page ,// 当前页码 不传的话默认1
        sort: sort
      };
      httpGet("/orderform/getform", param)
        .then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            console.log("order list", res);
            this.total = res.data.formCount;
            this.users = [];
            for (let i = 0; i < res.data.items.length; i++) {
              this.users.push({
                accept:res.data.items[i].accept,
                acceptStore:res.data.items[i].acceptStore,
                accepttime:res.data.items[i].accepttime,
                color:res.data.items[i].color,
                complete:res.data.items[i].complete,
                cpler:res.data.items[i].cpler,
                cpltime:res.data.items[i].cpltime,
                del:res.data.items[i].del,
                mark:res.data.items[i].mark,
                ordernum:res.data.items[i].ordernum,
                phone:res.data.items[i].phone,
                price:res.data.items[i].price,
                user:res.data.items[i].user,
                _id:res.data.items[i]._id,
              });
            }
            console.log(this.users);
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
        });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(res => {
          this.listLoading = true;
          let para = { id: row.id };
          httpPost("/staff/delstaff", para).then(res => {
            console.log("del", res);
            this.listLoading = false;
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.getUsers(this.page,this.sort);
            } else {
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          });
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
        });
    },
    //显示新增界面
    handleAdd: function() {
      httpGet("/cloth/getpricelist", { all: true })
        .then(res => {
          console.log("all price", res,res.data.items.length);
          this.addLoading = false;
          if (res.code == 200) {
            if(res.data.items.length>0){
                this.addFormVisible = true;
                this.allPrice = [];
                for (let i = 0; i < res.data.items.length; i++) {
                  this.allPrice.push({
                    title: res.data.items[i].title,
                    typeId: res.data.items[i]._id.toString()
                  });
                }
                console.log(this.allPrice);
            }else{
              this.$message({
              message: '请先添加价格参考表',
              type: "warning"
            });
            }
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.addLoading = false;
          console.log(err);
        });
    },
    //编辑
    handleEdit(index, row) {
      this.editForm ={id:row._id};
      console.log('id',this.editForm)
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.editLoading = true;
        console.log('order edit',this.editForm);
        httpGet("/orderform/endform", this.editForm)
          .then(res => {
            console.log("edit", res);
            this.editLoading = false;
            if (res.code == 200) {
              this.$message({
                message: res.msg,
                type: "success"
              });
              this.$refs["editForm"].resetFields();
              this.getUsers(this.page,this.sort);
            } else {
              this.editLoading = false;
              this.$message({
                message: res.msg,
                type: "warning"
              });
            }
          })
          .catch(err => {
            console.log(err);
            this.editLoading = false;
          });
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            console.log("addForm order", this.addForm);
            httpPost("/orderform/createform", this.addForm)
              .then(res => {
                console.log(" staff", res);
                this.addFormVisible = false;
                this.addLoading = false;
                if (res.code == 200) {
                  this.$message({
                    message: res.msg,
                    type: "success"
                  });
                  this.$refs["addForm"].resetFields();
                  this.getUsers(this.page,this.sort);
                } else {
                  this.$message({
                    message: res.msg,
                    type: "warning"
                  });
                }
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
    }
  },
  mounted() {
    this.getUsers(this.page,this.sort);
  }
};
</script>

<style scoped>
.owner-avatar {
  width: 20px;
  height: auto;
}
</style>
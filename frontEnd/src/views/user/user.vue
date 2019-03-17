<template>
	<el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="姓名">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
        <el-form-item label="电子邮件">
			<el-input v-model="form.email"></el-input>
		</el-form-item>
        <el-form-item label="电话">
			<el-input v-model="form.tel"></el-input>
		</el-form-item>
        <el-form-item label="性别">
			<el-radio-group v-model="form.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
			</el-radio-group>
        </el-form-item>
		<el-form-item label="简介">
			<el-input type="textarea" v-model="form.desc"></el-input>
		</el-form-item>
		<el-form-item class="btn">
			<el-button type="primary">保存修改</el-button>
			<!-- <el-button @click.native.prevent>取消</el-button> -->
		</el-form-item>
	</el-form>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					email: '',
					tel: '',
					sex: '',
					desc: ''
				}
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			}
		}
	}

</script>
<style scoped>
.el-button--primary{
    display: block;
    margin: 0 auto;
}
</style>

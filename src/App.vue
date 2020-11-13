<template>
  <el-container>
    <!-- 头部 -->
    <el-header><i class="el-icon-edit"></i>学生成绩管理系统</el-header>
    <!-- 查找模块 -->
    <el-form :inline="true" :model="queryInfo" class="demo-form-inline" size="mini">
      <el-form-item label="学号">
        <el-input v-model="queryInfo.snumber" placeholder="精确查找"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="queryInfo.name" placeholder="模糊查找"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryStudentInfo">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="dialogVisible = true">录入</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据展示 -->
    <el-main>
      <el-table :data="studentList" border stripe style="width:100%;">
        <el-table-column prop="snumber" label="学号"> </el-table-column>
        <el-table-column prop="class" label="班级"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="sex" label="性别"> </el-table-column>
        <el-table-column prop="clan" label="css"> </el-table-column>
        <el-table-column prop="jslan" label="JS"> </el-table-column>
        <el-table-column prop="dblan" label="数据库"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small">查看</el-button>
            <el-button type="danger" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align:right;margin-top:10px">
        <!-- 分页 -->
        <el-pagination
          @current-change="currentChange"
          layout="prev,pager,next,total"
          :page-size="page.pageSize"
          :current-page="page.currentPage"
          :total="total"
        ></el-pagination>
      </div>
    </el-main>
    <!-- 录入对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%" @close="addStudentClose">
      <el-form :inline="true" :model="addStudent" class="demo-form-inline" :rules="addStudentRules" ref="addStudentRef">
        <el-divider content-position="left">基本信息</el-divider>
        <el-form-item label="学号" prop="snumber">
          <el-input v-model="addStudent.snumber" placeholder="T2018xxxx" size="mini" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="addStudent.class" placeholder="18软件xx" size="mini" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addStudent.name" placeholder="张三" size="mini" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="resource">
          <el-radio-group v-model="addStudent.sex" style="width:200px;text-align:left;">
            <el-radio label="男" checked></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider content-position="left">各科成绩</el-divider>
        <el-form-item label="css" prop="clan">
          <el-input v-model.number="addStudent.clan" placeholder="0-100" size="mini" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="JS" prop="jslan">
          <el-input v-model.number="addStudent.jslan" placeholder="0-100" size="mini" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="数据库" prop="dblan">
          <el-input v-model.number="addStudent.dblan" placeholder="0-100" size="mini" style="width:120px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="addStudentInfo" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'app',
  data() {
    const lengthRelus = { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    var checkScore = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('成绩不能为空'))
      } else if (value < 0 || value > 100) {
        return callback(new Error('请输入成绩在0-100'))
      } else if (typeof value !== 'number' || isNaN(value)) {
        return callback(new Error('成绩必须为数字'))
      } else {
        return callback()
      }
    }
    return {
      // 添加学生成绩
      addStudent: {
        snumber: '',
        class: '',
        name: '',
        sex: '男',
        clan: '',
        jslan: '',
        dblan: ''
      },
      // 查询数据
      queryInfo: {
        snumber: '',
        name: ''
      },
      // 展示学生成绩
      studentList: [],
      // 添加对话框的显示与隐藏
      dialogVisible: false,
      // 分页
      page: {
        currentPage: 1,
        pageSize: 5
      },
      // 总数
      total: 0,
      // 录入学生验证规则
      addStudentRules: {
        snumber: [{ required: true, message: '请输入学号', trigger: 'blur' }, lengthRelus],
        class: [{ required: true, message: '请输入班级', trigger: 'blur' }, lengthRelus],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }, lengthRelus],
        clan: [{ validator: checkScore, trigger: 'blur' }],
        jslan: [{ validator: checkScore, trigger: 'blur' }],
        dblan: [{ validator: checkScore, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取学生数据
    async getStudentList() {
      const { data } = await this.$axios.get('/studentList', { params: this.page })
      this.studentList = data.data
      this.total = data.total
    },
    // 消息通知框
    message(messages, mtype) {
      this.$message({
        message: messages,
        type: mtype
      })
    },
    // 查询学生信息
    async queryStudentInfo() {
      const { snumber } = this.queryInfo
      if (snumber.length > 1 && snumber.length < 20) {
        const { data } = await this.$axios.get('/findBySnumber/' + snumber)
        console.log(data)
        this.studentList = data
      }
    },
    // 录入学生信息
    addStudentInfo() {
      this.dialogVisible = true
      this.$refs.addStudentRef.validate(async (valid) => {
        if (!valid) return this.message('表单验证不通过', 'error')
        const data = await this.$axios.post('/students', this.addStudent)
        if (data.status !== 200) this.message(data.data, 'error')
        this.message('录入信息成功', 'success')
        this.getStudentList()
        this.dialogVisible = false
      })
    },
    handleClick(row) {
      console.log(row)
    },
    // 关闭对话框清空验证与表单数据
    addStudentClose() {
      this.$refs.addStudentRef.resetFields()
    },
    currentChange(page) {
      this.page.currentPage = page
      this.getStudentList()
    }
  },
  created() {
    this.getStudentList()
  }
}
</script>

<style>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  margin-bottom: 10px;
}

/* .el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
} */
.el-form {
  text-align: center;
  justify-content: center;
}
</style>

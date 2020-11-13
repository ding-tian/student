const e = require('express')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
// 允许跨域
app.use(require('cors')())
// 接收post的json数据
app.use(express.json())

// 录入学生
app.post('/api/students', async (req, res) => {
  const { snumber } = req.body
  const isExist = await Student.find({ snumber })
  console.log(isExist)
  if (isExist.length !== 0) {
    return res.status(250).send('该学号已录入')
  }
  const student = await Student.create(req.body)
  res.send(student)
})
// 删除学生
app.delete('/api/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id)
  res.send({
    Student: true
  })
})
// 修改学生信息
app.get('/api/updata/:id', async (req, res) => {
  const Student = await Student.findById(req.params.id)
  res.send(Student)
})
// 进行更新学生信息
app.put('/api/confirmUpdate/:id', async (req, res) => {
  const Student = await Student.findByIdAndUpdate(req.params.id, req.body)
  res.send(Student)
})
// 根据学号精确查询
app.get('/api/findBySnumber/:snumber', async (req, res) => {
  const { snumber } = req.params
  console.log(snumber)
  const StudentInfo = await Student.find({ snumber })
  res.send(StudentInfo)
})
// 根据姓名模糊查询
app.get('/api/findByName', async (req, res) => {
  const result = {
    data: [],
    total: ''
  }
  var confindent = new RegExp(req.query.names)
  // 总记录数
  var query = await Student.find({ $or: { name: confindent } })
  query.count({}, function(err, count) {
    if (err) {
      res.json(err)
    } else {
      result.total = count
    }
  })
  // 第几页和每页大小
  let pageSize = perseInt(req.query.pageSize)
  let currentPage = perseInt(req.query.currentPage)
  Student.find({}, (err, data) => {
    result.data = data
    res.send(result)
  })
    .where({ $or: { name: confindent } })
    .skip(currentPage - 1) * pageSize.limit(pageSize)
})

// 学生分页列表:
app.get('/api/studentList', async (req, res) => {
  const result = {
    data: [],
    total: ''
  }
  // 总记录数
  var query = await Student.find()
  result.total = query.length
  // 第几页和每页大小
  let pageSize = parseInt(req.query.pageSize)
  let currentPage = parseInt(req.query.currentPage)
  Student.find({}, (err, data) => {
    result.data = data
    res.send(result)
  })
    .skip((currentPage - 1) * pageSize)
    .limit(pageSize)
})

// 连接数据库
mongoose.connect('mongodb://localhost:27017/studentm', {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

const Student = mongoose.model(
  'Student',
  new mongoose.Schema({
    snumber: { type: String, required: true, unique: true },
    class: { type: String, required: true, minlength: 1, maxlength: 20 },
    name: { type: String, required: true, minlength: 2, maxlength: 10 },
    sex: { type: String, required: true, enum: ['男', '女'] },
    clan: { type: Number, min: 0, max: 100, required: true },
    jslan: { type: Number, min: 0, max: 100, required: true },
    dblan: { type: Number, min: 0, max: 100, required: true }
  })
)
// console.log(Student)
// Student.create({
//   snumber: 'T2018213158',
//   calss: '18软件技术5班',
//   name: '郭俊',
//   sex: '男',
//   clan: 100,
//   jslan: 100,
//   dblan: 100
// })
//   .then((doc) => {
//     console.log(doc)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

app.listen(3030, () => {
  console.log('server is runing 3030')
})

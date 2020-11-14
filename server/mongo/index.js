// 引入mongoose模块
const mongoose = require('mongoose')

// 连接数据库
mongoose.connect('mongodb://localhost:27017/studentm', {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})
// 设定集合规则
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
module.exports = Student
// console.log(Student)
// Student.create({
//   snumber: 'T2018213205',
//   class: '18软件技术5班',
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

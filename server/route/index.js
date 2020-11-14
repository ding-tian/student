const express = require('express')
const api = express.Router()
const Student = require('../mongo')
// 录入学生
api.post('/students', async (req, res) => {
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
api.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id)
  res.send({
    Student: true
  })
})

// 进行更新学生信息
api.put('/confirmUpdate/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body)
  res.send(student)
})

// 根据学号精确查询
api.get('/findBySnumber/:snumber', async (req, res) => {
  const { snumber } = req.params
  console.log(snumber)
  const StudentInfo = await Student.find({ snumber })
  res.send(StudentInfo)
})

// 学生分页列表:
// 根据姓名模糊查询
api.get('/studentList', async (req, res) => {
  const result = {
    data: [],
    total: ''
  }
  let { name, pageSize, currentPage } = req.query
  // 第几页和每页大小
  pageSize = parseInt(pageSize)
  currentPage = parseInt(currentPage)
  let confindent = ''
  if (name.length > 0 && name.length < 20) {
    confindent = new RegExp(req.query.name)
    // 总记录数
    var query = await Student.find({ name: { $in: confindent } })
    result.total = query.length
    Student.find({ name: { $in: confindent } }, (err, data) => {
      result.data = data
      res.send(result)
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
  } else {
    var query = await Student.find()
    result.total = query.length
    Student.find({}, (err, data) => {
      result.data = data
      res.send(result)
    })
      .skip((currentPage - 1) * pageSize)
      .limit(pageSize)
  }
})

module.exports = api

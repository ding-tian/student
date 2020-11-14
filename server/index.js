const express = require('express')
const app = express()
const api = require('./route')
// 允许跨域
app.use(require('cors')())
// 接收post的json数据
app.use(express.json())

// 将路由和请求路径进行匹配
app.use('/api', api)

app.listen(3030, () => {
  console.log('server is runing 3030')
})

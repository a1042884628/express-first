//引入exress包
const express = require('express');
//引入连接池模块
const pool = require('./pool.js');
//引入Multer
var multer = require('multer')
//设置保存上传文件路径
var upload = multer({
  dest: './public/upload'
})
var app = express();
// 处理上传文件
app.use(upload.any())

// 处理表单提交，对应请求头application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: false // 为true时将使用qs库处理数据，通常不需要
}))

// 处理fetch请求，对应请求头application/json
app.use(express.json())

// 接收文件上传结果
app.post('/upload', (req, res, next) => {
  console.log(req.body)
  console.log(req.files)
  res.send({
    error: 0,
    data: req.body,
    msg: '上传成功'
  })
})
module.exports = upload;
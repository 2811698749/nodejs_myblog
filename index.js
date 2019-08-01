const express = require('express');
const app = new express();
const config = require('./config');
const util = require('./util/util');
const loader = require('./loader');
const bodyParser = require("body-parser");//解析post参数
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//拦截器
app.post('/api/*',function(request,response,next){//拦截所有的api/*
      let cookies = request.headers.cookie;
      if(cookies &&cookies.includes('token=9pwuGPWOFeaD55BRIXmAeqZ7OKCcENuY')){
          next();
      }else{
          response.writeHead(302);
          response.end()
      }
})

app.use(express.static(config.static_path));
app.listen(config.port,()=>{
    console.log('服务器已启动！port='+config.port);
    util.writeLog('服务器已启动！'); 
})
loader.init(app);//加载get和set方法
//图片上传
// 引入模块 
const multer = require('multer');
const dbutil = require('./dao/dbutil');
//配置模块
const uploadImage = multer({dest:'./blogImages/'});
//配置接口名，图片文件解析的文件名，
app.post('/api/uploadImage',uploadImage.single("image"),(request,response)=>{
    let imageName = request.body.imageName,
    size=request.file.size,
    path = request.file.path;
    let sql = `insert into blog_image (name,path,size)values(?,?,?);`;
    dbutil.execSql(sql,imageName,path,size).then( res =>{
        let insertId = res.insertId;
        response.writeHead(200);
        response.write(util.writeResult('sucess','文件上传成功！',{
            path:path,
            insertId:insertId
        }));
        response.end();
    },err => console.log(err));
})


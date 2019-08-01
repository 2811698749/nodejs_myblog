const map = new Map();
const dbUtile = require("../dao/dbutil");
const util = require('../util/util');
const url = require('url');
let addArticleSql =` insert into blog(title,content,views,tags,type_id,ctime,utime,blog_image)
values(?,?,?,?,?,?,?,?)`; 
//添加文章
function addArticle(request,response){
     let article =request.body,
     ctime = util.getNowDate();
    let reg = /，/g;
     article.tags = article.tags.replace(reg,',');
    dbUtile.execSql(addArticleSql,
        article.title,
        article.content,
        0,
        article.tags,
        article.type,
        ctime,
        ctime,
        article.imageId)
        .then(function(res){
            response.writeHead(200);
            response.write(JSON.stringify({
                statusCode:200,
                status:'添加成功!',
                info:'添加文章成功！'
            }))
            response.end();
            insertTags( article.tags);
        })
}
//插入tags
function insertTags(tags){
    let tagsArr = tags.split(',');
    let sql = `insert into tags (tag,ctime) values(?,?)`;
    tagsArr.forEach(tag => {
        dbUtile.execSql(sql,tag,util.getNowDate()).then(function(){})
    });
}
//获取tags标签
function getTags(request,response){
    let sql = 'select id, tag from tags order by ctime desc ';//limit 0,21
    dbUtile.execSql(sql).then( data=>{
        response.writeHead(200);
        response.write(util.writeResult('success','获取标签成功！',data));
        response.end();
    },err=> console.log(err))
}
//获取文章下拉列表
function getAticleTypeList(request,response){
    let sql = 'select id,type from blog_type';
    dbUtile.execSql(sql).then((data)=>{
        response.writeHead(200);
        response.write(util.writeResult('success','ok',data));
        response.end()
    },err=>console.log(err));
}
//删除文章
function delArticleById(request,response){
   let idblog = request.body.idblog;
   let sql = ' delete from blog where idblog = ?';
   dbUtile.execSql(sql,idblog).then( data =>{
       response.writeHead(200);
       response.write(util.writeResult('sucess',`删除id为${idblog}的文章成功！`,data));
       response.end();
   },err=>console.log(err))
}
//根据文章id获取文章详情
function getArticle(request,response){
    let params = url.parse(request.url,true).query;
    let sql = `select  title , content,views,tags,ctime,utime,comments,type_id,type from blog 
    inner join blog_type on blog.type_id = blog_type.id where idblog =?`;
    dbUtile.execSql(sql,params.idblog).then( res => {
        response.writeHead(200);
        response.write(util.writeResult('success','获取文章列表成功',res));
        response.end();
        addArticleViews(params.idblog);
    })
}
//修改文章
function updateAticle(request,response){
    var params = request.body;
    let sql = `update blog set title=?, tags=?,utime=? ,type_id= ?
    where idblog = ? `;
    dbUtile.execSql(sql,
        params.title,
        params.tags,
        util.getNowDate(),
        params.type_id|| params.type,
        params.idblog)
        .then(res =>{
            response.writeHead(200);
            response.write(util.writeResult('success','修改成功！',res));
            response.end();
        })
}
function addArticleViews(idblog){
    let sql =`UPDATE blog SET views = views+ 1 where idblog  = ?`;
    dbUtile.execSql(sql,idblog).then(res =>{

    },err =>{

    })
}
map.set('/getTags',getTags);
map.set('/api/updateAticle',updateAticle);
map.set('/getArticle',getArticle);
map.set('/api/delArticle',delArticleById);
map.set('/api/addArticle',addArticle);
map.set('/getAticleTypeList',getAticleTypeList);
module.exports.controller = map;
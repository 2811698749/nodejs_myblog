const map = new Map();
const dbUtile = require('../dao/dbutil');
const url = require('url');
const util = require('../util/util')
const articleListSql = `select idblog, title ,views,tags,ctime,content,utime,comments,type_id,type from blog 
inner join blog_type on blog.type_id = blog_type.id order by idblog limit ?,?  `;
//分页查询文章列表
function getArticleList(request,response){
    let parseObj = url.parse(request.url, true).query;
    parseObj.perCount = parseInt( parseObj.perCount);
    parseObj.activeIndex = parseInt( parseObj.activeIndex);
    let offsetNum =  parseObj.perCount*(parseObj.activeIndex-1);
        dbUtile.execSql(articleListSql,offsetNum,parseObj.perCount).then(data => {
            response.writeHead(200);
            response.write(util.writeResult('success','成功！',data));
            response.end();
        },err=>console.log(err))
}
//获取文章总数
function getTotalCount(request,response){
    let sql = 'select count(1) as sum from blog';
    dbUtile.execSql(sql).then(
        data =>{
            response.writeHead(200);
            response.write(util.writeResult('success','获取文章总数成功！',data));
            response.end()
        },err=>console.log(err)
    )
}
//获取文章排行
function getArticleRank(request,response){
    let sql = 'select  idblog , title, views ,tags,ctime from blog order by views desc , ctime desc limit 0,10;';
    dbUtile.execSql(sql).then(data => {
        response.writeHead(200);
        response.write(util.writeResult('success','获取文章排行成功！',data));
        response.end();
    })
}
//按类型查询文章列表
function getArticleListByBlogType(request,response){
    let sql = `select idblog,title,content,views,
    tags,ctime,ctime,utime,comments,type_id,type from 
    blog inner join blog_type on blog.type_id = blog_type.id 
    where type like ? limit ?,?`;
    let parseObj = url.parse(request.url, true).query;
    parseObj.perCount = parseInt( parseObj.perCount);
    parseObj.activeIndex = parseInt( parseObj.activeIndex);
    let offsetNum =  parseObj.perCount*(parseObj.activeIndex-1);
    dbUtile.execSql(sql, `%${parseObj.id}%`,offsetNum,parseObj.perCount).then( res=>{
        response.writeHead(200);
        response.write(util.writeResult('success','按分类查询成功！',res));
        response.end();
    })
}
function getTotalCountByBlogType(request,response){
    let sql = `select count(1) as 'sum'  from blog 
    inner join blog_type on blog.type_id = blog_type.id 
    where type like ? `;
    dbUtile.execSql(sql,
        `%${url.parse(request.url,true).query.id}%`)
        .then(data =>{
            response.writeHead(200);
            response.write(util.writeResult('success','获取文章总数成功！',data));
            response.end()
        },err=>console.log(err)
    )
}
function getArticleListByTag (request,response){
  let sql =`select idblog,title,content, views,tags,ctime, utime,comments,type_id,type from blog inner join blog_type
  on blog.type_id = blog_type.id
   where tags like ?;` ;

   dbUtile.execSql(sql, `%${url.parse(request.url,true).query.id}%`)
   .then(data =>{
    response.writeHead(200);
    response.write(util.writeResult('success','获取文章总数成功！',data));
    response.end()
},err=>console.log(err)
   )
}
//根据标签获取文章总数
function getTotalCountByTag(request,response){
    let sql = `select count(1) as 'sum'  from blog 
    inner join blog_type on blog.type_id = blog_type.id 
    where tags like ? `;
    dbUtile.execSql(sql,
        `%${url.parse(request.url,true).query.id}%`)
        .then(data =>{
            response.writeHead(200);
            response.write(util.writeResult('success','获取文章总数成功！',data));
            response.end()
        },err=>console.log(err)
    )
}
map.set('/getTotalCountByTag',getTotalCountByTag);
map.set('/getArticleListByTag',getArticleListByTag);
map.set('/getTotalCountByBlogType',getTotalCountByBlogType);
map.set('/getArticleListByBlogType',getArticleListByBlogType);
map.set('/getArticleRank',getArticleRank);
map.set('/getTotalCount',getTotalCount);
map.set('/getArticleList',getArticleList);
module.exports.controller = map;
const map = new Map();
const dbUtil = require('../dao/dbutil');
const utile = require('../util/util');
const url = require('url');

function saveComments(request, response) {
    let sql = `insert into comments (commits,parent_id,idblog,user_name,email,ctime,utime
        )values(?,?,?,?,?,?,?)`;
    var params = request.body.params;
    if (params.commits.length > 128) {
        params.commits = params.slice(0, 128);
    }
    dbUtil.execSql(sql,
        params.commits,
        params.parentId,
        params.idblog,
        params.userName,
        params.email,
        utile.getNowDate(),
        utile.getNowDate()
    ).then(res => {
        response.writeHead(200);
        response.write(utile.writeResult('success', '存储成功！', res));
        response.end();
    }, err => console.log(err))
}
function getCommentsCount(request, response) {
    let sql = 'select count(1) as sum from comments where idblog = ?';
    let sql1 = 'select count(1) as sum from comments'
    var params = url.parse(request.url, true).query;
    if( params.idblog){
        dbUtil.execSql(sql, params.idblog).then(res => {
            response.writeHead(200);
            response.write(JSON.stringify(res));
            response.end();
        })
    }else{
        dbUtil.execSql(sql1).then(res => {
            response.writeHead(200);
            response.write(JSON.stringify(res));
            response.end();
        })
    }
    
}
function getCommentsList(request, response) {
    let sql = `select id,commits,parent_id,idblog,user_name,email,ctime from comments where idblog = ? order by ctime desc limit ?,?`;
    let sqlNoWhere = `select id,commits,parent_id,idblog,user_name,email,ctime from comments order by ctime desc limit ?,?`;
    let params = url.parse(request.url, true).query,
        offsetNum = parseInt(params.perCount) * (parseInt(params.activeIndex) - 1);
    if (params.idblog) {
        dbUtil.execSql(sql, params.idblog, offsetNum, +params.perCount).then(res => {
            response.writeHead(200);
            response.write(JSON.stringify(res));
            response.end();
        })
    }else{
        dbUtil.execSql(sqlNoWhere, offsetNum, +params.perCount).then(res => {
            response.writeHead(200);
            response.write(JSON.stringify(res));
            response.end();
        })
    }

}
function getComentsById(request, response) {
    let sql = `select user_name from comments where id=?`;
    let params = url.parse(request.url, true).query;
    dbUtil.execSql(sql, params.id).then(res => {
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    })
}
function deleteComentById(request,response){
    let params = request.body;
    let sql = 'delete from comments where id = ?';
    dbUtil.execSql(sql,params.id).then( res =>{
        response.writeHead(200);
        response.write(JSON.stringify(res));
        response.end();
    })
}
map.set('/api/deleteComentById', deleteComentById);
map.set('/getComentsById', getComentsById);
map.set('/getCommentsList', getCommentsList);
map.set('/comments/saveComment', saveComments);
map.set('/getCommentsCount', getCommentsCount);
module.exports.controller = map;
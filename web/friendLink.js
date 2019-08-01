const map = new Map(),
dbUtil = require('../dao/dbutil'),
util = require('../util/util');
function addFriendlyLink(requset,response){
    let sql = `insert into friendly(ctime,link_text,link_url)
    values(?,?,?)`;
    let params =requset.body.params;
    dbUtil.execSql(sql,util.getNowDate(),params.link_text,params.link_url).then(res =>{
        response.writeHead(200);
        response.write(util.writeResult('success','添加成功！',res));
        response.end();
    })
}
function getFreidlyLinkList(requset,response){
    let sql = 'select *from friendly';
    dbUtil.execSql(sql).then(res=>{
        response.writeHead(200);
        response.write(util.writeResult('success','获取链接成功！',res));
        response.end();
    })
}
function delFriend(request,response){
    let sql = 'delete from friendly  where id = ?';
    dbUtil.execSql(sql,request.body.params.id).then(res=>{
        response.writeHead(200);
        response.write(util.writeResult('success','删除成功！',res));
        response.end();
    })
}

map.set('/api/addFriendLink',addFriendlyLink);
map.set('/getFreidlyLinkList',getFreidlyLinkList);
map.set('/api/delFriend',delFriend);
module.exports.controller = map;
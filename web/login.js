const map = new Map();
const util = require('../util/util');
const dbUtil = require('../dao/dbutil');
function login(request,response){
    let params =request.body;
    dbUtil.execSql(`select loginName from login where loginId =? and loginPwd = ?`,
    params.login,
    params.loginPwd )
    .then(function(res){
        if(res != null && res.length > 0  ){
            response.cookie('token',util.token,{maxAge:3600*24*1000});
        }
        response.writeHead(200);
          response.write(util.writeResult('success','登录信息',res));
          response.end();
    },function(err){
        console.log(err)
    })
}

map.set('/login',login)
module.exports.controller = map;
const map = new Map();
const dbUtil = require('../dao/dbutil');
const util = require('../util/util');

function getVisitTotalCount(request, response) {
    let ip = request.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        request.connection.remoteAddress || // 判断 connection 的远程 IP
        request.socket.remoteAddress || // 判断后端的 socket 的 IP
        request.connection.socket.remoteAddress;
    let sql = 'select count(1) as sum from blog_views';
    dbUtil.execSql(sql).then(function (data) {
        response.writeHeader(200);
        response.write(JSON.stringify(data));
        response.end();
        saveUserIp(ip);
    })
}
function saveUserIp(ip) {
    let sql = `insert into blog_views(gust_ip,ctime)
    values(?,?)`;
    dbUtil.execSql(sql, ip, util.getNowDate("yyyy-MM-dd hh:mm:ss")).then((res) => {
    }, err => console.log(err));
}
map.set('/getVisitTotalCount', getVisitTotalCount);
module.exports.controller = map;
//读取图片的接口
const url = require('url');
const fs = require('fs');
const map = new Map();
const util = require('../util/util');
const dbUtle = require('../dao/dbutil');
//获取图片
function getImage(request, response) {
    let params = url.parse(request.url, true),
        path = params.query.path;
    fs.readFile(path, (err, data) => {
        if (err) {
            response.writeHead(404);
            response.end();
        } else {
            response.writeHead(200);
            response.write(data);
            response.end();
        }
    })
}
// 获取图片总数
function getImageTotalCount(request,response){
    dbUtle.execSql('select count(1) as sum from blog_image').then(data => {
        response.writeHead(200);
        response.write(util.writeResult('success','获取总数成功！',data));
        response.end();
    })
}
//获取图片列表
function getImageList(request,response){
    let params = url.parse( request.url,true).query;
  
    params.perCount =parseInt(params.perCount);
    params.activeIndex =parseInt(params.activeIndex);
    dbUtle.execSql('select * from blog_image limit ?,?',params.perCount*(params.activeIndex-1),params.perCount)
    .then(data => {
        response.writeHead(200);
        response.write(util.writeResult('success','获取总数成功！',data));
        response.end();
    })
}
//根据id删除图片
function deleteImage(request, response) {
    let params = request.body,
        minId = parseInt(params.id) - 1,
        maxId = parseInt(params.maxId || params.id) + 1;
    let sql = 'delete from blog_image  where id > ? and id < ?;';
    deleteImageFile(minId, maxId).then(() => {
        dbUtle.execSql(sql, minId, maxId).then(data => {
            response.writeHead(200);
            response.write(util.writeResult('sucess', '删除成功！', {affectedRows:data.affectedRows}));
            response.end();
        }, err => console.log(err));
    })

}
//删除文件操作
function deleteImageFile(minId, maxId) {
    let sql = 'select path from blog_image where id > ? and id < ?;';
    return new Promise((res, rej) => {
        dbUtle.execSql(sql, minId, maxId).then(data => {
            data.forEach(ele => {
                fs.unlink("./" + ele.path, function (error) {
                    if (error) {
                        console.log(error);
                        return false;
                    }
                })
            });
            res();
        }
        // ,res => rej(res)
       );
    })
}
map.set('/getImageList',getImageList)
map.set('/api/deleteImage', deleteImage);
map.set('/getImage', getImage);
map.set('/getImageTotalCount',getImageTotalCount);
module.exports.controller = map;
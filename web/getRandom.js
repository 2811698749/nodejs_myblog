const map = new Map();
const util = require('../util/util');
const captcha = require('svg-captcha');//生成二维码
function getRandom(request,response){
    let img = captcha.create({
        fontSize:50,
        width:100,
        height:34
    })
    response.writeHead(200);
    response.write(util.writeResult('success','二维码生成成功！',img));
    response.end();
}
map.set('/getRandom',getRandom);
module.exports.controller = map;
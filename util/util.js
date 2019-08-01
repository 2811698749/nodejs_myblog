// 工具类方法文件
const fs = require('fs');
const path = require('path');
const http = require('http');
function getNowDate(value) {
    function dFormat(i) { return i < 10 ? "0" + i : i; }
    let d = new Date(),
        y = d.getFullYear(),
        m = d.getMonth() + 1,
        day = d.getDate(),
        dateStr = `${y}-${dFormat(m)}-${dFormat(day)}`;
    if (!value) {//获取时间戳 以秒为单位
        return parseInt(new Date().getTime() / 1000);
    }
    else if (value == "yyyy-MM-dd hh:mm:ss") {
        return `${dateStr} ${dFormat(d.getHours())}:${dFormat(d.getMinutes())}:${dFormat(d.getSeconds())}`;
    }
    else if (value == "yyyy-MM-dd") {
        return dateStr;
    }
}
// 写文件日志
function writeLog(info) {
    info = getNowDate("yyyy-MM-dd hh:mm:ss") + ' ' + info + '\n';
    fs.writeFile(path.resolve(__dirname, '../log/log.txt'), info, { 'flag': 'a' }, function (err) {
        if (err) {
            throw err;
        }
    })
}
//格式化返回值
function writeResult(state, text, data) {
    return JSON.stringify({
        state: state,
        text: text,
        data: data
    })
}

const token = "9pwuGPWOFeaD55BRIXmAeqZ7OKCcENuY";
module.exports = {
    getNowDate,
    writeLog,
    writeResult,
    token: token
}
const mysql = require('mysql');
function  createConnection() {
    return new mysql.createConnection({
        host:'192.168.56.1',
        prot:'3306',
        user:'root',
        password:'zhuyulin',
        database:'my_blog'
    })
}
function execSql(sql,...arg){
    return new Promise((res,rej)=> {
        let connection = createConnection();
        connection.query(sql,arg||[],(err,data)=>{
            if(err){
                rej(err);
               console.log(err);
            }else{
                res(data);
                connection.end();
            }
        })
    })
}
module.exports = {
    execSql
}

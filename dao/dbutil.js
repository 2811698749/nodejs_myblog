const mysql = require('mysql');
function  createConnection() {
    return new mysql.createConnection({
        host:'148.70.125.106',
        prot:'3306',
        user:'root',
        password:'Zhuyulin123.',
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

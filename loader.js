const fs =require('fs');
const config = require('./config');
const dirArr = fs.readdirSync(config.web_path);
const controllerMap = new Map();

function init(app){
    dirArr.forEach( dir =>{
        let temp = require('./'+config.web_path+dir );
        if(!temp.controller){
            throw new Error('loader加载controller出错，未找到导出的controller!');
        }
        for(let [k,v] of temp.controller){
            if(!controllerMap.get(k)){
                controllerMap.set(k,v);
                if(k.includes('get')){//如果key里面有get则是get方法
                    app.get(k,v);
                }else{//否则是post方法
                    app.post(k,v);
                }
            }else{
                throw new Error('方法名重复定义');
            }
        }
    })
  
}
module.exports = {
    init
}
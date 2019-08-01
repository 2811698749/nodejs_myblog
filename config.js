const fs = require('fs');
const arrConfig = fs.readFileSync('./server.config','utf-8').split('\n');
const config ={};
arrConfig.forEach(item => {
    let temp = item.split('=');
    if(temp.length > 1){
        config[temp[0].trim()] = temp[1].trim();
    }
} )

module.exports = config;
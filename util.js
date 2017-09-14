"use strict";

var fs =require("fs");
var path=require("path");
var iconv = require('iconv-lite');
var logger = require('./logger').logger('util');

const PATH=[
"C:\\workspace2\\PLDHimeji\\pldHR_client\\TFT\\nt\\NewBRM\\Page\\",
"C:\\workspace2\\PLDHimeji\\pldHR_client\\LCD\\nt\\NewBRM\\Page\\"]

const re1 = /L\.Hao\s+\[P11721\]/;
const re2 = /\/\/.*\[P11721\]/g;

var util={
    checkSpaces: ()=>{
        logger.info("step in checkSpacks()");
        for (let dir of PATH){
            let dirs=fs.readdirSync(dir).filter( (x)=>{
                return x.endsWith('.h') || x.endsWith('.cpp');
            });
            logger.debug("find files: %d",dirs.length);
            for(let file of dirs){
                let data=fs.readFileSync(path.resolve(dir,file));
                let buf = new Buffer(data, 'binary');
                let retStr = iconv.decode(buf, "Shift_JIS");
                if(re1.test(retStr)){
                    logger.debug(dir+file);
                    let index=-1;
                    while(re2.exec(retStr)){
                        let matchstring=retStr.substring(retStr.indexOf("\/\/",re2.lastIndex-56),re2.lastIndex+10);
                        let indexTmp=matchstring.indexOf('[P11721]');
                        if(index==-1){
                            index=matchstring.indexOf('[P11721]');
                        }
                        if(indexTmp!==index){
                            logger.debug('--need fix-----',dir+file);
                            let readfile=fs.createReadStream(path.resolve(dir,file));
                            let writefile;
                            if(dir===PATH[0]){
                                writefile=fs.createWriteStream(path.resolve("c:\\tmp\\TFT\\",file));
                            }else{
                                writefile=fs.createWriteStream(path.resolve("c:\\tmp\\LCD\\",file));
                            }
                            readfile.pipe(writefile);
                        }else{
                            index=indexTmp;
                        }
                        
                    }
                }
            }
        }                                
    },

}

module.exports=util;

"use strict";

var log4js = require('log4js');
log4js.configure({
    appenders: { app: { type: 'file', filename: 'logs/server.log' } },
    categories: { default: { appenders: ['app'], level: 'debug' } }
  });


exports.logger=function(name){
  var logger = log4js.getLogger(name);
  return logger;
}
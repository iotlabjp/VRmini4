
var logger = require('./logger');
var express = require('express');
var mraa = require('mraa');
var app = express();
var p0 = new mraa.Gpio(20); //J18-7
var g0 = new mraa.Pwm(0); //J18-1
var g1 = new mraa.Pwm(21); //J17-1

p0.dir(mraa.DIR_OUT);
g0.period_us(250);
g0.enable(true);
g1.period_us(250);
g1.enable(true);
app.get('/', function(req, res){

        //console.log("test2");
        if(res.req.query["in1"]>=0 && res.req.query["in2"]>=0 && res.req.query["value"] >= 0){
                g0.write(res.req.query["in1"]*1);
                g1.write(res.req.query["in2"]*1);
                p0.write(1);
                //p0.write(res.req.query["value"]*1);
                // console.log("hoge");
                console.log("in1"+res.req.query["in1"]+"in2"+res.req.query["in2"]+"value"+res.req.query["value"]);

  logger.request.info('url:'+ decodeURI(req.url));
        }
        res.send('ok'+res.req.query["in1"]+' '+res.req.query["in2"]+' '+res.req.query["value"]);

});

app.listen(9001);




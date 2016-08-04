// ライブラリの読み込み  
var usb = require('usb');
var rest = require('restler');
var async = require('async');

//USB機器から受け取ったアクセルとブレーキの値を0-1に変換
//"<Buffer 08 00 00 5e d0 1f 00 ff 80>" 7番目アクセル, 8番目ブレーキ
function conv2int(data){
    
    var ac = 255-data[6];
    var br = 255-data[7];

    a = Math.floor(ac*10/232)/10
    b = Math.floor(br*10/232)/10

    return [a,b];
}

function acbr2logic(ac,br){
    var in1, in2, value;

    if(br > 0){
    	in1 = 1; in2 = 1; value = br;
    }else if(ac > 0){
	in1 = 1; in2 = 0; value = ac;
    }else{
	in1 = 0; in2 = 0; value = 0;
    }
    return [in1, in2, value];
}

// アクセルとブレーキの値を受け取ってGetで送る関数
function sendGet(in1,in2,value){
    rest.get('http://192.168.42.1:9001?in1='+in1+'&in2='+in2+'&value='+value);
    rest.get('http://localhost:9001?in1='+in1+'&in2='+in2+'&value='+value);
}

// vid, pid を指定してデバイスをオープン
var dev = usb.findByIds(0x046d,0xc29a);
dev.open();

// interfaceを宣言                                        
dev.interfaces[0].claim();
var inEndpoint = dev.interfaces[0].endpoints[0];

inEndpoint.startPoll(3,64)

var params = [0,0,0];

async.forever(function(callback){

    inEndpoint.transfer(64, function (error, data) {
	if (!error) {
	    ab = conv2int(data);
	    l = acbr2logic(ab[0], ab[1]);
	    if(params.toString() != l.toString()){
		sendGet(l[0], l[1], l[2]);
		console.log(l[0], l[1], l[2]);
	    }
	    params = l;
	} else {
	    console.log(error);
	}
    });

    setTimeout(callback, 100);

} ,function(err){
    console.log(err);
});

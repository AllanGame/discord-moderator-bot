var keys = "abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
var code='';

function generateCode(len){
	code='';
		for(i=0; i<len; i++){
			code+=keys.charAt(Math.floor(Math.random()*keys.length));
		}

	return code;
}

exports.generateCode = generateCode;

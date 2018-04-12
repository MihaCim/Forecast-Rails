process.env.TZ = 'Europe/Ljubljana'
var a = new Date("Wed Jan 1 2014 00:00:00 GMT+0000(CET)");
var timeStamp = a.getTime();      
console.log(timeStamp);
console.log(process.env.TZ);

var timeStampNOW = Math.floor(Date.now()+7200000);
console.log(timeStampNOW)
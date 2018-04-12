// DISCLAIMER: darksky.net returns hourly data just for the current day (from midnight to midnight)
// therefore there is no use for calling the script for every hour.

// includes
const request = require("sync-request");
const jsonfile = require('jsonfile');
const fs = require('fs');

// loading configuration files
const config = jsonfile.readFileSync('config.json');

// setting up environmental variables regarding time
process.env.TZ = 'Europe/Ljubljana'
let a = new Date("Wed Nov 1 2017 00:00:00 GMT+0100(CET)");
let timeStamp = Math.floor(a.getTime()/1000);      
console.log(timeStamp);
console.log(process.env.TZ)
let timeStampNOW = Math.floor((Date.now()+7200000)/1000);

// if it exists, read the last written timestamp
if (fs.existsSync("data.json")) {
    console.log("Reading last timestamp!")
    let lines = fs.readFileSync('data.json').toString().split("\n");
    console.log(lines[lines.length - 2]);
    let line = JSON.parse(lines[lines.length - 2]);
    timeStamp = line.currently.time;
    // add an hour
    timeStamp = timeStamp + 3600*24;
}

// gathering data until today
console.log(timeStampNOW)

// starting the loop
let latitude = "49.259106";
let longitude = "4.026121";
let token = config["darkSky-token"];

while (timeStamp <= timeStampNOW) {
    var date = new Date(timeStamp * 1000);
    console.log(date);    

    var requestStr = "https://api.darksky.net/forecast/" + token + "/" + latitude +"," + longitude + "," + timeStamp;
    var res = request("GET", requestStr);

    fs.appendFileSync('data.json', res.getBody('utf8') + "\n");
    console.log(res.getBody('utf8'));  
      
    // adding an hour to the data
    timeStamp = timeStamp + 3600*24;
}


// convert darksky data to real-time data format as can be seen in
// snippets/darksky-standard-prediction.json

// includes
const fs = require('fs');
const readline = require('readline');

// read the whole dataset and build predictions vector
// 2 - send weather data
let readStream = fs.createReadStream('data.json');
let rd = readline.createInterface({
    input: readStream,    
    console: false
});

let counter = 0;
let vector = {};

// setting up environmental variables regarding time
process.env.TZ = 'Europe/Ljubljana'

rd.on('line', function(line) {
    counter++;  
    // if (counter > 10000) {
    if (false) {
        rd.close();
        readStream.destroy();
    }
    rememberVector(line);
});

rd.on('close', function() {    
    console.log("Found hourly records: " + Object.keys(vector).length);
    makeRealRecords();
    console.log("end");
})

function rememberVector(line) {
    let json = JSON.parse(line);
    for(let i in json.hourly.data) {
        let obj = json.hourly.data[i];
        vector[obj.time] = obj;        
    }
}

function makeRealRecords() {
    let a = new Date("Wed Nov 1 2017 00:00:00 GMT+0100(CET)");
    let b = new Date("Wed Apr 4 2018 00:00:00 GMT+0100(CET)");
    let timeStamp = Math.floor(a.getTime()/1000);
    let timeStampNOW = Math.floor(b.getTime()/1000);

    while (timeStamp <= timeStampNOW) {
        var date = new Date(timeStamp * 1000);
        console.log(date);  
        
        //let obj = makeDarkSkyJSONForecast(timeStamp);
        //fs.appendFileSync('converted.json', JSON.stringify(obj) + "\n");
        let str = makeCSV(timeStamp);
        console.log("x" + str);
        fs.appendFileSync('converted.csv', str + "\n");

        // adding an hour to the data
        timeStamp = timeStamp + 3600;
    }

    // write to 
}

function makeCSV(timeStamp) {
    
    let str = "";

    if (timeStamp in vector) {
        for (let prop in vector[timeStamp]) {
            str += vector[timeStamp][prop] + ",";
        }
    } else {
        console.log("\n\n\nNOT FOUND!\n\n\n");
        exit();
    }

    /*
    for (let i = 0; i <= 48; i++) {
        let forecastTimestamp = timeStamp + i * 3600;        
        let forecastTimestamp24 = timeStamp + i * 3600 - 24 * 3600;        
        if (forecastTimestamp in vector) {
            obj.hourly.data.push(vector[forecastTimestamp]);
        } else if (forecastTimestamp24 in vector) {
            obj.hourly.data.push(vector[forecastTimestamp24]);
            console.log("DAY OLD DATA!");
        } else {
            console.log("\n\n\nNOT FOUND!\n\n\n");
            exit();
        }
    }
    */
    return str;
}

function makeDarkSkyJSONForecast(timeStamp) {
    let obj = {
        "latitude": 45.95472,
        "longitude": 13.664836,
        "timezone": "Europe/Ljubljana",
        "currently": {
            "time": timeStamp
        },
        "hourly": {
            "data": []
        }
    };    

    for (let i = 0; i <= 48; i++) {
        let forecastTimestamp = timeStamp + i * 3600;        
        let forecastTimestamp24 = timeStamp + i * 3600 - 24 * 3600;        
        if (forecastTimestamp in vector) {
            obj.hourly.data.push(vector[forecastTimestamp]);
        } else if (forecastTimestamp24 in vector) {
            obj.hourly.data.push(vector[forecastTimestamp24]);
            console.log("DAY OLD DATA!");
        } else {
            console.log("\n\n\nNOT FOUND!\n\n\n");
            exit();
        }
    }

    return obj;
}
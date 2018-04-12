var request = require("sync-request");
var latitude = "45.954720";
var longitude = "13.664836";
var token = "80b30951bf29fcaec33438a3805a70a1";
var requestStr = "https://api.darksky.net/forecast/" + token + "/" + latitude + "," + longitude;
var res = request("GET", requestStr);
exports = mongoose = require("mongoose");

//Mongoose Configuration and Initialization
var mongoDbName = "mothership";
var mongoOptions = "";
var poolSize = 5;
var mongoUrl = "mongodb://localhost/" + mongoDbName + "?" + mongoOptions;
exports = db = mongoose.createConnection(mongoUrl, {server: {poolSize: poolSize}});

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to Mongo at: " + mongoUrl);
});

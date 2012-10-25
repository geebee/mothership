exports.generateSHA512Hash = function (nonce, model, callback) {
    process.nextTick(function(){
        var crypto = require('crypto');
        var hexSHA = {};

        hexSHA.model = model;
        hexSHA.sum = crypto.createHash('sha512').update(nonce).digest('hex');
        callback(hexSHA);
    });
};

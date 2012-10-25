var utils = require('../../utils');

module.exports = exports = function generateSHA512Hash(schema, options) {
    schema.add({signingKey: {type: String}});

    schema.pre('save', function (next) {
        if (this.isNew) {
            console.log("New User about to be created, generating signing key.");

            var nonce = 0; 
            for (i=1; i<=3; i++) {
                nonce += new Date().getTime();
            }
            utils.generateSHA512Hash(nonce.toString(), this, function(hexSha) {
                console.log("Hash Snippet: " + hexSha.sum.substring(1,20));
                hexSha.model.signingKey = hexSha.sum;
                console.log("Signing Key Generated");
                next();
            });
        }
    });

    if (options && options.index) {
        schema.path('signingKey').index(options.index);
    }
};

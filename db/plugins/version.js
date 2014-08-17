module.exports = exports = function version (schema, options) {
    schema.add({v: {type: Number, min: 0}});

    schema.pre('save', function (next) {
        currentDocument = this;
        console.log("currentDocument.v: %s", currentDocument.v);
        if (currentDocument.isNew) {
            currentDocument.v = 1; 
        } else {
            var confVersionsModel = require('../models/confVersions'); 
            var ConfVersions = db.model('ConfVersions', confVersionsModel.ConfVersionsSchema);
            var newVersion = new ConfVersions({
                confReference: {
                    _id: currentDocument._id,
                    v: currentDocument.v
                },
                hostIdentification: {
                    "friendlyName": currentDocument.hostIdentification.friendlyName,
                    "fqdn": currentDocument.hostIdentification.fqdn,
                    "ip": currentDocument.hostIdentification.ip,
                    "url": currentDocument.hostIdentification.url,
                    "environment": currentDocument.hostIdentification.environment
                },
                properties: currentDocument.properties
            });
            newVersion.save(function(err, data){
                if (err) {
                    console.log("Error saving new version: %s", err);
                    next(err);
                } else {
                    console.log("Version (%s) successfully stored.", currentDocument.v);
                    currentDocument.v += 1;
                    next();
                };
            });
        }
    });

    if (options && options.index) {
        schema.path('v').index(options.index);
    }
};

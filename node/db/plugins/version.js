module.exports = exports = function version (schema, options) {
    schema.add({_version: {type: Number, min: 0}});

    schema.pre('save', function (next) {
        currentDocument = this;
        console.log("currentDocument._version: %s", currentDocument._version);
        if (this.isNew) {
            this._version = 1; 
        } else {
            var confVersionsModel = require('../models/confVersions'); 
            var ConfVersions = db.model('ConfVersions', confVersionsModel.ConfVersionsSchema);
            var newVersion = new ConfVersions({
                confReference: {
                    _id: currentDocument._id,
                    _version: currentDocument._version
                },
                hostIdentification: {
                    "friendlyName": this.hostIdentification.friendlyName,
                    "fqdn": this.hostIdentification.fqdn,
                    "ip": this.hostIdentification.ip,
                    "url": this.hostIdentification.url,
                    "environment": this.hostIdentification.environment
                },
                properties: this.properties
            });
            newVersion.save(function(err, data){
                if (err) {
                    console.log("Error saving new version: %s", err);
                    next(err);
                } else {
                    console.log("Version (%s) successfully stored.", currentDocument._version);
                    currentDocument._version += 1;
                    next();
                };
            });
        }
    });

    if (options && options.index) {
        schema.path('_version').index(options.index);
    }
};

require('../db/init');
var confModel = require('../db/models/conf'); 
var Conf = db.model('Conf', confModel.ConfSchema);

exports.list = function(req, res, next) {
    console.log("handler 'listConf'");

    Conf.find({}, function(err, confList) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving all confs: " + err);
            //TODO: Don't retardedly concatenate to an empty string
            res.send({error: "" + err});
        } else {
            console.log("All confs retrieved.");
            res.send(confList);
        }
    });
};

exports.single = function(req, res, next) {
    console.log("handler 'singleConf'");
    console.log("req.params:\n%j", req.params);

    Conf.findOne({"hostIdentification.friendlyName": req.params.friendlyName}, function(err, conf) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving Conf: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Conf: " + req.params.friendlyName + " retrieved.");
            console.log("Conf: %j", conf);
            if (req.params.style){
                switch(req.params.style) {
                    case "raw":
                        console.log("Style was raw");
                        var mappedProperties = ""; 
                        conf.properties.forEach(function(p){ 
                            mappedProperties = mappedProperties + p.key + "=" + p.value + "\n";
                        });  
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(mappedProperties);
                        break;
                    case "quoted":
                        console.log("Style was quoted");
                        var mappedProperties = ""; 
                        conf.properties.forEach(function(p){ 
                            mappedProperties = mappedProperties + "\"" + p.key + "\"=\"" + p.value + "\"\n";
                        });  
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(mappedProperties);
                        break;
                    case "json":
                        console.log("Style was json");
                        var mappedProperties = {};
                        conf.properties.forEach(function(p){ 
                            mappedProperties[p.key] = p.value;
                        });  
                        res.send(mappedProperties);
                        break;
                    case "properties":
                        console.log("Style was properties");
                        var mappedProperties = ""; 
                        conf.properties.forEach(function(p){ 
                            var fixedKey = p.key.replace(/\s/g,".");
                            mappedProperties = mappedProperties + fixedKey + "=" + p.value + "\n";
                        });  
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(mappedProperties);
                        break;
                    default:
                        console.log("Style was unknown");
                        res.send({validStyles: ["raw", "quoted", "json", "properties"]});
                }
            } else {
                res.send(conf);
            }
        }
    });
};

exports.remove = function(req, res, next) {
    console.log("handler 'deleteConf'");
    console.log("Friendly Name: " + req.params.friendlyName);

    conf.remove({"hostIdentification.friendlyName": req.params.friendlyName}, function(err, conf) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Deleting conf: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Conf: " + req.params.friendlyName + " deleted.");
            res.send({"deleted": req.params.friendlyName});
        }
    });
};

exports.modifyHost = function(req, res, next) {
    console.log("handler 'modifyConf'");
    console.log("req.params: %j", req.params);
    console.log("Friendly Name: " + req.params.friendlyName);

    Conf.findOne({"hostIdentification.friendlyName": req.params.friendlyName}, function(err, conf){ 
        if (err) {
            console.log("Error Updating hostIdentification: " + err);
            res.send({error: "" + err});
        } else {
            conf.hostIdentification = req.params.hostIdentification;
            console.log(conf);
            conf.save(function(err, data) {
                if (err) {
                    console.log("error: " + err);
                    res.send({"error": "" + err});
                } else {
                    console.log("Update Completed."); 
                    res.send({"status": "successful"});
                }
            });
        }
    });
};

exports.updateProperty = function(req, res, next) {
    console.log("handler 'updateProperty'");
    console.log("Friendly Name: " + req.params.friendlyName);
    console.log("kvObject to update: {%s: %s}", req.params.toUpdate.key, req.params.toUpdate.value);

    Conf.findOne({"hostIdentification.friendlyName": req.params.friendlyName}, function(err, conf){ 
        if (err) {
            console.log("Error Updating kvObject: " + err);
            res.send({error: "" + err});
        } else {
            //var updatedProperties = [{'key': 'key1', 'value': 'value1'}];
            var updatedProperties = [];
            conf.properties.forEach(function(p){
                if (p.key === req.params.toUpdate.key){
                    console.log("request key: %s, matches array key: %s. Updating (old value: %s) with value: %s", req.params.toUpdate.key, p.key, p.value, req.params.toUpdate.value);
                    updatedProperties.push({"key": p.key, "value": req.params.toUpdate.value});
                } else {
                    console.log("request key: %s, does not match array key: %s", req.params.toUpdate.key, p.key);
                    updatedProperties.push({"key": p.key, "value": p.value});
                }
            });

            console.log("uP: %j", updatedProperties);
            conf.properties = updatedProperties;

            console.log(conf);
            conf.save(function(err, data) {
                if (err) {
                    console.log("error: " + err);
                    res.send({"error": "" + err});
                } else {
                    console.log("Update Completed."); 
                    res.send({"status": "successful"});
                }
            });
        }
    });
};

exports.removeProperty = function(req, res, next) {
    console.log("handler 'removeProperty'");
    console.log("Friendly Name: " + req.params.friendlyName);

    Conf.findOneAndUpdate({"hostIdentification.friendlyName": req.params.friendlyName}, { $set: req.params.toUpdate}, function(err, numberAffected, rawResponse) {
        if (err) {
            console.log("Error Updating User: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Update Completed. Affected Documents: " + numberAffected);
            res.send({"status": "successful", "affected": numberAffected});
        }
    });
};

exports.create = function(req, res, next) {
    console.log("handler 'createConf'");

    //Inputs are validated as needed in the model
    //TODO: Figure out authentication!
    var newConf = new Conf({
        hostIdentification: {
            "friendlyName": req.params.friendlyName,
            "fqdn": req.params.fqdn, 
            "ip": req.params.ip,
            "url": req.params.url
        },
        properties: req.params.properties
    });

    newConf.save(function(err) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Saving Conf: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Conf: " + newConf.hostIdentification.friendlyName + " created successfully.");
            res.send({information: "conf page", friendlyName: newConf.hostIdentification.friendlyName});
        }
    });
};

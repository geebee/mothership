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

exports.single = function(req, res, next) {
    console.log("handler 'singleConf'");

    Conf.findOne({"hostIdentification.friendlyName": req.params.friendlyName}, function(err, conf) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving Conf: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Conf: " + req.params.friendlyName + " retrieved.");
            //TODO: Get style= from query string and return appropriately
            res.send(conf);
        }
    });
};

exports.modifyHost = function(req, res, next) {
    console.log("handler 'modifyConf'");
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

exports.addProperty = function(req, res, next) {
    console.log("handler 'addProperty'");
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

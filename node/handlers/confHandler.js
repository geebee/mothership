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
    console.log("Conf ID: " + req.params.confId);

    conf.remove({_id: req.params.confId}, function(err, conf) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Deleting conf: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Conf: " + req.params.confId + " deleted.");
            res.send({"deleted": req.params.confId});
        }
    });
};

exports.single = function(req, res, next) {
    console.log("handler 'singleConf'");

    Conf.findById(req.params.confId, function(err, conf) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving Conf: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Conf: " + req.params.confId + " retrieved.");
            res.send(conf);
        }
    });
};

exports.modify = function(req, res, next) {
    console.log("handler 'modifyConf'");
    console.log("Conf ID: " + req.params.confId);

    Conf.findByIdAndUpdate(req.params.confID, { $set: req.params.toUpdate}, function(err, numberAffected, rawResponse) {
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
        legalName: req.params.legalName,
        address: req.params.address,
        phoneNumber: req.params.phoneNumber,
        contact: req.params.contact,
        promotions: req.params.promotions,
        cardCodes: req.params.cardCodes
    });

    newConf.save(function(err) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Saving Conf: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Conf: " + newConf._id + " created successfully.");
            res.send({information: "conf page", confId: newconf._id});
        }
    });
};

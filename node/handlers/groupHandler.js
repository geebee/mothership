require('../db/init');
var groupModel = require('../db/models/group'); 
var Group = db.model('Group', groupModel.GroupSchema);

exports.list = function(req, res, next) {
    console.log("handler 'listGroups'");

    Group.find({}, function(err, groupList) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving Group: " + err);
            //TODO: Don't retardedly concatenate to an empty string
            res.send({error: "" + err});
        } else {
            console.log("All groups retrieved.");
            res.send(groupList);
        }
    });
};

exports.remove = function(req, res, next) {
    console.log("handler 'deleteGroup'");

    Group.remove({_id: req.params.groupId}, function(err, group) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Deleting Group: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Group: " + req.params.groupId + " deleted.");
            res.send({"deleted": req.params.groupId});
        }
    });
};

exports.single = function(req, res, next) {
    console.log("handler 'singleGroup'");

    Group.findById(req.params.groupId, function(err, group) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving Group: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Group: " + req.params.groupId + " retrieved.");
            res.send(group);
        }
    });
};

exports.modify = function(req, res, next) {
    console.log("handler 'modifyGroup'");
    console.log("Group ID: " + req.params.groupId);

    Group.findByIdAndUpdate(req.params.groupId, { $set: req.params.toUpdate}, function(err, numberAffected, rawResponse) {
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
    console.log("handler 'createGroup'");

    //Inputs are validated as needed in the model
    //TODO: Figure out authentication!
    
    console.log("params: \n%j", req.params);

    var newGroup = new Group({
        name: req.params.name,
        permissions: req.params.permissions
    });

    newGroup.save(function(err) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Saving Group: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Group: " + newGroup._id + " created successfully.");
            res.send({information: "groups page", groupId: newGroup._id});
        }
    });
};

exports.listPermissions = function(req, res, next) {
    console.log("handler 'listGroupPermissions'");

    Group.findById(req.params.groupId, function(err, group) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving Group Permissions: " + err);
            //TODO: Don't retardedly concatenate to an empty string
            res.send({error: "" + err});
        } else {
            console.log("Group permissions retrieved.");
            res.send(group.permissions);
        }
    });
};

exports.addPermission = function(req, res, next) {
    console.log("handler 'addGroupPermission'");
    console.log("Group ID: " + req.params.groupId);

    Group.findByIdAndUpdate(req.params.groupId, { $addToSet: req.params.addedPermission}, function(err, numberAffected, rawResponse) {
        if (err) {
            console.log("Error Adding Permission: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Update Completed. Permission: %s Added To Group.", req.params.addedPermission); 
            res.send({"status": "successful", "affected": numberAffected});
        }
    });
};

exports.removePermission = function(req, res, next) {
    console.log("handler 'removeGroupPermission'");
    console.log("Group ID: " + req.params.groupId);

    Group.findByIdAndUpdate(req.params.groupId, { $pull: req.params.removedPermission}, function(err, numberAffected, rawResponse) {
        if (err) {
            console.log("Error Removing Permission: " + err);
            res.send({error: "" + err});
        } else {
            console.log("Update Completed. Permission: %s Removed From Group", req.params.removedPermission);
            res.send({"status": "successful", "affected": numberAffected});
        }
    });
};

require('../db/init');
var userModel = require('../db/models/user'); 
var User = db.model('User', userModel.UserSchema);

exports.list = function(req, res, next) {
    console.log("handler 'listUsers'");

    User.find({}, function(err, userList) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving User: " + err);
            //TODO: Don't retardedly concatenate to an empty string
            res.send({error: "" + err});
        } else {
            console.log("All users retrieved.");
            res.send(userList);
        }
    });
};

exports.remove = function(req, res, next) {
    console.log("handler 'deleteUser'");

    User.remove({_id: req.params.userId}, function(err, user) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Deleting User: " + err);
            res.send({error: "" + err});
        } else {
            console.log("User: " + req.params.userId + " deleted.");
            res.send({"deleted": req.params.userId});
        }
    });
};

exports.single = function(req, res, next) {
    console.log("handler 'singleUser'");

    User.findById(req.params.userId, function(err, user) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving User: " + err);
            res.send({error: "" + err});
        } else {
            console.log("User: " + req.params.userId + " retrieved.");
            res.send(user);
        }
    });
};

exports.modify = function(req, res, next) {
    console.log("handler 'modifyUser'");
    console.log("User ID: " + req.params.userId);

    User.findByIdAndUpdate(req.params.userId, { $set: req.params.toUpdate}, function(err, numberAffected, rawResponse) {
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
    console.log("handler 'createUser'");

    //Inputs are validated as needed in the model
    //TODO: Figure out authentication!
    
    console.log("params: \n%j", req.params);

    var newUser = new User({
        _phoneId: req.params._phoneId,
        displayName: req.params.displayName,
        address: req.params.address,
        phoneNumber: req.params.phoneNumber,
        dateJoined: req.params.dateJoined,
        lastLogin: req.params.lastLogin,
        lastActivity: req.params.lastActivity,
        groups: req.params.groups,
        isAdmin: req.params.isAdmin
    });

    newUser.save(function(err) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Saving User: " + err);
            res.send({error: "" + err});
        } else {
            console.log("User: " + newUser._id + " created successfully.");
            res.send({information: "users page", userId: newUser._id});
        }
    });
};

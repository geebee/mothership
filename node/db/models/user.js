//Module dependencies.
var commonHooks = require('../hooks/common');
var createdAndModifiedDates = require('../plugins/createdAndModifiedDates');
var version = require('../plugins/version');
//var generateRSAKeypair = require('../plugins/generateRSAKeypair');
var generateSHA512Hash= require('../plugins/generateSHA512Hash');

//Schema definition
var UserSchema = new mongoose.Schema({
    //_phoneId: {type: mongoose.Schema.Types.ObjectId, required: true},
    _phoneId: {type: String, required: true},
    displayName: {type: String, required: true},
    address: {
        line1: {type: String, required: true},
        line2: {type: String},
        city: {type: String, required: true},
        stateOrProvince: {type: String, required: true},
        zipOrPostalCode: {type: String, required: true},
        latitude: {type: Number},
        longitude: {type: Number}
    },
    phoneNumber: {type: String, required: true},
    dateJoined: {type: Date, required: true},
    lastLogin: {type: Date, required: true},
    lastActivity: {type: Date, required: true},
    groups: [String],
    isAdmin: {type: Boolean, required: true, default: false}
});

UserSchema.plugin(createdAndModifiedDates);
UserSchema.plugin(version);
//UserSchema.plugin(generateRSAKeypair);
UserSchema.plugin(generateSHA512Hash);

//Pre hook.
UserSchema.pre('save', function(next) {
    commonHooks.preSave();
    next();
});

//Define and export the model
mongoose.model('User', UserSchema);
module.exports.UserSchema = UserSchema;

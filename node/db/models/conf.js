//Module dependencies
var commonHooks = require('../hooks/common');
var createdAndModifiedDates = require('../plugins/createdAndModifiedDates');
var version = require('../plugins/version');

//Schema definition
var ConfSchema = new mongoose.Schema({
    legalName: {type: String, required: true},
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
    contact: {
        salutation: {type: String, enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.']},
        name: {
            first: {type: String, required: true},
            last: {type: String, required: true}
        },
        title: {type: String},
        phone: {type: String, required: true},
        fax: {type: String},
        email: {type: String, required: true}
    }
});

ConfSchema.plugin(createdAndModifiedDates);
ConfSchema.plugin(version);

//Pre hook.
ConfSchema.pre('save', function(next) {
    commonHooks.preSave();
    //TODO: Add conf specific pre-save hook logic
    next();
});

//Define and export the model
mongoose.model('Conf', ConfSchema);
module.exports.ConfSchema = ConfSchema;

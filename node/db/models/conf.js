//Module dependencies
var createdAndModifiedDates = require('../plugins/createdAndModifiedDates');
var version = require('../plugins/version');

//Schema definition
var ConfSchema = new mongoose.Schema({
    hostIdentification: {
        friendlyName: {type: String, required: true, unique: true, index:true},
        fqdn: {type: String, required: true, index:true},
        ip: {type: String, required: true, index:true},
        url: {type: String, required: true, index:true},
    },
    properties: {}
});

ConfSchema.plugin(createdAndModifiedDates);
ConfSchema.plugin(version);

//Pre hook.
ConfSchema.pre('save', function(next) {
    //TODO: Add conf specific pre-save hook logic
    next();
});

//Define and export the model
mongoose.model('Conf', ConfSchema);
module.exports.ConfSchema = ConfSchema;

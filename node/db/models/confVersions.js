//Module dependencies
var createdAndModifiedDates = require('../plugins/createdAndModifiedDates');

//Schema definition
var ConfVersionsSchema = new mongoose.Schema({
    confReference: {
        _id: mongoose.Schema.Types.ObjectId,
        _version: Number
    },
    hostIdentification: mongoose.Schema.Types.Mixed,
    properties: [mongoose.Schema.Types.Mixed]
});

ConfVersionsSchema.plugin(createdAndModifiedDates);

//Pre hook.
ConfVersionsSchema.pre('save', function(next) {
    //TODO: Add conf version specific pre-save hook logic
    next();
});

//Define and export the model
mongoose.model('ConfVersions', ConfVersionsSchema);
module.exports.ConfVersionsSchema = ConfVersionsSchema;

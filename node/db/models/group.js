//Module dependencies.
var commonHooks = require('../hooks/common');
var createdAndModifiedDates = require('../plugins/createdAndModifiedDates');
var version = require('../plugins/version');

//Schema definition
var GroupSchema = new mongoose.Schema({
    name: {type: String, required: true},
    permissions: [mongoose.Schema.Types.Mixed]
});

GroupSchema.plugin(createdAndModifiedDates);
GroupSchema.plugin(version);

//Pre hook.
GroupSchema.pre('save', function(next) {
    commonHooks.preSave();
    next();
});

//Define and export the model
mongoose.model('Group', GroupSchema);
module.exports.GroupSchema = GroupSchema;

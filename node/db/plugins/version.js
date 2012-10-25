module.exports = exports = function version (schema, options) {
    schema.add({version: {type: Number, min: 0}});

    schema.pre('save', function (next) {
        if (this.isNew) {
            this.version = 1; 
        } else {
            this.version += 1;
        }
        next();
    });

    if (options && options.index) {
        schema.path('version').index(options.index);
    }
};

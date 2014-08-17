module.exports = exports = function createdAndModifiedDates (schema, options) {
    schema.add({createdDate: {type: Date}});
    schema.add({modifiedDate: {type:Date}});

    schema.pre('save', function (next) {
        if (this.isNew) {
            this.createdDate = new Date();
        }
        this.modifiedDate = new Date();
        next();
    });

    if (options && options.index) {
        schema.path('createdDate').index(options.index);
        schema.path('modifiedDate').index(options.index);
    }
};

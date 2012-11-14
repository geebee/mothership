var confHandler = require("../handlers/confHandler");

module.exports = function(apiServer){
    apiServer.get('/conf', confHandler.list);
    apiServer.post('/conf', confHandler.create);

    apiServer.get('/conf/:friendlyName', confHandler.single);
    apiServer.del('/conf/:friendlyName', confHandler.remove);

    apiServer.put('/conf/:friendlyName/property', confHandler.updateProperty);
    apiServer.del('/conf/:friendlyName/property', confHandler.removeProperty);

    apiServer.put('/conf/:friendlyName/host', confHandler.modifyHost);
};

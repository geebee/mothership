var confHandler = require("../handlers/confHandler");

module.exports = function(apiServer){
    apiServer.get('/conf', confHandler.list);
    apiServer.post('/conf', confHandler.create);
    apiServer.get('/conf/:confId', confHandler.single);
    apiServer.put('/conf/:confId', confHandler.modify);
    apiServer.del('/conf/:confId', confHandler.remove);
};

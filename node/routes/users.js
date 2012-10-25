var userHandler = require("../handlers/userHandler");

module.exports = function(apiServer){
    apiServer.get('/users', userHandler.list);
    apiServer.post('/users', userHandler.create);
    apiServer.get('/users/:userId', userHandler.single);
    apiServer.put('/users/:userId', userHandler.modify);
    apiServer.del('/users/:userId', userHandler.remove);
};

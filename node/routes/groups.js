var groupHandler = require("../handlers/groupHandler");

module.exports = function(apiServer){
    apiServer.get('/groups', groupHandler.list);
    apiServer.post('/groups', groupHandler.create);
    apiServer.get('/groups/:groupId', groupHandler.single);
    apiServer.put('/groups/:groupId', groupHandler.modify);
    apiServer.del('/groups/:groupId', groupHandler.remove);

    apiServer.get('/groups/:groupId/permissions', groupHandler.listPermissions);
    apiServer.put('/groups/:groupId/permissions', groupHandler.addPermission);
    apiServer.del('/groups/:groupId/permissions', groupHandler.removePermission);
};

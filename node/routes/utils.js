var utilHandler = require("../handlers/utilHandler");

module.exports = function(apiServer){
    apiServer.get('/', utilHandler.index);
    apiServer.get('/status', utilHandler.status);
    apiServer.get('/test', function(req, res, next) {
        res.send({"message": "success"});
    });

    apiServer.get('/search', utilHandler.search);
    //apiServer.get('/wordCloud', utilHandler.wordCloud);
};

//External Library Includes
var restify = require("restify");

//DB Intialization
require("./db/init");

//Restify Initial Configuration
var apiServer = restify.createServer({
    name: 'mothership',
    version: '0.0.1'
});

//Restify Options
apiServer.use(restify.acceptParser(apiServer.acceptable));
apiServer.use(restify.queryParser({ mapParams: true}));
apiServer.use(restify.bodyParser({ mapParams: true}));
apiServer.use(restify.authorizationParser());

//Pre-Routing Functions (Authenticate and Authorize)
var authenticate = require('./aaa/authenticate');
var authorize = require('./aaa/authorize');
apiServer.use(authenticate.simpleStub);
//apiServer.use(authenticate.validateSignature);
apiServer.use(authorize.simpleStub);
//apiServer.use(authorize.authorizeRequest);
//apiServer.use(authorize.isAdmin);

//Routes 
require('./routes/utils')(apiServer);
require('./routes/conf')(apiServer);
require('./routes/users')(apiServer);
require('./routes/groups')(apiServer);

//Post-Routing Functions (Audit)
/*
apiServer.on('after', restify.auditLogger({
    log: bunyan.createLogger({
        level: 'info',
        stream: process.stdout
    });
});
*/

//Start the Restify Server
apiServer.listen(8889, function() {
    console.log('%s listening at %s', apiServer.name, apiServer.url);
});

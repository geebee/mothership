var dashboardHandler = require("../handlers/dashboardHandler");

module.exports = function(apiServer){
    apiServer.get('/dashboard/totals', dashboardHandler.totals);
};

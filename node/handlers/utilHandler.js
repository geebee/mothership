exports.index = function(req, res, next) {
    console.log("handler 'index'");

    res.send({information: "index page"});
};

exports.status = function(req, res, next) {
    console.log("handler 'status'");

    res.send({
        process: process.execPath,
        cwd: process.cwd(),
        pid: process.pid,
        uptime: process.uptime(),
        versions: process.versions,
        gid: process.getgid(),
        uid: process.getuid(),
        memory: process.memoryUsage()
    });
};

exports.search = function(req, res, next) {
    console.log("handler 'search'");

    require('../db/init');
    var confModel = require('../db/models/conf'); 
    var Conf = db.model('Conf', confModel.ConfSchema);
    console.log("Query: %s", req.params.query);

    if (req.params.query){
        Conf.find({$or: [{"hostIdentification.friendlyName": /^[a-zA-Z0-9_\-.:]{3,}$/}, {"hostIdentification.fqdn": /^[a-zA-Z0-9_\-.:]{3,}$/}, {"hostIdentification.ip": /^[a-zA-Z0-9_\-.:]{3,}$/}, {"hostIdentification.url": /^[a-zA-Z0-9_\-.:]{3,}$/}]}, 'hostIdentification.friendlyName hostIdentification.fqdn hostIdentification.ip hostIdentification.url', function(err, confList) {
            if (err) { //TODO: Handle the error for real
                console.log("Error Retrieving all confs: " + err);
                //TODO: Don't retardedly concatenate to an empty string
                res.send({error: "" + err});
            } else {
                console.log("All confs retrieved.");
                var searchTerms = [];
                confList.forEach(function(searchTerm){
                    searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.friendlyName});
                    searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.fqdn});
                    searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.ip});
                    searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.url});
                });
                res.send({found: searchTerms});
            }
        });
    }
}

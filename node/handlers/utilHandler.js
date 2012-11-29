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

exports.wordCloud = function(req, res, next) {
    console.log("handler 'wordCloud'");

    require('../db/init');
    var confModel = require('../db/models/conf'); 
    var Conf = db.model('Conf', confModel.ConfSchema);
    console.log("Query: %s", req.params.query);

    var startTime = Date.now();

    Conf.find({},
    {
        _id: false,
        "hostIdentification.friendlyName" : true,
        "hostIdentification.fqdn" : true,
        "hostIdentification.ip" : true,
        "hostIdentification.url" : true,
        "hostIdentification.environment" : true,
    },
    function(err, confList) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving all confs: " + err);
            //TODO: Don't retardedly concatenate to an empty string
            res.send({error: "" + err});
        } else {
            console.log("Matched words returned from mongo in: %sms.", Date.now() - startTime);
            var cloudWords = [];
            confList.forEach(function(cloudWord){
                console.log("Cloud Word: %s", cloudWord); 

                cloudWords.push(cloudWord.hostIdentification.friendlyName);
                cloudWords.push(cloudWord.hostIdentification.fqdn);
                cloudWords.push(cloudWord.hostIdentification.ip);
                cloudWords.push(cloudWord.hostIdentification.url);
                cloudWords.push(cloudWord.hostIdentification.environment);
            });
            res.send({found: cloudWords});
        }
    });
}
exports.search = function(req, res, next) {
    console.log("handler 'search'");

    require('../db/init');
    var confModel = require('../db/models/conf'); 
    var Conf = db.model('Conf', confModel.ConfSchema);
    console.log("Query: %s", req.params.query);

    if (req.params.query){
        var startTime = Date.now();

        Conf.find({$or: [
            {"hostIdentification.friendlyName": /^[a-zA-Z0-9%=+_\-.:]{3,}$/},
            {"hostIdentification.fqdn": /^[a-zA-Z0-9%=+_\-.:]{3,}$/},
            {"hostIdentification.ip": /^[a-zA-Z0-9%=+_\-.:]{3,}$/},
            {"hostIdentification.url": /^[a-zA-Z0-9%=+_\-.:]{3,}$/},
            {"hostIdentification.environment": /^[a-zA-Z0-9%=+_\-.:]{3,}$/}
        ]},
        {
            _id: false,
            "hostIdentification.friendlyName" : true,
            "hostIdentification.fqdn" : true,
            "hostIdentification.ip" : true,
            "hostIdentification.url" : true,
            "hostIdentification.environment" : true,
        },
        function(err, confList) {
            if (err) { //TODO: Handle the error for real
                console.log("Error Retrieving all confs: " + err);
                //TODO: Don't retardedly concatenate to an empty string
                res.send({error: "" + err});
            } else {
                console.log("Matched confs returned from mongo in: %sms.", Date.now() - startTime);
                var searchTerms = [];
                confList.forEach(function(searchTerm){
                    console.log("Search Term: %s", searchTerm); 
                    if (searchTerm.hostIdentification.friendlyName.indexOf(req.params.query) !== -1) {
                        searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.friendlyName});
                    }
                    if (searchTerm.hostIdentification.fqdn.indexOf(req.params.query) !== -1) {
                        searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.fqdn});
                    }
                    if (searchTerm.hostIdentification.ip.indexOf(req.params.query) !== -1) {
                        searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.ip});
                    }
                    if (searchTerm.hostIdentification.url.indexOf(req.params.query) !== -1) {
                        searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.url});
                    }
                    if (searchTerm.hostIdentification.environment.indexOf(req.params.query) !== -1) {
                        searchTerms.push({"friendlyName": searchTerm.hostIdentification.friendlyName, "term": searchTerm.hostIdentification.environment});
                    }
                });
                res.send({found: searchTerms});
            }
        });
    }
}

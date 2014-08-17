var Handler = require("./Handler");

var createParams = [
  {name: "hostIdentification", type: "object", values: [
    {name: "friendlyName", type: "string"},
    {name: "fqdn", type: "string"},
    {name: "ip", type: "string"},
    {name: "url", type: "string"}
  ]},
  {name: "properties", type: "array"}
];
var confHandler = new Handler("conf", createParams);

exports.list = confHandler.list;
exports.remove = confHandler.remove;
exports.single = confHandler.single;
exports.create = confHandler.create;

exports.getVersions = function(req, res, next) {
    console.log("handler 'getConfVersions'");
    ConfVersions.find({"hostIdentification.friendlyName": req.params.friendlyName},
    {"confReference.v": true, "createdDate": true, _id: false}, 
    {sort: {"confReference.v": -1}},
    function(err, confList) {
        if (err) { //TODO: Handle the error for real
            console.log("Error Retrieving all confs: " + err);
            //TODO: Don't retardedly concatenate to an empty string
            res.send({error: "" + err});
        } else {
            console.log("All confs retrieved.");
            var returnableData = [];
            confList.forEach(function(cV){
                returnableData.push({"version": cV.confReference.v, "timestamp": cV.createdDate});
            });
            res.send(returnableData);
        }
    });
};


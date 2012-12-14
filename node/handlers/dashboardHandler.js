exports.totals = function(req, res, next) {
  console.log("handler 'dashboard - totals'");

  require('../db/init');
  var confModel = require('../db/models/conf'); 
  var Conf = db.model('Conf', confModel.ConfSchema);
  var confVersionsModel = require('../db/models/confVersions'); 
  var ConfVersions = db.model('ConfVersions', confVersionsModel.ConfVersionsSchema);

  var startTime = Date.now();

  var totalCounts = { "configs": 0, "revisions": 0 , "environments": 0};
  Conf.count({},function(err, cCount) {
    if (err) { //TODO: Handle the error for real
      console.log("Error Retrieving conf count: " + err);
      //TODO: Don't retardedly concatenate to an empty string
      res.send({error: "" + err});
    } else {
      console.log("Count of configs returned from mongo in: %sms.", Date.now() - startTime);
      totalCounts.configs = cCount;
      ConfVersions.count({},function(err, rCount) {
        if (err) { //TODO: Handle the error for real
          console.log("Error Retrieving revision count: " + err);
          //TODO: Don't retardedly concatenate to an empty string
          res.send({error: "" + err});
        } else {
          console.log("Count of revisions returned from mongo in: %sms.", Date.now() - startTime);
          totalCounts.revisions = rCount;
          Conf.distinct("hostIdentification.environment").count().exec(function (err, eCount) {
              if (err) { //TODO: Handle the error for real
                console.log("Error retrieving distinct environments: " + err);
                //TODO: Don't retardedly concatenate to an empty string
                res.send({error: "" + err});
              } else {
                console.log("Count of distinct environments returned from mongo in: %sms.", Date.now() - startTime);
                totalCounts.environments = eCount;
                res.send(totalCounts);
              }
          });
        }
      });
    }
  });
}

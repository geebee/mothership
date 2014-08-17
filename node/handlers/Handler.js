function Handler(name, createParams) {
  var self = this;
  self.name = name;
  self.ucName = self.name[0].toUpperCase() + self.name.slice(1);
  self.createParams = createParams;

  require('../db/init');
  var dbModel = require('../db/models/' + self.name); 
  var dbObject = db.model(self.ucName, dbModel[self.ucName + "Schema"]);

  self.list = function(req, res, next) {
      console.log("handler 'list" + self.ucName + "'");

      dbObject.find({}, function(err, objList) {
          if (err) {
              console.log("Error Retrieving " + self.ucName + ": " + err);
              res.send({error: "" + err});
          } else {
              console.log("All " + self.ucName + "s retrieved.");
              res.send(objList);
          }
      });
  };

  self.remove = function(req, res, next) {
      console.log("handler 'delete" + self.ucName + "'");
      
      //TODO: Validate (sanitize) req.params.objId
      dbObject.remove({_id: req.params.objId}, function(err, obj) {
          if (err) {
              console.log("Error Deleting " + self.ucName + ": " + err);
              res.send({error: "" + err});
          } else {
              console.log(self.ucName + ": " + req.params.objId + " deleted.");
              res.send({"deleted": req.params.objId});
          }
      });
  };

  self.single = function(req, res, next) {
      console.log("handler 'single" + self.ucName + "'");

      dbObject.findById(req.params.objId, function(err, obj) {
          if (err) {
              console.log("Error Retrieving " + self.ucName + ": " + err);
              res.send({error: "" + err});
          } else {
              console.log(self.ucName + ": " + req.params.objId + " retrieved.");
              res.send(obj);
          }
      });
  };

  self.modify = function(req, res, next) {
      console.log("handler 'modify" + self.ucName + "'");
      console.log(self.ucName + " ID: " + req.params.objId);

      dbObject.findByIdAndUpdate(req.params.objId, { $set: req.params.toUpdate}, function(err, numberAffected, rawResponse) {
          if (err) {
              console.log("Error Updating " + self.ucName + ": " + err);
              res.send({error: "" + err});
          } else {
              console.log("Update Completed. Affected Documents: " + numberAffected);
              res.send({"status": "successful", "modifiedObjectId": req.params.objId});
          }
      });
  };

  self.create = function(req, res, next) {
      console.log("handler 'create" + self.ucName + "'");

      //Fancy and extensible parameter map
      /* This is an example createParams array that covers most of what you'd want to do
       * Note that only type 'object' vas the values array available
      var createParams = [
        {name: "higherLevelObject", type: "object", values: [
          {name: "someString", type: "string"},
          {name: "anInteger", type: "integer"}
        ]},
        {name: "properties", type: "array"}
      ];
      */
      var createParamsMap = {};
      createParams.forEach(function(param, index){
        if (param.type === "object") {
          console.log("parameter is an object");
          createParamsMap[param.name] = {};
          for(subParam in param.values) {
            console.log("Param: %s, subParam: %s", param.name, subParam.name);
            createParamsMap[param.name][subParam.name] = req.params[subParam.name];
          };
        };
        createParamsMap[param.name] = req.params[param.name];
      });

      /* Flat list... boring, simple, unflexible (no nesting)
      var createParamsMap = {};
      for (param in self.createParams) {
        createParamsMap[param] = req.params[param];
      };
      */
      //Inputs are validated as needed in the model
      var newDbOjbect = new dbObject(createParamsMap);

      newDbOjbect.save(function(err) {
          if (err) {
              console.log("Error Saving new " + self.ucName + ": " + err);
              res.send({error: "" + err});
          } else {
              console.log(self.ucName + ": " + newDbOjbect._id + " created successfully.");
              res.send({information: self.name + " page", objectId: newDbOjbect._id});
          }
      });
  };
};

module.exports = Handler;

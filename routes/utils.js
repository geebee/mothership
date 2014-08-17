module.exports = function(apiServer){
    apiServer.get('/', function(req, res, next) {
      res.send("API Root");
    });
    apiServer.get('/status', function(req, res, next) {
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
    });
    apiServer.get('/test', function(req, res, next) {
        res.send({message: "success"});
    });
};

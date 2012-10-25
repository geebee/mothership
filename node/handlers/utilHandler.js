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

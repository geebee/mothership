module.exports.simpleStub = function simpleStub (req, res, next) {
    console.log('about to authenticate (stub method)');
    console.log('headers:\n %j', req.headers);
    if (!req.authorization.scheme || req.authorization.scheme === undefined) {
        console.log('no valid way to parse the authorization header (or it is missing entirely)');
    } else {
        console.log('authentication scheme: ' + req.authorization.scheme); 
        console.log('credentials: ' + req.authorization.credentials);
    }
    return next();
};

module.exports.validateSignature = function validateSignature(req, res, next) {
    var httpSignature = require('http-signature');

    if (!req.authorization.scheme || !req.authorization.scheme === "Signature") {
        console.log("Signature Authentication not requested, but required. Issuing 401.");
        return res.send(401);
    }
    
    var parsed = httpSignature.parseRequest(req);
    console.log("parsed: \n%j", parsed);

    if (!httpSignature.verifySignature(parsed, "pass")) {
        console.log("Signature Verification Failed. Issuing 401");
        return res.send(401);
    } else {
        console.log("Authentication Succeeded.");
        return next();
    }
};

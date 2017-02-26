var loggedOut = function(req, res, next){
    if(req.session.userId){
        return res.redirect('/profile');
    } else {
        return next();
    }
}

module.exports.loggedOut = loggedOut;

var loggedIn = function(req, res, next){
    if(!req.session.userId){
        var err = new Error("user needs to be logged in");
        res.status = 403;
        next(err)
    } else {
        return next();
    }
}

module.exports.loggedIn = loggedIn;

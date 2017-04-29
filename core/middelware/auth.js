module.exports = {
    isAuth: function(req, res, next){
        if(!req.user){
            res.send("BOOM");
        }
        else{
            next();
        }
    },
    isRole: function(role){
        return function(req, res, next){
            
            if(!user)
                return res.send("401");

            if(req.user.role != role){
                return res.send("403");
            }

            next();

        }
    }
}
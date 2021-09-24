const User = require('../models/User');

module.exports = {
    getUserLink : async(req,res) => {
        const {userId} = req.params;
        const user = await User.findOne({_id : userId});
        if(user != undefined){
            res.render('link', {link:user.userHash, name : " "+user.name});
        }
    }
}
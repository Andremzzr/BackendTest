const User = require('../models/User');

const {sendLink} = require('./EmailController');
module.exports = {
    getUserLink : async(req,res) => {
        const {userId} = req.params;
        const user = await User.findOne({_id : userId});
        if(user != undefined){
            res.render('link', {link:user.userHash, name : " "+user.name});
        }
    },


    comfirmUser : async(req,res) => {
        const {userHash} = req.params;
        const userComfirmed = await User.findOne({userHash: userHash});
        const emailLink = `http://localhost:5000/form/${userComfirmed.userHash}/signin`;
        sendLink(emailLink,userComfirmed.email);
        res.redirect(`/link/generateLink/${userComfirmed._id}`);  
        const userUpdated = await User.updateOne({userHash: userHash},{
            comfirmed : true
        })
        
             
    }
}
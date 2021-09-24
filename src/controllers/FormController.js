const User = require('../models/User');
const {sendLink} = require('./EmailController');

String.prototype.hashCode = function() {
    var hash = 0;
    
    if (this.length == 0) {
        return verifyHash(hash);
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; 
    }
    return verifyHash(hash);
}

function verifyHash(hash){
    return parseInt(hash) > 0 ? hash : Math.abs(parseInt(hash));
}

function haveNumber(name){
   const nameArray = name.split('');
   const comparationArray = ['1','2','3','4','5','6','7','8','9','0','*'];
   for (let i = 0; i < nameArray.length; i++) {
       const letter = nameArray[i];
       if(comparationArray.includes(letter)){
           return true;
       }
   } 

   return false;
}



module.exports = {

    registerUser : async (req,res) => {
        const { name,email,phone}  = req.body
        
        try {
            const user = await User.findOne({$or:[{phone : phone},{email: email}]});
            if(user == null){
                if(!phone.startsWith('9')){
                    res.redirect('/form/signin');
                    return;
                }
                else if(haveNumber(name)){
                    res.redirect('/form/signin');
                    return;
                }
                
                const newLink = email.split('@')[0].hashCode();

                const newUser = new User({
                    name : name,
                    email : email,
                    phone: phone,
                    points: 1,
                    userHash: newLink
                });

                const linkToEmail = `localhost:5000/form/${newLink}/signin`;
                
                newUser.save()
                .then( user => {
                    console.log(user);
                    console.log(`User ${name} has entered into the competition;`);
                    sendLink(linkToEmail,newUser.email);
                    res.redirect(`/link/${user._id}`); 
                })
                .catch(
                    err =>{
                        console.log(err);
                        res.redirecct('/form/signin');
                    } 
                );
            }
            else{
                console.log('This user has already been registered');
                res.redirect('/form/signin');
            }
           
        } catch (error) {
            console.log(error);
        }
        
    },
    sendUserToThirdPartyForm: async (req,res) => {
        const {userHash} = req.params;  
        const thirdParty = await User.findOne({userHash: userHash});
        if(thirdParty != null){
            console.log(thirdParty);
            res.render('thirdlink', {name:thirdParty.name, hash : userHash});
        }
        else{
            console.log('This third party does not exists');
            res.redirect('/');
        }
       
    },
    /**
     * Register a user that entered by a User Link
     */
    registerUserInDataBaseByThirdParty : async(req,res) => {
        const {thirdPartyHash} = req.params;
        const { name,email,phone}  = req.body

        try {
            const user = await User.findOne({$or:[{phone : phone},{email: email}]});
            const thirdPartyUser = await User.findOne({userHash: thirdPartyHash});

            if(user == null){
                if(!phone.startsWith('9')){
                    res.redirect('/form/signin');
                    return;
                }
                else if(haveNumber(name)){
                    res.redirect('/form/signin');
                    return;
                }

                //CRAETE HASH FOR USER
                const newHash = email.split('@')[0].hashCode();

                const newUser = new User({
                    name: name,
                    email: email,
                    phone: phone,
                    userHash: newHash,
                    points: 1
                });


                newUser.save()
                .then(
                    user => {
                        console.log(user);
                        sendLink(linkToEmail,newUser.email);

                        User.updateOne({userHash: thirdPartyHash},{
                            points : thirdPartyUser.points + 1
                        })
                        .then(newThirdPartyUser => {
                            console.log(`${thirdPartyUser.name} points : ${newThirdPartyUser}`);
                        });
                        res.redirect(`/link/${user._id}`);
                    }
                )
                .catch(err => {
                    console.log(err);
                    res.redirect(`/form/sendDatabyThirdParty/${thirdPartyHash}`);
                })
            }
            else{
                console.log('This user has already been registered');
                res.redirect('/form/signin');
            }
           
        } catch (error) {
            console.log(error);
        }
    },



    returnWinners : async(req,res) => {
        try {
            const dateObj = new Date;
            const dateArray = dateObj.toLocaleDateString('pt-BR').split('/');
            const date = `${dateArray[0]}/${dateArray[1]}`; 
            console.log(date);
            
            if(date != '24/09'){
                res.render('leader', {players : false});
            }
            else{
                //GET 10 PLAYERS WITH THE MOST POINTS
                const winners = await User.find({});
                const playersLeaderboard = winners.sort((a,b) => b.points - a.points);
                
                const top10Leaderboard = [];
                
                for (let i = 0; i < 10; i++) {
                    const player = playersLeaderboard[i];
                    top10Leaderboard.push(player);
                }

                console.log(typeof(top10Leaderboard));
                res.render('leader', {players: top10Leaderboard});
            }
        } catch (err) {
            console.log(err);
        }
    }
}
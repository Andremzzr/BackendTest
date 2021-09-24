const nodemailer = require('nodemailer');
const SMTP_CONFIG = require('../config/smtp');

const transporter = nodemailer.createTransport({
    host : SMTP_CONFIG.host,
    port: SMTP_CONFIG.port,
    secure: false,
    auth :{
        user : SMTP_CONFIG.user,
        pass : SMTP_CONFIG.password
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports  = {
    sendLink : async (link,email) => {
        transporter.sendMail({
            from: 'Backend Test <dedesn4rfx@gmail.com>',
            to :  email,
            subject: "Your registration link for the competition",
            text : `Hello, thanks for joining us in this competition, here is your link to share with your friends : ${link}`
        })
        .then(message => console.log(message))
        .catch(err => console.log(err));
    }

    
}
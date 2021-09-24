const express = require('express');
const router = express.Router();

const {
    registerUser,
    sendUserToThirdPartyForm,
    registerUserInDataBaseByThirdParty,
    returnWinners
} = require('../controllers/FormController');


router.get('/signin', async(req,res) => {
    res.render('signin');
});

router.get('/:userHash/signin', sendUserToThirdPartyForm);

router.post('/sendDatabyThirdParty/:thirdPartyHash', registerUserInDataBaseByThirdParty )
router.post('/sendData', registerUser);

router.get('/winners', returnWinners );



module.exports = router;
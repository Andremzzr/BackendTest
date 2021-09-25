const express = require('express');
const router = express.Router();

const {
    getUserLink,
    comfirmUser
} = require('../controllers/LinksController');


router.get('/generateLink/:userId', getUserLink);

router.get('/register/:userHash', comfirmUser);

router.get('/wait', async(req,res) => {
    res.render('wait');
})
module.exports = router;
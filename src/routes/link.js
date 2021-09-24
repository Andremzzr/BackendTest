const express = require('express');
const router = express.Router();

const {
    getUserLink
} = require('../controllers/LinksController');


router.get('/:userId', getUserLink);


module.exports = router;
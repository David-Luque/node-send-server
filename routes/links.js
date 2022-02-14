const express = require('express');
const router = express.Router();
const linksController = require('../controllers/linksController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/',
    [
        check('origin_name', 'Select any file').not().isEmpty(),
        check('name', 'Select any file').not().isEmpty()
    ],
    auth,
    linksController.newLink
);

router.get('/',
    auth,
    linksController.allLinks
);

router.get('/:url',
    linksController.hasPass,
    linksController.getLink
);

router.post('/:url',
    linksController.verifyPassword,
    linksController.getLink
);

module.exports = router;
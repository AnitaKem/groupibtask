var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var db = require('../DbSchema');

// get all users
router.get('/', VerifyToken, function (req, res) {
    db.User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// Get a single user
router.get('/:id', VerifyToken, function (req, res) {    
    db.User.findById(req.params.id, function (err, user) {        
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        user.password = null;
        res.status(200).send(user);
    });
});

module.exports = router;
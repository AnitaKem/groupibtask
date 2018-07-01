var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../DbSchema');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', function(req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    db.User.create({
      name : req.body.name,
      email : req.body.email,
      password : hashedPassword,
      permissions: req.body.permissions,      
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
      // create a token
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ auth: true, token: token });
    }); 
  });

  router.post('/login', function(req, res) {    
    db.User.findOne({ email: req.body.email }, function (err, user) {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');
      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
      var token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({ id: user._id, auth: true, token: token });
    });
  });

  // add the middleware function
  router.use(function (user, req, res, next) {
    res.status(200).send(user);
  });

module.exports = router;
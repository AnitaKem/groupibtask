var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var db = require('../DbSchema');

// get all records
router.get('/', VerifyToken, function (req, res) {    
    let record = {};
    if(req.query.userId) record['user'] = req.query.userId;
    if(req.query.sectionId) record['section'] = req.query.sectionId;
    db.Record.find(record).populate({ path: 'user', model: db.User }).exec(function (err, records) {
        if (err) return res.status(500).send("There was a problem finding the records.");
        records.forEach(rec => { if(rec.user) rec.user.password = null});
        res.status(200).send(records);
    });
});

// Get a single record
router.get('/:id', VerifyToken, function (req, res) {    
    req.query.sectionId
    db.Record.findById(req.params.id, function (err, record) {        
        if (err) return res.status(500).send("There was a problem finding the record.");
        if (!record) return res.status(404).send("No record found.");
        res.status(200).send(record);
    });
});

// add new record
router.post('/', VerifyToken, function(req, res) {   
    db.User.findById(req.body.user.id , function(err, user){        
        if(err || !user) return res.status(500).send("User was not found.");        
        db.Record.create({
            time: Date.now(),
            text: req.body.text,
            section: req.body.section,
            user: user  
          },
          function (err, record) {
            if (err) return res.status(500).send("There was a problem adding the record.");
            res.status(200).send(record);
          });
    });
    
    
  });

module.exports = router;
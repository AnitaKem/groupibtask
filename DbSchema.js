var mongoose = require('mongoose'), 
    Schema = mongoose.Schema;  

var UserSchema = new mongoose.Schema({  
  name: String,
  email: String,
  password: String,
  records: [{ type: Schema.Types.ObjectId, ref: 'Record' }],
  permissions: [{ action: Number}]
});

var RecordSchema = new mongoose.Schema({
  time: Date,
  user: { type: Schema.Types.ObjectId, ref: 'User'},
  text: String,
  section: Number
});

var User = mongoose.model('User', UserSchema);
var Record = mongoose.model('Record', RecordSchema);

module.exports = {
  User : User,
  Record : Record
};
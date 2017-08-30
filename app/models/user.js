
const
  mongoose = require('mongoose'),
  Bluebird = require('bluebird');

const Schema = mongoose.Schema;


const UserSchema = new Schema({

  user_id: { type: String, required: true, index: true, unique: true },

}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'modified_at' }
});

const User = mongoose.model('User', UserSchema);

Bluebird.promisifyAll(User);
Bluebird.promisifyAll(User.prototype);


module.exports = User;

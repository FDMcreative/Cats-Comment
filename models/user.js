const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const commentSchema = new mongoose.Schema({
  content: {type:String, required:true},
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User', required:true}
}, {
    timestamps: true
});

commentSchema.methods.ownedBy = function ownedBy(user) {
  return this.createdBy.id === user.id;
};

const userSchema = new mongoose.Schema({
  username: { type:String, required:true },
  name: {type:String, required:true},
  gender: {type:String},
  age: {type:Number, required:true},
  country: {type:String},
  faculty: {type:String, required:true},
  image: {type:String, required:true},
  email: { type:String, required:true },
  password: { type:String, required:true }
});

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation;
  });
//lifecycle hook - mongoose middleware
userSchema.pre('validate', function checkPassword(next) {
  if(!this._passwordConfirmation || this._passwordConfirmation !== this.password) this.invalidate('passwordConfirmation', 'does not match');
  next();
});

userSchema.pre('save', function hashPassword(next) {
  if(this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8));
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);



/////////////////////////////////////////////

const hotelSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: {
    line1: {type: String, required: true},
    line2: {type: String},
    city: {type: String, required:true},
    postcode: {type: String, required:true},
    country: {type: String, required:true}
  },
  image: {type: String, required:true},
  stars: {type: Number, required:true},
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  comments: [commentSchema]
});

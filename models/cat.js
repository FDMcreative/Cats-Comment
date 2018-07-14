const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {type: String, required: true},
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User', required: true}
}, {
    timestamps: true
  });

commentSchema.methods.ownedBy = function ownedBy(user) {
  return this.createdBy.id === user.id;
};

const catSchema = new mongoose.Schema({
  name: {type:String, required:true},
  age: {type:String},
  description: {type:String},
  images: [{type:String}],
  createdBy: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  comments: [commentSchema]
});

module.exports = mongoose.model('Cat', catSchema);

const mongoose = require('mongoose');

const UserSchema=new mongoose.Schema({
  userName:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true,
    minlength:5
  },
  CreatedAt:{
  type:Date,
  default:Date.now
}


});
module.exports=mongoose.model('User',UserSchema);

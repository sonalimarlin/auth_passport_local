var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

//Define a new schema
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

//Plugin passport local mongoose to allow UserSchema access to all built-in methods
userSchema.plugin(passportLocalMongoose);

//Export module
module.exports = mongoose.model("User", userSchema);

var User = require('../models/user');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true, useUnifiedTopology: true });

var users = [
    new User({
     email: 's@s.com',
     password: '123',
     }),
   ];
   
   var done = 0;
   for (var i = 0; i < users.length; i++) {
     users[i].save(function(err, result) {
       done++;
       if (done === users.length) {
         exit();
       }
     });
   }
   
   function exit() {
     mongoose.disconnect();
   }
   
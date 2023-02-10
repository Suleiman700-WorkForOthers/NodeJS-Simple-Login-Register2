// connect to database
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/simple-login-register', {useNewUrlParser: true});
const conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database connected successfully');
});
conn.on('disconnected',function(){
    console.log('database disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));

module.exports = mongoose
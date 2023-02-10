// create a schema for the model
const mongoose = require('mongoose');


const loginSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String
});

module.exports = { loginSchema }
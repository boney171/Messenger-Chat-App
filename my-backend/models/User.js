//Something
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
    },
    rooms: {
        type: Array,
        required: true,
    },
});

module.exports = mongoose.model('User', userSchema);
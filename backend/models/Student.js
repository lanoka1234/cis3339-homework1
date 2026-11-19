
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    courses: [{
        type: String
    }]
});

module.exports = mongoose.model('Student', studentSchema);

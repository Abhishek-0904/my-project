const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Resume'
    },
    template: {
        type: String,
        default: 'modern'
    },
    data: {
        type: Object,
        required: true
    },
    gradient: {
        type: String,
        default: 'none'
    },
    customColors: {
        type: Object,
        default: {}
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resume', ResumeSchema);

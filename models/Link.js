import mongoose from "mongoose";

const schema = mongoose.Schema;

const linkSchema = new schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    original_name: {
        type: String,
        required: true
    },
    downloads: {
        type: Number,
        default: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    password: {
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model('Link', linkSchema);
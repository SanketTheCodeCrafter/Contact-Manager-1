import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'User'
    }
}, { timestamps: true });

const UserModel = mongoose.model("User", UserSchema);
export { UserModel };

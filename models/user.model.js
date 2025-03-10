import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User Name is required"],
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email : {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
        minLength: 5,
        maxLength: 255
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;
import { validationResult } from 'express-validator';
import { UserModel } from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config({ path: '../config/.env' });

const Register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ errors: [{ msg: "User Already Existed" }] });
        }
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = new UserModel({ name, email, password: hashPassword })
        const result = await newUser.save()
        result._doc.password = undefined;

        return res.status(201).json({ success: true, ...result._doc })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message })
    }
};

const Login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const userExist = await UserModel.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ errors: [{ msg: "User Not Registered" }] });
        }

        const isPasswordOk = await bcrypt.compare(password, userExist.password);
        if (!isPasswordOk) {
            return res.status(400).json({ errors: [{ msg: "Wrong Password" }] });
        }

        const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET_KEY, { expiresIn: '3d' });
        // Exclude password from the user object
        const user = { ...userExist._doc };
        user.password = undefined;

        return res.status(201).json({ success: true, user, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

const Auth = (req, res) => {
    const user = req.user || null
    if (!user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
    const safeUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
        about: user.about,
        role: user.role,
        createdAt: user.createdAt
    }
    return res.status(200).json({ success: true, user: safeUser })
}

const updateProfile = async (req, res) => {
    try {
        const { name, email, about } = req.body;
        const userId = req.user._id;

        // Check if email is being changed and if it's already taken
        if (email) {
            const existingUser = await UserModel.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId.toString()) {
                return res.status(400).json({ message: "Email already in use" });
            }
        }

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { name, email, about } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

export { Register, Login, Auth, updateProfile };
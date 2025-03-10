import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

import {JWT_SECRET, JWT_EXPIRES_IN} from "../config/env.js"

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const {name, email, password} = req.body

        const existingUser = await User.findOne({email})
        if (existingUser) {
            const error = new Error('User already exists')
            error.statusCode = 409;
            throw error
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUsers = await User.create([{name, email, password: hashedPassword}], {session})
        const token = jwt.sign({_id: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})

        session.commitTransaction()
        session.endSession()
        res.status(201).json({success: true, message: 'User Created Successfully', data: {token,  user: newUsers[0]}})
    } catch (error) {
        session.abortTransaction()
        session.endSession()
        next(error)
    }
}

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (!user) {
            const error = new Error('User not found')
            error.statusCode = 404;
            throw error
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            const error = new Error('Invalid Password')
            error.statusCode = 401;
            throw error
        }
        const token = jwt.sign({_id: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN})
        res.status(200).json({success: true, message: 'User Logged In Successfully', data: {token, user}})
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {

}
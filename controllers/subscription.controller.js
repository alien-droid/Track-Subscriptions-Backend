import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        })
        console.log(SERVER_URL)
        await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            }
        })

        res.status(201).json({success: true, data: subscription})
    } catch (error) {
        next(error)
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error('You are not authorized to access this resource')
            error.statusCode = 401;
            throw error
        }
        const subscriptions = await Subscription.find({user: req.user._id})
        res.status(200).json({success: true, data: subscriptions})
    } catch (error) {
        next(error)
    }
}
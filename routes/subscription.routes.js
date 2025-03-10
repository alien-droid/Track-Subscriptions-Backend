import { Router } from "express";
import { createSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({message: 'GET All Subscriptions'}));
subscriptionRouter.get('/:id', (req, res) => res.send({message: 'GET Subscription by ID'}));
subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.put('/:id', (req, res) => res.send({message: 'PUT Update Subscription by ID'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({message: 'DELETE Delete Subscription by ID'}));   

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);
subscriptionRouter.get('/:id/cancel', (req, res) => res.send({message: 'Cancel Subscription by ID'}));
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({message: 'Get Upcoming Renewals'}));

export default subscriptionRouter;
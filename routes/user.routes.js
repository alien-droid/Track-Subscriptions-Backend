import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', authorize, getUser);
userRouter.post('/', (req, res) => res.send({message: 'POST New User'}));
userRouter.put('/:id', (req, res) => res.send({message: 'PUT Update User by ID'}));
userRouter.delete('/:id', (req, res) => res.send({message: 'DELETE Delete User by ID'}));

export default userRouter;
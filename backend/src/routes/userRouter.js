// src/routes/userRouter.js (or .ts)
import { Router } from 'express';
import { getAllUrlsOfUser, getUserData } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';




const userRouter = Router();


userRouter.get("/me",protect,getUserData)
userRouter.get("/my/urls",protect,getAllUrlsOfUser )


export default userRouter;
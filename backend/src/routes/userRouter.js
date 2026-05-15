// // src/routes/userRouter.js (or .ts)
// import { Router } from 'express';


// const userRouter = Router();


// export default userRouter;

// src/routes/userRouter.js (or .ts)
import { Router } from 'express';
import { getUserData } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';




const userRouter = Router();


userRouter.get("/me",protect,getUserData)


export default userRouter;

import { User } from "../models/user/user.model.js"


export const getUserData = async (req,res)=>{
   try{


       let userId = req.user.id;


       if(!userId) {
           return res.status(400).json({message : "user id not found"});
       }


       const user = await User.findById(userId);


       if(!user) {
           return res.status(404).json({message : "User not found with the id"});
       }


       return res.status(200).json(user)
   }catch( err ){
       console.log("Error fetching user from db", err);
       return res.status(500).send({ message: "Internal Server Error!!"})
   }
}

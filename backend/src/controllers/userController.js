import { User } from "../models/user/user.model.js"
import { ShortURL } from "../models/shorturl.model.js"

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({
        message: "UserId not found!!",
      });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        message: "User not found!!",
      });
    }
    return res.status(200).json({
      status: "SUCCESS",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Internal Server Error!!",
    });
  }
};

export const getAllUrlsOfUser = async (req, res) => {
 try {
   const userId = req.user.id;
   if (!userId) {
     return res.status(400).json({
       message: "UserId not found!!",
     });
   }
   const user = await User.findOne({ _id: userId });
   if (!user) {
     return res.status(404).json({
       message: "User not found!!",
     });
   }
   let page = parseInt(req.query.page);
   let limit = parseInt(req.query.limit);


   const response = await ShortURL.find({ userId: userId, isActive: true })
     .sort({ createdAt: -1 })
     .skip((page - 1) * limit)
     .limit(limit);
   const totalItems = await ShortURL.countDocuments({
     userId: userId,
     isActive: true,
   });
   const totalPages = Math.ceil(totalItems / limit);


   return res.status(200).json({
     page: page,
     limit: limit,
     totalItems: totalItems,
     totalPages: totalPages,
     shortURLs: response,
   });
 } catch (err) {
   console.log(err);
   return res.status(500).send({
     message: "Internal Server Error!!",
   });
 }
};

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token.");
  }
});

// const authenticate = asyncHandler(async(req, res, next) => {
//   try {
//       // check if login token exist
//       const token = req.cookies.token
//       if(!token) {
//           res.status(401) 
//           throw new Error("Not authorized, please login")      
//          }

//       //    verify token
//       const verifiedToken = jwt.verify(token, process.env.JWT_SECRET)
//       // get user id from token
//       const user = await User.findById(verifiedToken.id).select("-password")
//       // check if user exist
//       if(!user) {
//           res.status(401)
//       throw new Error("User not found");
  
//       }
//       req.user = user
//       next()
//   } catch (error) {
//       res.status(401) 
//       throw new Error("Not authorized, please login")  
//   }
// })

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin.");
  }
};

export { authenticate, authorizeAdmin };

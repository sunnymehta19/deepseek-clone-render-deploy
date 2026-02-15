import jwt from "jsonwebtoken";
import userModel from "../model/user.js";

//for local run and custom domain
// const authMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies?.token;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: No token",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);

//     const user = await userModel
//       .findById(decoded.id)
//       .select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized: User not found",
//       });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized: Invalid token",
//     });
//   }
// };



//for render
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token",
      });
    }

    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);

    const user = await userModel
      .findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};


export default authMiddleware;

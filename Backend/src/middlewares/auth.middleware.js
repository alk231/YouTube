import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer", "").trim();
      console.log(token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    console.log("verification ongoing")
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("verification done")

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    console.log(user.fullName);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    req.userId=user._id
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid token");
  }
});

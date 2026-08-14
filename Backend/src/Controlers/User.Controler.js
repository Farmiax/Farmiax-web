import { asyncHandler } from "../Utiles/AscynHandler.js";
import { ApiError } from "../Utiles/ApiError.js";
import { User } from "../Models/User.Model.js"
import {Product} from "../Models/Product.Models.js"
import { Apiresponse } from "../Utiles/ApiResponse.js";
import { UploudOnCloundinary } from "../Utiles/cloundinary.js";
import jwt from "jsonwebtoken";
import validator from "validator";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, phone, password, address, PinCode, City, State,role ,farmeractive } =
      req.body;
      
      
    if (
      [fullName, email, phone, password, address, PinCode, City, State,role,farmeractive].some(
        (field) => field?.trim() === ""
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }
    const exitedUser = await User.findOne({
      $or: [{ phone }, { email }],
    });
    if (exitedUser) {
      throw new ApiError(409, "User's email or phone already exist");
    }
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Email Id is not valide");
    }

    if (password.length < 8) {
      throw new ApiError(
        400,
        "Password should strong and it contain minimum 8 lenght"
      );
    }
    const avatarLocalPath = req.files?.avatar?.[0]?.path ;
    let avatar = null;

    if (avatarLocalPath) {
       avatar = await UploudOnCloundinary(avatarLocalPath);
    }
    const user = await User.create({
      fullName,
      avatar:  avatar?.url || "Not Photo",
      email,
      password,
      address: address.toLowerCase(),
      phone,
      PinCode,
      City,
      State,
      role,
      farmeractive
    });
    const createUser = await User.findById(user._id).select(
      "-password  -refreshToken"
    );
    if (!createUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }
    return res
      .status(201)
      .json(new Apiresponse(201, { user: createUser }, "user registered Successfully"));
  } catch (error) {
    // If ApiError → use its status and message
    const status = error.statusCode || 500;

    return res
      .status(status)
      .json(
        new Apiresponse(status, null, error.message || "Registration failed")
      );
  }
});
const loginuser = asyncHandler(async (req, res) => {
  try {
    const  {email,password} = req.body; 
     
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "EmailId is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user's Password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const loggedInuser = await User.findById(user._id).select(
      " -password  -refreshToken"
    );
    
    return res
      .status(202)
      .json(
        new Apiresponse(
          202,
          {
            user: loggedInuser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(new Apiresponse(status, null, error.message || "Login failed"));
  }
});

const googleLogin = asyncHandler(async (req, res) => {
  try {
    const { email, fullName, avatar, role } = req.body;
    if (!email) throw new ApiError(400, "Email is required");
    
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create user
      user = await User.create({
        email,
        fullName: fullName || "Google User",
        avatar: avatar || "Not Photo",
        role: role || "customer",
        password: "google_login_" + Date.now(),
        farmeractive: role === "farmer" ? "Active" : "Inactive",
        address: "not provided",
        phone: "not provided",
        PinCode: "000000",
        City: "not provided",
        State: "not provided"
      });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInuser = await User.findById(user._id).select("-password -refreshToken");
    
    return res.status(200).json(
      new Apiresponse(200, { user: loggedInuser, accessToken, refreshToken }, "Google login successful")
    );
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message || "Google login failed"));
  }
});

const LogoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );
   

    return res
      .status(200)
      .json(new Apiresponse(200, {}, "User logged Out"));
  } catch (error) {
     const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, "Logout failed"));
  }
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // 1. Get refresh token from body or cookies
    const incomingRefreshToken =
      req.body?.refreshToken 

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    // 2. Verify refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 3. Find user
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    // 4. Match refresh token with DB
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token expired or already used");
    }

    // 5. Generate new tokens
    const { accessToken, refreshToken } =
      await generateAccessAndRefreshToken(user._id);
   

    // 7. Send response
    return res
      .status(201)
      .json(
        new Apiresponse(
          201,
          { accessToken, refreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
      const status = error.statusCode || 500;
      return res
         .status(status)
         .json(
             new Apiresponse(
                   status,
                     null,
                     error.message || "Could not refresh access token"
                   )
                 );
  }
});


const changePassword = asyncHandler(async (req, res) => {
  try {
    
    const { oldPassword, NewPassword } = req.body;
    
    
    const user = await User.findById(req.user?._id);
    
    
    const ispassword = await user.isPasswordCorrect(oldPassword);
    if (!ispassword) {
      throw new ApiError(401, "Invalid old password");
    }
    user.password = NewPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(201)
      .json(new Apiresponse(201, {}, "Password changed successfuly"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Could not change password"
        )
      );
  }
});

const updatedAccountDetail = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, phone, address, City, State, PinCode ,role ,farmeractive} = req.body;
    if (!(fullName || City || State || PinCode||role||farmeractive)) {
      throw new ApiError(401, "All fields are required");
    }
    if (!(phone || address)) {
      throw new ApiError(401, "All fields are required");
    }
    if (email && !validator.isEmail(email)) {
      throw new ApiError(400, "EmailId is not valide");
    }
    
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName: fullName,
          email: email,
          phone: phone,
          address: address,
          City: City,
          State: State,
          PinCode: PinCode,
          role:role,
          farmeractive:farmeractive

        },
      },
      { returnDocument: "after" }
    ).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return res.status(201).json(
      new Apiresponse(201,  { user: user }, " Account Detailed is updated successful")
    );
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Could not update avatar image"
        )
      );
  }
});
const updatedAvatarImage = asyncHandler(async (req, res) => {
  try {
    const avatarLocalpath = req.file?.path;
    console.log(avatarLocalpath);
    
    if (!avatarLocalpath) {
      throw new ApiError(400, "File is required");
    }
    const newavatar = await UploudOnCloundinary(avatarLocalpath);
    if (!newavatar.url) {
      throw new ApiError(400, "file is not uploaded because of error");
    }
    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: newavatar.url,
        },
      },
      {
        returnDocument: "after",
      }
    ).select("-password");
    return res
      .status(201)
      .json(new Apiresponse(201, user, "Avatar image updated successfully"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(
          status,
          null,
          error.message || "Could not update avatar image"
        )
      );
  }
});
const getAllFarmersDetail=asyncHandler(async(req ,res)=>{
  try {
     const allFarmer = await User.find({role:"farmer"}).select(
      "-password  -refreshToken -accessToken -cartData -wishlist "
    )
     if (!allFarmer) {
      throw new ApiError(404, "something went wrong on getting details of farmer");
     }
     return res.status(302).json(new Apiresponse(302,allFarmer,"successfull getting all details of farmer"))
  } catch (error) {
     const status = error.statusCode || 500
     return res.status(status).json(new Apiresponse(status,null , error.message||"error at fatching details of farmer"))
    
  }
}

)
const adminPanel = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "email and password is required");
    }

    if (
      email !== process.env.ADMIN_EMAIL &&
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res
        .status(401)
        .json(new Apiresponse(401, "Invalide password or emailId"));
    }
    const payload = email + password;
    const token = jwt.sign({ payload }, process.env.ACCES_TOKEN_SECRET, {
      expiresIn: process.env.ACCES_TOKEN_EXPIRY,
    });

    return res
      .status(200)
      .json(new Apiresponse(200 ,{ Token: token }, "Admin login succefull"));
  } catch (error) {
    const status = error.statusCode || 500;
    return res
      .status(status)
      .json(
        new Apiresponse(status, null, error.message || "Admin login failed")
      );
  }
});
const forgetPassword = asyncHandler(async (req, res) => {
  try{
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // This will trigger your pre("save") hook
  user.password = password;
  await user.save();

  return res.status(201).json(
    new Apiresponse(201, {}, "Password updated successfully")
  );}
  catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json(new Apiresponse(status, null, error.message || "Failed to update password"));
  }
});
const DeleteAccountofFarmer = asyncHandler(async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Delete all products created by this farmer
    await Product.deleteMany({
      farmer: farmerId,
    });

    // Deactivate farmer account
    const user = await User.findByIdAndUpdate(
      farmerId,
      {
        $set: {
          farmeractive: "Inactive",
        },
      },
      {
        returnDocument: "after",
      }
    ).select(
      "-password  -cartData -wishlist"
    );

    if (!user) {
      return res.status(404).json(
        new Apiresponse(
          404,
          null,
          "Farmer not found"
        )
      );
    }

    return res.status(200).json(
      new Apiresponse(
        200,
        user,
        "Farmer account deleted successfully"
      )
    );

  } catch (error) {
    const status = error.statusCode || 500;

    return res.status(status).json(
      new ApiResponse(
        status,
        null,
        "Something went wrong while deleting the farmer account"
      )
    );
  }
});

export {
  registerUser,
  loginuser,
  LogoutUser,
  refreshAccessToken,
  changePassword,
  adminPanel,
  updatedAccountDetail,
  updatedAvatarImage,
  getAllFarmersDetail,
  forgetPassword,
  DeleteAccountofFarmer,
  googleLogin
};

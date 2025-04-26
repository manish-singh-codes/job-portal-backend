import { User } from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOTP from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "User already exist with the same email",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    sendEmail(
       email,
       "Verify your email to create your account",
       otp
    )
    const createdUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      otp,
      otpExpiresAt
    });


    return res.status(200).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtp = async (req, res) =>{
    try {
      const {otp, email } = req.body;
       const user = await User.findOne({email});

       if(!user){
        return res.status(404).json({
          message:"User not found this this email",
          success: false
        })
       }
       if(user.otpExpiresAt < new Date()){
          return res.status(400).json({
            message:"OTP expired",
            success: false
          })
       }
       if(user.otp !== otp){
        return res.status(401).json({
          message: "OTP is incorrect",
          success: false
        })
       }

       user.emailVerified = true;
       user.otp = undefined;
       user.otpExpiresAt = undefined;
       await user.save();

       return res.status(200).json({
        message: "OTP verified successfully",
        success: true
      });
      
    } catch (error) {
      console.log(error);
      
    }
}

export const resend = async(req,res)=>{
    const {email} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({
        message: "User not registerd with this email"
      })
    }

    const newOTP = generateOTP();
    user.otp = newOTP;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    sendEmail(
      email,
      "Verify your email to create your account",
      newOTP
    )
    
    await user.save();
    return res.status(200).json({
      message: "OTP sent successfully",
      success: true
    })

}

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Account not exist",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(402).json({
        message: "User Account does not exist with this role",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    // File will be upload here ......
    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }
    const userId = req.id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }
    // update the data

    if (fullname) user.fullname = fullname;
    if (email) {
      const existingUser = await User.find({ email });
      if (existingUser.length > 0) {
        return res.status(403).json({
          message: "Email already exist",
          success: false,
        });
      } else{
        user.email = email;
      }
    }
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    // resume comes later here ..........

    await user.save();


    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (req, res) =>{
   
    const userId = req.id;
    const promise = new Promise((resolve, rejest)=>{
        User.findById(userId).then((user)=>{
            if(!user){
                return rejest({
                    message : "User not found",
                    success : false
                })
            }

            user = {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
                profile: user.profile,
              };
            resolve(user);
        }).catch((error)=>{
            rejest(error)
        });

    }).then((user)=>{
        return res.status(200).json({
            user,
            success : true
          });
    }).catch((error)=>{
        return res.status(400).json({
            message : error.message,
            success : false
        })
    })
  
}

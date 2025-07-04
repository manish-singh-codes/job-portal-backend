import mongoose from "mongoose";
import { type } from "os";


const workExperienceSchema = new mongoose.Schema({
  companyName: String,
  designation: String,
  from: Date,
  to: Date,
  description: String,
});

const educationSchema = new mongoose.Schema({
  course: String,
  institute: String,
  from: Date,
  to: Date,
  gpaOrPercentage: String,
});

const technicalSkillsSchema = new mongoose.Schema({
  programmingLanguages: [String],
  frameworksOrLibraries: [String],
  databases: [String],
  toolsAndTechnologies: [String],
});

const softSkillsSchema = new mongoose.Schema({
  skill: String,
  level: {
    type: String,
    enum: ['Beginner', 'Medium', 'Advance', 'Expert'],
  },
});

const certificationSchema = new mongoose.Schema({
  certificateName: String,
  instituteName: String,
  issueDate: Date,
});

const resumeSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});


const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: { type: [String], default: [""] },
      resume: { type: String },
      resumeOriginalName: { type: String },
      company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: { type: String, default: "" },
    },
    resetToken : {
      type: String,
    },
    resetTokenExpiresAt: {
      type: Date
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date
    },
    overView : {
      workExperience: [workExperienceSchema],
      education: [educationSchema],
      technicalSkills: technicalSkillsSchema,
      softSkills: [softSkillsSchema],
      certifications: [certificationSchema],
      resume: resumeSchema,
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

import { Job } from "../models/job.model.js";

// admin post karega job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.id;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: " All fields are required",
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements,
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    });
    return res.status(201).json({
      message: " New job created successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// student ke liye
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const job = await Job.find(query).populate({
      path : 'company'
    }).sort({createdAt : -1})
    // .populate({
    //   path : 'created_by'
    // })

    if (!job) {
      return {
        message: "Job not found ..",
        success: false,
      };
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

// student ke liye
export const getJobById = async (req, res) => {
  try {
    const jobid = req.params.id;

    const job = await Job.findById(jobid );
    if (!job) {
      return res.status(404).json({
        message: "Job not found ..",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
      message: "Job found successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

// admin ke posted jobs
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const job = await Job.find({ created_by: adminId });
    if (!job) {
      return res.status(404).json({
        message: "Job not found ..",
        success: false,
      });
    }
    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

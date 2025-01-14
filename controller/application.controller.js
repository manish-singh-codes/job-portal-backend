import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const postApplication = async (req, res) => {
  try {
    const userId = req.id;
    // const jobId = req.params.id;      dono same hi hai
    const { id: jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }
    const existingApplication = await Application.findOne({
      applicant: userId,
      job: jobId,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "Application already exists",
        success: false,
      });
    }

    // check if job exist
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(400).json({
        message: "Job not found",
        success: false,
      });
    }
    // create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
    });
    // update job with application id
    await Job.findByIdAndUpdate(jobId, {
      $push: { application: application._id },
    });
    return res.status(200).json({
      message: "Application submitted successfully",
      success: true,
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId }).populate({
      path: "job",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "company",
        options: { sort: { createdAt: -1 } },
      },
    });
    if (!application) {
        return res.status(400).json({
            message: "No applied jobs found",
            success: false,
        })
    }

    return res.status(200).json({
      message: "Applied jobs fetched successfully",
      success: true,
      application,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// admin dekhega ki kitne user ne apply kiya hai
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;;
        const job = await Job.findById(jobId).populate({
            path:"application",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant",
            }
        })
        if(!job){
            return res.status(404).json({
                message: "Job not found",
                success: false,
            })
        }
        return res.status(200).json({
            message: "Applicants fetched successfully",
            success: true,
            job,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}

export const updateStatus = async( req,res)=>{
    try {
        const { status } = req.body;
        const appilcationId = req.params.id;
        if(!status){
            return res.status(404).json({
                message: "Status is required",
                success: false,
            })
        }
        // find the application by application id
        const application = await Application.findOne({_id: appilcationId});
        if(!application){
            return res.status(404).json({
                message: "Application not found",
                success: false,
            })
        }
        application.status = status;
        await application.save();
        return res.status(200).json({
            message: "Status updated successfully",
            success: true,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        })
    }
}
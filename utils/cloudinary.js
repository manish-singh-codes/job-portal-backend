import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


const uploadOnCloudinary = async (fliePath) => {
    try {
        if(!fliePath){
            throw new Error("File path is required for upload");
        }
        const response = await cloudinary.uploader.upload(fliePath,{
            resource_type: 'auto'
        })
        return response.secure_url;
        fs.unlinkSync(fliePath); // Delete the file after upload
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
}

export default uploadOnCloudinary;
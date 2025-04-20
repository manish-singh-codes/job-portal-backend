
const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit OTP
    return otp.toString(); // Convert OTP to string for easier handling
}

export default generateOTP;
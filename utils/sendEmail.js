import nodemailer from 'nodemailer';


const sendEmail = async (to, subject, message) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },  
    })

    const mailOptions = {
        from : process.env.EMAIL,
        to,
        subject: subject,
        html : `  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
        <h2 style="text-align: center; color: #4CAF50;">Email Verification</h2>
        <p style="font-size: 16px; color: #333;">
          Thank you for signing up! To complete your registration, please use the OTP below to verify your email address:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: #4CAF50; color: white; padding: 15px 25px; font-size: 24px; border-radius: 5px; letter-spacing: 5px;">
            ${message}
          </span>
        </div>
        <p style="font-size: 14px; color: #555;">
          This OTP is valid for only <b>5 minutes</b>. Please do not share it with anyone for security reasons.
        </p>
        <p style="font-size: 14px; color: #555;">If you did not request this, please ignore this email.</p>
        <br />
        <p style="font-size: 14px; color: #999;">Regards,<br />The Team</p>
      </div>
    </div> `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    }
    )
}


export default sendEmail
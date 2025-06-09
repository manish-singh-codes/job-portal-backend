import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const sendResendLink = async (to, subject, reset_link) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS,
        },  
    })

    const templatePath = path.join(__dirname, 'templates', 'resetLink.html');
    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    htmlContent = htmlContent.replace('{{reset_link}}', reset_link);

    const mailOptions = {
        from : process.env.EMAIL,
        to,
        subject: subject,
        html : htmlContent,
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


export default sendResendLink
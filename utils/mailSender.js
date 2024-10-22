const nodeMailer = require('nodemailer');

require("dotenv").config();

const mailSender = async (email,body,title)=>{
    try {
        const transporter = nodeMailer.createTransport({
            host : process.env.HOST_MAIL,
            auth : {
                user : process.env.HOST_USER,
                pass : process.env.HOST_PASS
            },
            tls: {
                rejectUnauthorized: false, 
            }
        });

        let info = transporter.sendMail({
            from : "Education platform",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

        console.log(info);
        return info;
        
    } catch (error) {
        console.log("failed to send mail :" , error);
    }
}

module.exports=mailSender;
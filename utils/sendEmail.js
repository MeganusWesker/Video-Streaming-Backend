import {createTransport} from "nodemailer";

export const sendEmail =async(email,subject,text)=>{
   console.log(text);
   let transpoter =createTransport({
      host:process.env.SMPT_HOST,
      port:process.env.SMPT_PORT,
      service:process.env.SMPT_SERVICE,
      auth:{
         user:process.env.SMPT_EMAIL,
         pass:process.env.SMPT_PASS
      }
   });


   await transpoter.sendMail({
        from:process.env.SMPT_EMAIL,
        to:email,
        subject,
        text
    })
}
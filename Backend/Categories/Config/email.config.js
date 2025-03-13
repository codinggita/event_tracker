import nodemailer from "nodemailer";

export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: "everythingdecoding@gmail.com", 
      pass: "twhu pbnj ciog ypri", 
    },
  });
};
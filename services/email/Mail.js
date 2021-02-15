"use strict";
const nodemailer = require("nodemailer");

module.exports = {
  send: async (texto_from, remitente, asunto, texto_plano = "", html = "") => {
    try {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: process.env.HOST_SMTP,
        port: process.env.PORT_CORREO,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.CORREO, // generated ethereal user
          pass: process.env.CORREO_PASSWORD, // generated ethereal password
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `${texto_from} <${process.env.CORREO}>`, // sender address
        //  to: "bar@example.com, baz@example.com", // list of receivers
        to: remitente, // list of receivers

        subject: asunto, // Subject line
        text: texto_plano, // plain text body
        html: html, // html body
      });
      return info.messageId;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};

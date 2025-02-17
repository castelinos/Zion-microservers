import nodemailer from "nodemailer";
import nl2br from "nl2br";

let mailer = nodemailer.createTransport({
    host: "127.0.0.1",  // can add smtp host
    port: 25,           // can add port for smtp
    secure: false,
})

async function sendMail( email ){
    await mailer.sendMail({
        from: 'order@makemyorder.com', 
        to: "customer@gmail.com",
        subject: "Order confirmation", 
        text: email,
        html:`<h1>Order Confirmed</h1><p>${nl2br(email)}</p>`
    });

    console.log('Email sent.');
};

export default sendMail;
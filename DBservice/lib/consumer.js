import sendMail from "./mailer/sendmail.js";

// This is just the callback, which is called with channel.consume(). Kept as reference guide.
export default async function consumeQueue( message ){
    if( message != null ){
        let data = JSON.parse(message.content.toString());
        console.log('Received data in consumer',data);

        // Do some logic here for queue consumer
        // send email or notify in any other way!
        await sendMail(`Hello User\nOrder placed by ${data._id} is confirmed\nTask: ${data.task} will be completed.\n\nThanks.`);
        console.log('Message consumed');
    }
}
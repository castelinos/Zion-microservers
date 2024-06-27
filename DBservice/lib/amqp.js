import amqplib from "amqplib";

/* 
    The RabbitMQ Queue connection.
    This will return a created "channel" to use for producer & consumer.
*/
async function connectQueue(){
    try {
        let connection = await amqplib.connect(process.env.AMQP_URL);
        let channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME,{ noAck:false });
        console.log('Queue connected!')

        return channel;
    } catch (error) {
        console.error('Queue error',error.message)
    }
}

export default connectQueue;
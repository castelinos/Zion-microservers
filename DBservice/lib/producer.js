import connectQueue from "./amqp.js";

// Not useful, in our scenario but kept as a guide.
export default async function createQueueJob( data ){
    try {
        if( !data || typeof data !== 'object') throw error('Not valid data');

        let channel = await connectQueue();
        data = JSON.stringify(data);

        console.log('Received todo data, Now adding');
        console.log(data,'\n');

        channel.sendToQueue(process.env.QUEUE_NAME,Buffer.from(data));
        
    } catch (error) {
        console.error('Error in Queue producer',error.message);
    }
}
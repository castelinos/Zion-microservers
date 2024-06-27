import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import todosRoutes from './routes/todosRoutes.js'
import dotenv from "dotenv"
import { addTodoService, updateTodoService } from './services/todoServices.js';
import sendMail from './lib/mailer/sendmail.js';

import connectQueue from './lib/amqp.js';

dotenv.config(); // dotenv.config() helps fetch .env variables

const app = express();
const port = 3000;
const host = '0.0.0.0';

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use('/api/todos', todosRoutes);

// Connect to MongoDB
try{
  let channel = await connectQueue();

  // Queue consumer. Will execute all created jobs.
  channel.consume(process.env.QUEUE_NAME, async( data )=>{
    if( data !== null ){
        let msg = data.content.toString(); // Convert buffer to string
        msg = JSON.parse(msg); // convert string to JSON object

        let status = {};

        switch( msg.action ){
          case 'add':
            status = await addTodoService(msg.task);
            await sendMail(`Your do was added \n Todo:${msg.task}`);
            console.log('Status',status);
            channel.ack(data); // Use channel and data ( arg received in callback )
            break;
          default:
            console.log('No task action found!');
        }
    }
  },{
    noAck:false // Only delete from queue channel.ack(data) is succeesful
  });

  mongoose.connect('mongodb://mongodb:27017/todos')
}
catch(err){
  console.error('MongoDB connection error:', err.message);
}


app.listen(port, host);
console.log(`Running on http://${host}:${port}`);
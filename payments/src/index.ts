import mongoose from 'mongoose'
import { app } from './app';
import {natsWrapper} from './nats-wrapper';
import {OrderCancelledListener} from './events/listeners/order-cancelled-listener';
import {OrderCreatedListener} from './events/listeners/order-created-listener';
const start = async() => {
    if(!process.env.JWT_KEY) {
        throw new Error('jwt must be defined')
    }
    if(!process.env.MONGO_URI) {
        throw new Error('Mongo db must be defined')
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error('Nats client ID must be defined')
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error('nats cluster id must be defined')
    }
    if(!process.env.NATS_URL) {
        throw new Error('Nats url must be defined')
    }
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
          });

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
        
        new OrderCancelledListener(natsWrapper.client).listen();
        new OrderCreatedListener(natsWrapper.client).listen();
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (error) {
        console.error(error)
    }
    app.listen(3000, ()=> {
        console.log('listen por 3000 ticketService')
    })

}

start();
import mongoose from 'mongoose'
import { app } from './app';
import {natsWrapper} from './nats-wrapper'
import {TicketCreatedListener} from './events/listeners/ticket-created-listener';
import {TicketUpdatedListener} from './events/listeners/ticket-updated-listener';
import {ExpirationCompleteListener} from './events/listeners/expiration-complete-listener';
import {PaymentCreatedListener} from './events/listeners/payment-created-listener'
const start = async() => {
    console.log('init order service')
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
        console.log(process.env.NATS_CLIENT_ID)
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    } catch (error) {
        console.error(error)
    }
    app.listen(3000, ()=> {
        console.log('listen por 3000 orderService')
    })

}

start();
import express, {Request, Response} from 'express';
import {body} from 'express-validator'

import {validateRequest, requireAuth , NotFoundError, OrderStatus, BadRequestError} from '@microservices-loop/common'


import {natsWrapper} from '../nats-wrapper'
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher'

import {Ticket} from '../models/ticket';


const router = express.Router();
import mongoose from 'mongoose';
import { Order } from '../models/order';

const EXPIRATION_WINDOW_SECONDS = 1*60; 

router.post('/api/orders', requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input:string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('ticketId must be provided')
], validateRequest,
async (req: Request, res: Response) =>{
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket) {
        throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if(isReserved) {
        throw new BadRequestError('Ticket is already reserved')
    }
    //calculate expiration time of the order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds()+ EXPIRATION_WINDOW_SECONDS )
    //save to db
    const order = await Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket.id
    })
    await order.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        version: order.version,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id:ticket.id,
            price: ticket.price
        }
    })
    res.status(201).send(order);
    
});


export {router as createOrderRouter};
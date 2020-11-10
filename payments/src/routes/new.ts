import express, {Request, Response} from 'express';
import {body} from 'express-validator'
import {stripe} from '../stripe'
import {validateRequest, requireAuth , NotFoundError, OrderStatus, BadRequestError, NotAuthorizedError} from '@microservices-loop/common'


import {natsWrapper} from '../nats-wrapper'
import {Order} from '../models/order';
import {Payment} from '../models/payment'
import {PaymentCreatedPublisher} from '../events/publishers/payment-created-publisher'

const router = express.Router();
import mongoose from 'mongoose';




router.post('/api/payments', requireAuth, [
    body('token')
        .not()
        .isEmpty()
        .withMessage('token must be provided'),
    body('orderId')
        .not()
        .isEmpty()
        .withMessage('orderId must be provided')
], validateRequest,
async (req: Request, res: Response) =>{
    const  {token, orderId} = req.body;
    const order = await Order.findById(orderId);
    if(!order) {
        throw new NotFoundError()
    }
    if(order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError()
    }
    if(order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Connot pay for an cancelled order')
    }
    const charge = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source: token
    });
    const payment = Payment.build({
        orderId,
        stripeId: charge.id
    })
    await payment.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })
    res.status(201).send({id: payment.id})
});

export { router as createChargeRouter}


export {router as createOrderRouter};
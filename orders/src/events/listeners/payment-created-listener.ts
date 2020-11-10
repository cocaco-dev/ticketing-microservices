import { Message} from 'node-nats-streaming';
import { Subjects, Listener, PaymentCreatedEvent, OrderStatus} from '@microservices-loop/common';
import { Ticket} from'../../models/ticket';
import {Order} from '../../models/order'
import {QueueGroupName} from './queue-group-name'
import {OrderCancelledPublisher} from '../publishers/order-cancelled-publisher'

import { natsWrapper } from '../../nats-wrapper';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    queueGroupName = QueueGroupName.OrdersService;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if(!order){
            throw new Error('order not found')
        }
        order.set({
            status: OrderStatus.Complete
        })
        await order.save();
        msg.ack();
    }
}
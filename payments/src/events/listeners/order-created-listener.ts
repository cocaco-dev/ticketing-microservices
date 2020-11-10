import {Listener, Subjects, OrderCreatedEvent} from '@microservices-loop/common';
import { Message} from 'node-nats-streaming'

import {QueueGroupName} from './queue-group-name';
import {Order} from '../../models/order'


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupName.PaymentService;
    async onMessage(data:OrderCreatedEvent['data'], msg: Message) {
        const order =  Order.build({
            id: data.id,
            version:data.version,
            price: data.ticket.price,
            userId: data.userId,
            status: data.status
        });
        await order.save()
        msg.ack()
    }
}
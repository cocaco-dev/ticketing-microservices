import {Listener, Subjects, OrderCreatedEvent} from '@microservices-loop/common';
import { Message} from 'node-nats-streaming'

import {QueueGroupName} from './queue-group-name';
import {expirationQueue} from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    queueGroupName = QueueGroupName.ExpirationService;
    async onMessage(data:OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()
        console.log(`waiting ${delay} seconds`)
        await expirationQueue.add({
            orderId: data.id
        },{
            delay: delay
        })
        msg.ack();
    }
}
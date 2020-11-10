import {Listener, Subjects, OrderCancelledEvent} from '@microservices-loop/common';
import { Message} from 'node-nats-streaming'

import {QueueGroupName} from './queue-group-name';
import {Ticket} from '../../models/ticket'

import {TicketUpdatedPublisher} from '../publishers/ticket-updated-publisher'
export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    queueGroupName = QueueGroupName.TicketService;
    async onMessage(data:OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket) {
            throw new Error('Ticket not found')
        }
        ticket.set({ orderId: undefined});
        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version});
        msg.ack()
    }
}
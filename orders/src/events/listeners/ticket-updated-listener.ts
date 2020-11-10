import { Message} from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent} from '@microservices-loop/common';
import { Ticket} from'../../models/ticket';

import {QueueGroupName} from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = QueueGroupName.OrdersService;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
       const ticket =  await Ticket.findByEvent(data)
       if(!ticket) {
           throw new Error('ticket not found')
       }
       const {title, price, version } = data;
       ticket.set({title,price, version});
       await ticket.save();
       msg.ack();
    }
}
import {Publisher, Subjects, TicketUpdatedEvent } from '@microservices-loop/common';



export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}
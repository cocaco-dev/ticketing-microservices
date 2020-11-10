import {Publisher, Subjects, TicketCreatedEvent} from '@microservices-loop/common';



export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}
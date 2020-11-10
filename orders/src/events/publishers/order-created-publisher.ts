import { Publisher, OrderCreatedEvent, Subjects } from '@microservices-loop/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject =  Subjects.OrderCreated; 
}


import { Publisher, OrderCancelledEvent, Subjects } from '@microservices-loop/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject =  Subjects.OrderCancelled; 
}


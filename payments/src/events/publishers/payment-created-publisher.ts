import { Subjects, Publisher, PaymentCreatedEvent} from '@microservices-loop/common';


export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
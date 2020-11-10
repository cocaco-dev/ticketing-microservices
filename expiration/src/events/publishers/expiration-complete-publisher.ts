import {Publisher, Subjects, ExpirationCompleteEvent} from '@microservices-loop/common';



export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}
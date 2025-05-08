import { Publisher, Subjects, TicketCreatedEvent } from "@d2tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

// new TicketCreatedPublisher(client).publish({});

import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@d2tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    // Create a ticket
    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    // Save the ticket to the database
    await ticket.save();

    // Acknowledge the message
    msg.ack();
  }
}

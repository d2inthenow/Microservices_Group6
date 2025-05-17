import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@d2tickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const { id, title, price } = data;

    // Find the ticket
    const ticket = await Ticket.findByEvent(data);

    // If not found, throw an error
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Update the ticket
    ticket.set({ title, price });

    // Save the ticket to the database
    await ticket.save();

    // Acknowledge the message
    msg.ack();
  }
}

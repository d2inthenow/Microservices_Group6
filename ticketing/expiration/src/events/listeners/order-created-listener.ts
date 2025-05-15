import { Listener, OrderCreatedEvent, Subjects } from "@d2tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queue/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log(
      `Waiting for ${delay} milliseconds before publishing the expiration:complete event`
    );
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    // Acknowledge the message
    msg.ack();
  }
}

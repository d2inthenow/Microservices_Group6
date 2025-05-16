import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@d2tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;
  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    // Find the order
    const order = await Order.findById(data.orderId).populate("ticket");

    // If the order does not exist, throw an error
    if (!order) {
      throw new Error("Order not found");
    }

    // If the order is already cancelled or complete, do nothing
    // This is important because the order may have been paid for after the expiration
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    // Mark the order as cancelled
    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    // Publish an event saying that the order was cancelled
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    // Acknowledge the message
    msg.ack();
  }
}

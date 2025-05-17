import { queueGroupName } from "./queue-group-name";
import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@d2tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    // If the order is not found, throw an error
    if (!order) {
      throw new Error("Order not found");
    }

    // Mark the order as cancelled
    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    // ack the message
    msg.ack();
  }
}

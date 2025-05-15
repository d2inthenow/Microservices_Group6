import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ExpirationCompleteEvent } from "@d2tickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderStatus } from "@d2tickets/common";
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";

const setup = async () => {
  // Create an instance of the listener
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    userId: "testUserId",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  // Create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, order };
};

it("update the order status to cancelled", async () => {
  const { listener, data, msg, order } = await setup();

  // Call the onMessage function with the data object and message object
  await listener.onMessage({ ...data, orderId: order.id }, msg);

  // Write assertions to make sure a ticket was created
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emit an OrderCancelled event", async () => {
  const { listener, data, msg, order } = await setup();

  // Call the onMessage function with the data object and message object
  await listener.onMessage({ ...data, orderId: order.id }, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
  const { listener, data, msg, order } = await setup();

  // Call the onMessage function with the data object and message object
  await listener.onMessage({ ...data, orderId: order.id }, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

import express, { Request, Response } from "express";
import { requireAuth } from "@d2tickets/common";
import { Order } from "../models/order";
import {
  OrderStatus,
  NotFoundError,
  NotAuthorizedError,
} from "@d2tickets/common";

const router = express.Router();

router.delete("/api/orders/:orderId", async (req: Request, res: Response) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled;
  await order.save();

  res.status(204).send(order);
});

export { router as deleteOrderRouter };

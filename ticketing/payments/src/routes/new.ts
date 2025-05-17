import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@d2tickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payments";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

//Stripe checkout component
// router.post(
//   "/api/payments",
//   requireAuth,
//   [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
//   validateRequest,
//   async (req: Request, res: Response) => {
//     const { token, orderId } = req.body;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       throw new NotFoundError();
//     }
//     if (order.userId !== req.currentUser!.id) {
//       throw new NotAuthorizedError();
//     }
//     if (order.status === OrderStatus.Cancelled) {
//       throw new BadRequestError("Cannot pay for an cancelled order");
//     }

//     const charge = await stripe.charges.create({
//       currency: "usd",
//       amount: order.price * 100,
//       source: token,
//     });
//     const payment = Payment.build({
//       orderId,
//       stripeId: charge.id,
//     });
//     await payment.save();
//     new PaymentCreatedPublisher(natsWrapper.client).publish({
//       id: payment.id,
//       orderId: payment.orderId,
//       stripeId: payment.stripeId,
//     });

//     res.status(201).send({ id: payment.id });
//   }
// );

// Stripe checkout session

router.post(
  "/api/payments",
  requireAuth,
  [body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for a cancelled order");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Order for ${order.id}`,
            },
            unit_amount: order.price * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `http://ticketing.d2dev/orders`,
      cancel_url: `http://ticketing.d2dev/`,
      customer_email: req.currentUser!.email,
      metadata: {
        orderId: order.id,
      },
    });

    res.send({ url: session.url }); // Gửi URL để frontend redirect
  }
);

export { router as createChargeRouter };

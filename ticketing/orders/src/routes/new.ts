import express, { Request, Response } from "express";
import { requireAuth, validateRequest } from "@d2tickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuth,
  [
    body("titleId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TitleId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send("Hello World!");
  }
);

export { router as newOrderRouter };

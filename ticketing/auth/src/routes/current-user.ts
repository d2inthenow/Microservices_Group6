import express = require("express");
import jwt from "jsonwebtoken";

import { requireAuth } from "../middlewares/require-auth";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

import express from "express";
import { json } from "body-parser";

import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Middleware to handle errors
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth service is running on port 3000!");
});

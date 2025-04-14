import express from "express";
import "express-async-errors"; // Giúp xử lý các lỗi bất đồng bộ
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); // Để sử dụng cookie trên HTTPS
app.use(json());
app.use(
  cookieSession({
    signed: false, // Không mã hóa cookie
    secure: true, // Chỉ sử dụng secure nếu đang chạy trên HTTPS
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// Route để bắt tất cả các route không xác định và ném lỗi NotFoundError
app.all("*", async (req, res, next) => {
  next(new NotFoundError()); // Dùng next để chuyển lỗi đến middleware
});

// Middleware xử lý lỗi
app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Auth service listening on port 3000!");
  });
};

start();

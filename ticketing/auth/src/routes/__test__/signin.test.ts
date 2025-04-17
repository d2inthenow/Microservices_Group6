import { app } from "../../app";
import request from "supertest";

it("fails when a email that not exist is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "duong@gmail.com",
      password: "password",
    })
    .expect(400);
});

it("fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "duong@gmail.com",
      password: "12345",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "duong0023@gmail.com",
      password: "password123",
    })
    .expect(400);
});

it("responds with a cookie when given valid credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "duong@gmail.com",
      password: "12345",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "duong@gmail.com",
      password: "12345",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

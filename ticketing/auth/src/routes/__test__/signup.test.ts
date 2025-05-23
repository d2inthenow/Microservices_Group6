import { app } from "../../app";
import request from "supertest";

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "duong@gmail.com",
      password: "12345",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "duong",
      password: "12345",
    })
    .expect(400);
});
it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "duong@gmail.com",
      password: "1",
    })
    .expect(400);
});
it("returns a 400 with an invalid missing email and password", async () => {
  await request(app).post("/api/users/signup").send({
    email: "duong0023@gmail.com",
  });

  await request(app)
    .post("/api/users/signup")
    .send({
      password: "2",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "duong@gmai.com",
      password: "12345",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "duong@gmai.com",
      password: "12345",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "duong0023@gmail.com",
      password: "12345",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

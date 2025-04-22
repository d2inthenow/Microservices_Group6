import { app } from "../../app";
import request from "supertest";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  console.log("STATUS:", response.status);
  expect(response.status).not.toEqual(401);
});

it("test cookie manually", async () => {
  const cookie = global.signin();
  console.log("Cookie used:", cookie);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});

  console.log("RESPONSE STATUS:", response.status);
  console.log("BODY:", response.body);
});

it("return an error if an invalid title is provided ", async () => {});

it("return an error if an invalid price is provided ", async () => {});

it("creates a ticket with valid inputs", async () => {});

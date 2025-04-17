import { app } from "../../app";
import request from "supertest";

it("clears the cookie after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "duong@gmail.com",
      password: "12345",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  //   console.log(response.get("Set-Cookie"));
  const cookies = response.get("Set-Cookie");

  expect(cookies).toBeDefined();
  expect(cookies![0]).toMatch(/session=;/);
  expect(cookies![0]).toMatch(/expires=Thu, 01 Jan 1970/i);
});

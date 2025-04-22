import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "testkey";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Database connection is not established");
  }

  const collections = await db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  //   Build a JWT payload { id, email }
  const payload = {
    id: "123asfsa41",
    email: "duong@gmail.com",
  };

  //   Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build a session object { jwt: MY_JWT }
  const session = { jwt: token };

  //   Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  const cookie = `express:sess=${base64}`;

  console.log("SIGNIN COOKIE:", cookie);

  console.log("JWT Created:", token);

  // return a string that's the cookie with the encoded data
  return [`express:sess=${base64}`];
};

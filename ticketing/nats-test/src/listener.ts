import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");

  const subscription = stan.subscribe(
    "ticket:created",
    "queue-group-name",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(
        `Message received: ${msg.getSequence()} , with data: ${data}`
      );
    }
    msg.ack(); // Acknowledge the message
  });
});

process.on("SIGINT", () => stan.close()); // Close the connection when the process is interrupted (Ctrl+C)
process.on("SIGTERM", () => stan.close()); // Close the connection when the process is terminated (e.g., in a Kubernetes pod shutdown)

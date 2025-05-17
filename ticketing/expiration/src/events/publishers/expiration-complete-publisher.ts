import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@d2tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

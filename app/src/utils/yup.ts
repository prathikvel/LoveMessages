import ObjectID from "bson-objectid";
import { addMethod, string, Message } from "yup";

addMethod(string, "isMongoId", function isMongoId(message?: Message) {
  return this.test({
    name: "isMongoId",
    message: message,
    test: (value) => value !== undefined && ObjectID.isValid(value),
  });
});

export {};

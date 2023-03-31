import { User } from "../../auth";
import { MongodbTimestampedObject } from "../../../types/mongodb";

export interface LoveMessageBody {
  recipient: string;
  message: string;
}

export interface LoveMessage extends MongodbTimestampedObject {
  author: User;
  recipient: User;
  message: string;
}

export interface LoveMessageAuthor extends User {
  latestAt: string;
  hasUnviewed: boolean;
}

export interface MongodbObject {
  _id: string;
  __v: number;
}

export interface MongodbTimestampedObject extends MongodbObject {
  createdAt: string;
  updatedAt: string;
}

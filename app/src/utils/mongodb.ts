// used for optimistic ui

import ObjectID from "bson-objectid";

// get mongodb object with _id and __v
export const getMongodbObject = <T>(obj: T) => {
  return { _id: new ObjectID().toHexString(), __v: 0, ...obj };
};

// get mongodb object with _id, __v, and timestamps
export const getMongodbTimestampedObject = <T>(obj: T) => {
  return {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...getMongodbObject(obj),
  };
};

import { useAuth, User } from "../../auth";
import {
  readLoveMessagesByAuthor,
  createLoveMessage,
  updateLoveMessage,
  deleteLoveMessage,
} from "../services";
import useRestApi from "../../../hooks/useRestApi";
import { LoveMessageBody, LoveMessage } from "../types";
import { getMongodbTimestampedObject } from "../../../utils/mongodb";

// get LoveMessage from LoveMessageBody
const getLoveMessage = (
  body: LoveMessageBody,
  author: User,
  recipient: User
): LoveMessage => ({ ...getMongodbTimestampedObject(body), author, recipient });

const useAuthored = () => {
  // to get author
  const auth = useAuth();

  const restApi = useRestApi(
    readLoveMessagesByAuthor,
    createLoveMessage,
    updateLoveMessage,
    deleteLoveMessage
  );

  const addItem = (body: LoveMessageBody, recipient: User, cb?: Function) => {
    const optimistic = getLoveMessage(body, auth.user!, recipient);
    restApi.add.addItem(body, optimistic, cb);
  };

  const editItem = (
    id: string,
    body: LoveMessageBody,
    recipient: User,
    cb?: Function
  ) => {
    const optimistic = getLoveMessage(body, auth.user!, recipient);
    restApi.edit.editItem(id, body, optimistic, cb);
  };

  return {
    loveMessages: restApi.data,
    view: restApi.view,
    add: { ...restApi.add, addItem },
    edit: { ...restApi.edit, editItem },
    remove: restApi.remove,
  };
};

export default useAuthored;

import axios from "axios";

import { LoveMessageBody, LoveMessage, LoveMessageAuthor } from "../types";
import { Data } from "../../../types/axios";

const api = axios.create({ baseURL: "/api/loveMessages" });

// read all loveMessages by author
export const readLoveMessagesByAuthor = async () => {
  return api.get<Data<LoveMessage[]>>("/authored").then((res) => res.data.data);
};

// read all users who sent loveMessages to recipient
export const readLoveMessageAuthors = async () => {
  return api
    .get<Data<LoveMessageAuthor[]>>("/received/users")
    .then((res) => res.data.data);
};

// read all loveMessages from author viewed by recipient
export const readLoveMessagesViewed = async (author: string) => {
  return api
    .get<Data<LoveMessage[]>>(`/received/users/${author}`)
    .then((res) => res.data.data);
};

// read random unviewed loveMessage by recipient
export const readRandomLoveMessage = async (author: string) => {
  return api
    .get<Data<LoveMessage | null>>(`/received/users/${author}/random`)
    .then((res) => res.data.data);
};

// read loveMessage by id
export const readLoveMessageById = async (id: string) => {
  return api.get<Data<LoveMessage>>(`/${id}`).then((res) => res.data.data);
};

// create loveMessage
export const createLoveMessage = async (body: LoveMessageBody) => {
  return api.post<Data<LoveMessage>>("/", body).then((res) => res.data.data);
};

// update loveMessage
export const updateLoveMessage = async (id: string, body: LoveMessageBody) => {
  return api
    .put<Data<LoveMessage>>(`/${id}`, body)
    .then((res) => res.data.data);
};

// delete loveMessage
export const deleteLoveMessage = async (id: string) => {
  return api.delete<Data<LoveMessage>>(`/${id}`).then((res) => res.data.data);
};

import axios from "axios";

import { Credentials, User } from "../types";
import { Data } from "../../../types/axios";

const api = axios.create({ baseURL: "/api" });

// read users
export const readUsers = async () => {
  return api.get<Data<User[]>>("/users").then((res) => res.data.data);
};

// read current user
export const readCurrentUser = async () => {
  return api.get<Data<User>>("/users/current").then((res) => res.data.data);
};

// read user by id
export const readUserById = async (id: string) => {
  return api.get<Data<User>>(`/users/${id}`).then((res) => res.data.data);
};

// login
export const logIn = async (credentials: Credentials) => {
  return api
    .post<Data<null>>("/login", credentials)
    .then((res) => res.data.data);
};

// logout
export const logOut = async () => {
  return api.post<Data<null>>("/logout").then((res) => res.data.data);
};

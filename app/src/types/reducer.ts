export enum ActionType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  REFRESH = "REFRESH",
}

export interface Action {
  type: ActionType;
  payload: any;
}

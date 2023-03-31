import { useState, useReducer, useEffect, useMemo, useCallback } from "react";

import { MongodbObject } from "../types/mongodb";
import { ActionType } from "../types/reducer";
import { Status } from "../types/status";

type Action<T> =
  | { type: ActionType.CREATE; payload: T }
  | { type: ActionType.UPDATE; payload: T }
  | { type: ActionType.DELETE; payload: string }
  | { type: ActionType.REFRESH; payload: T[] };

// returns a function to generically type the reducer
const createDataReducer =
  <T extends MongodbObject>() =>
  (state: T[], action: Action<T>) => {
    switch (action.type) {
      case ActionType.CREATE:
        return [...state, action.payload];
      case ActionType.UPDATE:
        const id = action.payload._id;
        const index = state.findIndex((item) => item._id === id);
        if (index !== -1) {
          return [
            ...state.slice(0, index),
            { ...state[index], ...action.payload },
            ...state.slice(index + 1),
          ];
        }
        return state;
      case ActionType.DELETE:
        return state.filter((item) => item._id !== action.payload);
      case ActionType.REFRESH:
        return action.payload;
      default:
        return state;
    }
  };

const useRestApi = <T extends MongodbObject, D>(
  readItems: () => Promise<T[]>,
  createItem: (body: D) => Promise<T>,
  updateItem: (id: string, body: D) => Promise<T>,
  deleteItem: (id: string) => Promise<T>
) => {
  const dataReducer = useMemo(() => createDataReducer<T>(), []);
  const [data, dispatchData] = useReducer(dataReducer, []);

  const [viewStatus, setViewStatus] = useState<Status | null>(null);
  const [viewIsLoading, setViewIsLoading] = useState<boolean>(false);
  // memoize function for useEffect
  const viewItems = useCallback(
    (cb?: Function) => {
      setViewStatus(null);
      setViewIsLoading(true);
      readItems()
        .then((data) => {
          // refresh data
          dispatchData({ type: ActionType.REFRESH, payload: data });
          typeof cb === "function" && cb();
        })
        .catch((err) => {
          const message = err?.response?.data?.error?.message;
          setViewStatus({ type: "error", message: message || err.message });
        })
        .finally(() => setViewIsLoading(false));
    },
    [readItems]
  );

  // fetch items
  useEffect(() => {
    viewItems();
  }, [viewItems]);

  const [addStatus, setAddStatus] = useState<Status | null>(null);
  const [addIsLoading, setAddIsLoading] = useState<boolean>(false);
  const addItem = (body: D, optimistic: T, cb?: Function) => {
    // reset status
    setAddStatus(null);

    // assume success
    dispatchData({ type: ActionType.CREATE, payload: optimistic });

    // request api data
    setAddIsLoading(true);
    createItem(body)
      .then((data) => {
        // rollback changes
        dispatchData({ type: ActionType.DELETE, payload: optimistic._id });
        // add correct data
        dispatchData({ type: ActionType.CREATE, payload: data });
        typeof cb === "function" && cb();
      })
      .catch((err) => {
        // rollback changes
        dispatchData({ type: ActionType.DELETE, payload: optimistic._id });
        const message = err?.response?.data?.error?.message;
        setAddStatus({ type: "error", message: message || err.message });
      })
      .finally(() => setAddIsLoading(false));
  };

  const [editStatus, setEditStatus] = useState<Status | null>(null);
  const [editIsLoading, setEditIsLoading] = useState<boolean>(false);
  const editItem = (id: string, body: D, optimistic: T, cb?: Function) => {
    // reset status
    setEditStatus(null);

    // get current item
    const currentItem = data.find((item) => item._id === id);
    if (!currentItem) {
      setEditStatus({ type: "error", message: "Invalid ID" });
      return;
    }

    // assume success
    optimistic = { ...optimistic, _id: id };
    dispatchData({ type: ActionType.UPDATE, payload: optimistic });

    // request api data
    setEditIsLoading(true);
    updateItem(id, body)
      .then((data) => {
        // update correct data
        dispatchData({ type: ActionType.UPDATE, payload: data });
        typeof cb === "function" && cb();
      })
      .catch((err) => {
        // rollback changes
        dispatchData({ type: ActionType.UPDATE, payload: currentItem });
        const message = err?.response?.data?.error?.message;
        setEditStatus({ type: "error", message: message || err.message });
      })
      .finally(() => setEditIsLoading(false));
  };

  const [removeStatus, setRemoveStatus] = useState<Status | null>(null);
  const [removeIsLoading, setRemoveIsLoading] = useState<boolean>(false);
  const removeItem = (id: string, cb?: Function) => {
    // reset status
    setRemoveStatus(null);

    // get current item
    const currentItem = data.find((item) => item._id === id);
    if (!currentItem) {
      setRemoveStatus({ type: "error", message: "Invalid ID" });
      return;
    }

    // assume success
    dispatchData({ type: ActionType.DELETE, payload: id });

    // request api data
    setRemoveIsLoading(true);
    deleteItem(id)
      .then(() => typeof cb === "function" && cb())
      .catch((err) => {
        // rollback changes
        dispatchData({ type: ActionType.CREATE, payload: currentItem });
        const message = err?.response?.data?.error?.message;
        setRemoveStatus({ type: "error", message: message || err.message });
      })
      .finally(() => setRemoveIsLoading(false));
  };

  return {
    data,
    view: { status: viewStatus, isLoading: viewIsLoading, viewItems },
    add: { status: addStatus, isLoading: addIsLoading, addItem },
    edit: { status: editStatus, isLoading: editIsLoading, editItem },
    remove: { status: removeStatus, isLoading: removeIsLoading, removeItem },
  };
};

export default useRestApi;

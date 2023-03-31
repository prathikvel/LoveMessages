import { useState, useEffect, useCallback } from "react";

import {
  readLoveMessageAuthors,
  readLoveMessagesViewed,
  readRandomLoveMessage,
} from "../services";
import { LoveMessage, LoveMessageAuthor } from "../types";
import { Status } from "../../../types/status";

const useReceived = () => {
  const [authors, setAuthors] = useState<LoveMessageAuthor[]>([]);
  const [viewed, setViewed] = useState<LoveMessage[][]>([]);
  const [random, setRandom] = useState<LoveMessage | null>(null);

  const [authorsStatus, setAuthorsStatus] = useState<Status | null>(null);
  const [authorsIsLoading, setAuthorsIsLoading] = useState<boolean>(false);
  const viewAuthors = useCallback((cb?: Function) => {
    setAuthorsIsLoading(true);
    readLoveMessageAuthors()
      .then((data) => {
        setAuthors(data);
        typeof cb === "function" && cb();
      })
      .catch((err) => {
        const message = err?.response?.data?.error?.message;
        setAuthorsStatus({ type: "error", message: message || err.message });
      })
      .finally(() => setAuthorsIsLoading(false));
  }, []);

  const [viewedStatus, setViewedStatus] = useState<Status | null>(null);
  const [viewedIsLoading, setViewedIsLoading] = useState<boolean>(false);
  const viewViewed = useCallback(
    (cb?: Function) => {
      const viewViewedHelper = async (authors: LoveMessageAuthor[]) => {
        let state: LoveMessage[][] = [];
        for (const author of authors) {
          state.push(await readLoveMessagesViewed(author._id));
        }
        return state;
      };

      setViewedIsLoading(true);
      viewViewedHelper(authors)
        .then((data) => {
          setViewed(data);
          typeof cb === "function" && cb();
        })
        .catch((err) => {
          const message = err?.response?.data?.error?.message;
          setViewedStatus({ type: "error", message: message || err.message });
        })
        .finally(() => setViewedIsLoading(false));
    },
    [authors]
  );

  const [randomStatus, setRandomStatus] = useState<Status | null>(null);
  const [randomIsLoading, setRandomIsLoading] = useState<boolean>(false);
  const viewRandom = (authorId: string, cb?: Function) => {
    setRandom(null);
    setRandomIsLoading(true);
    readRandomLoveMessage(authorId)
      .then((data) => {
        if (!data) {
          throw new Error("No More Love Messages");
        }
        setRandom(data);
        const index = authors.findIndex((author) => authorId === author._id);
        if (index !== -1) {
          setViewed((state) => [
            ...state.slice(0, index),
            [...state[index], data],
            ...state.slice(index + 1),
          ]);
        }
        viewAuthors(); // will cause viewViewed() to run
        typeof cb === "function" && cb();
      })
      .catch((err) => {
        const message = err?.response?.data?.error?.message;
        setRandomStatus({ type: "error", message: message || err.message });
      })
      .finally(() => setRandomIsLoading(false));
  };

  useEffect(() => {
    viewAuthors();
  }, [viewAuthors]);

  useEffect(() => {
    viewViewed();
  }, [viewViewed]);

  return {
    authors: {
      authors,
      status: authorsStatus,
      isLoading: authorsIsLoading,
      viewAuthors,
    },
    viewed: {
      viewed,
      status: viewedStatus,
      isLoading: viewedIsLoading,
      viewViewed,
    },
    random: {
      random,
      status: randomStatus,
      isLoading: randomIsLoading,
      viewRandom,
    },
  };
};

export default useReceived;

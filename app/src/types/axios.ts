export interface Data<T> {
  data: T;
}

export interface Error {
  error: {
    name?: string;
    status?: number;
    message?: string;
    [key: string]: any;
  };
}

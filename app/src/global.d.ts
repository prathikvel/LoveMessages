declare module "yup" {
  interface StringSchema<TType, TContext, TDefault, TFlags> {
    isMongoId(message?: Message): this;
  }
}

export {};

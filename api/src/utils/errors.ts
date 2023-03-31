class CustomError extends Error {
  // status code
  status: number;
  // custom production error
  errorProd?: { [key: string]: any };
  // custom development error
  errorDev?: { [key: string]: any };

  constructor(
    name: string,
    status: number,
    message: string,
    errorProd?: { [key: string]: any },
    errorDev?: { [key: string]: any }
  ) {
    // super
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype); // for typescript

    // set variables
    this.name = name;
    this.status = status;
    this.errorProd = errorProd;
    this.errorDev = errorDev;

    // fixes json output
    Object.defineProperty(CustomError.prototype, "toJSON", {
      value: function () {
        var alt: { [key: string]: any } = {};
        Object.getOwnPropertyNames(this).forEach(function (this: any, key) {
          alt[key] = this[key];
        }, this);
        return alt;
      },
      configurable: true,
      writable: true,
    });
  }
}

export class ClientError extends CustomError {
  constructor(
    status: number,
    message: string,
    errorProd?: { [key: string]: any },
    errorDev?: { [key: string]: any }
  ) {
    // super
    super("ClientError", status, message, errorProd, errorDev);
    Object.setPrototypeOf(this, ClientError.prototype); // for typescript
  }
}

export class AuthenticationError extends ClientError {
  constructor(
    message: string,
    errorProd?: { [key: string]: any },
    errorDev?: { [key: string]: any }
  ) {
    // super
    super(401, message, errorProd, errorDev);
    Object.setPrototypeOf(this, ClientError.prototype); // for typescript

    // set variables
    this.name = "AuthenticationError";
  }
}

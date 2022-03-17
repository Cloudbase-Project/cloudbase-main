import { ValidationError } from 'class-validator';

export class ValidationException extends Error {
  constructor(public errors: ValidationError[]) {
    super('Invalid request');
    Object.setPrototypeOf(this, ValidationException.prototype);
  }

  statusCode = 400;

  static throwValidationException = (errors: ValidationError[] = []) => {
    return new ValidationException(errors);
  };

  serializeError() {
    let x = [];
    this.errors.forEach((error) => {
      Object.keys(error.constraints).forEach((constraint) => {
        x.push({
          field: error.property,
          message: error.constraints[constraint],
        });
      });
    });
    return x;
  }
}

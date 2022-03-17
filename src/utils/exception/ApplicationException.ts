export class ApplicationException extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    Object.setPrototypeOf(this, ApplicationException.prototype);
  }

  public getStatus(): number {
    return this.status;
  }
}

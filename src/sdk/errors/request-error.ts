export class ResponseError extends Error {
  private response: Response;

  constructor(response: Response, message: string) {
    super(message);

    this.response = response;

    Object.setPrototypeOf(this, ResponseError.prototype);
  }

  public getResponse() {
    return this.response;
  }
}

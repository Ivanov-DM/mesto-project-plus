export default class NotFoundErr extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export {};

declare global {
  namespace Express {
    interface Request {
      //   currentUser?: User;
      email?: string;
      id?: string;
    }
  }
}

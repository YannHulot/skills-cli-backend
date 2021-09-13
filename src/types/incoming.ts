export interface IncomingNewUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IncomingUpdateUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

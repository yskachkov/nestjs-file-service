export interface User {
  id: number;
  username: string;
  password: string;
}

export type UserFindOptions = Partial<Pick<User, 'username' | 'id'>>;

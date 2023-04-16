import { JwtPayload } from 'jsonwebtoken';

export type User = {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  data: {
    someAttribute: string;
  };
};

export enum UserRoles {
  Admin = 'admin',
  User = 'user',
}

export type TokenPayload = {
  username: string;
  role: UserRoles.Admin | UserRoles.User;
};

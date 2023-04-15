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

export type TokenPayload =  JwtPayload & {
  username: string;
};

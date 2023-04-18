import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Request, Response } from 'express';

import { TokenPayload, UserRoles } from './types';

export const decodeJwt = async (token: string, res: Response) => {
  try {
    const { data: publicSecret } = await axios.get(`${process.env.APP_URL}/pem`);
    const decoded = jwt.verify(token, publicSecret, {
      algorithms: ['RS256']
    });

    return {
      decodedToken: decoded as TokenPayload
    };
  } catch (err) {

    return {
      errorCode: 401
    };
  }
};

export const canPerformAction = async (
  req: Request,
  res: Response,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] ?? '';

  const {
    decodedToken,
    errorCode,
  } = await decodeJwt(token, res);

  if (errorCode) {
    return {
      errorCode,
    };
  }

  if (!decodedToken || !decodedToken.role) {
    return {
      errorCode: 401,
    };
  }
  const { role } = decodedToken;

  if (role === UserRoles.User) {
    return {
      errorCode: req.method !== 'GET' && 403,
    };
  }

  return {
    errorCode: undefined,
  };
};

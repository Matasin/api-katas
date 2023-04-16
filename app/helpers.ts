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
    return decoded as TokenPayload;
  } catch (err) {
    res.sendStatus(401);
    return null;
  }
};

export const canPerformAction = async (
  req: Request,
  res: Response,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] ?? '';

  const decoded = await decodeJwt(token, res);

  if (!decoded || !decoded.role) {
    res.sendStatus(401);
    return;
  }

  const { role } = decoded;

  if (role === UserRoles.User && req.method !== 'GET') {
    res.sendStatus(403);
    return;
  }

  return role === UserRoles.Admin;
};

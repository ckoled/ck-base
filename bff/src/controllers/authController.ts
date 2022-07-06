import { Response, NextFunction } from 'express';
import { Request } from 'express-jwt';
import httpStatus from 'http-status';

import { deleteSession } from '../services/sessions';

import * as userSvc from '../services/userService';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const { ip } = req;
    const userAgent = req.get('user-agent') || '';

    const { user, sessionId, apiToken, refreshToken } = (await userSvc.login({username, password, ip, userAgent }))!

    res.cookie('session', sessionId, { httpOnly: true, secure: true, signed: true });
    res.status(httpStatus.OK).json({
      apiToken,
      refreshToken,
      user
    })
  } catch (e) {
    console.log('Login error', e);
    next(e);
  }
}

export const currentSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(httpStatus.OK).json({token: req.auth?.jti});
  } catch (e) {
    console.log('Current Session error', e);
    next(e);
  }
}

export const renewSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ip } = req;
    const userAgent = req.get('user-agent') || '';

    const { user, sessionId, apiToken } = await userSvc.renewSession(req.auth?.jti!, ip, userAgent);

    res.cookie('session', sessionId, { httpOnly: true, secure: true, signed: true });
    res.status(httpStatus.OK).json({
      apiToken,
      user
    })
  } catch (e) {
    console.log('Renew Session error', e);
    next(e);
  }
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await userSvc.createUser(req.body);
    res.status(httpStatus.OK).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } catch (e) {
    console.log('Register error', e);
    next(e);
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    deleteSession(req.auth?.jti);
    res.status(httpStatus.OK).end();
  } catch (e) {
    console.log('Logout error', e);
    next(e);
  }
}
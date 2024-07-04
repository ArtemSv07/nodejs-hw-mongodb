import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { sessionCollection } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/index.js';

import { UserCollection } from '../db/models/user.js';

export const registerUser = async data => {
  const user = await UserCollection.findOne({ email: data.email });
  if (user) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(data.password, 10);

  return await UserCollection.create({
    ...data,
    password: encryptedPassword,
  });
};

export const loginUser = async data => {
  const user = await UserCollection.findOne({ email: data.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const isEqual = await bcrypt.compare(data.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await sessionCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await sessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  });
};

export const logoutUser = async sessionId => {
  await sessionCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  };
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await sessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await sessionCollection.deleteOne({ _id: sessionId, refreshToken });

  return await sessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
